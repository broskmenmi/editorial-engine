import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { readLedger } from './ledger.js';
import { SpotifyClient, arraysEqual, refreshAccessToken } from './spotify.js';

function hasFlag(name) {
  return process.argv.includes(name);
}

function option(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function now() {
  return new Date().toISOString();
}

function normalizeText(value) {
  return String(value ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
}

async function readCoverBase64(playlistDir, config) {
  if (!config.coverImageBase64Path) return null;
  const coverPath = path.resolve(playlistDir, config.coverImageBase64Path);
  const value = (await fs.readFile(coverPath, 'utf8')).replace(/\s+/g, '');
  if (!value) throw new Error(`Playlist cover file is empty: ${coverPath}`);
  const bytes = Buffer.from(value, 'base64');
  if (bytes.length === 0) throw new Error(`Playlist cover is not valid base64: ${coverPath}`);
  if (bytes.length > 256 * 1024) throw new Error(`Playlist cover exceeds Spotify's 256 KB limit: ${bytes.length} bytes.`);
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error('Playlist cover must be a JPEG image.');
  return value;
}

async function main() {
  const repoRoot = path.resolve(option('--repo-root', process.cwd()));
  const playlistDir = path.resolve(repoRoot, option('--playlist-dir', 'playlists/groove-over-noise'));
  const ledgerPath = path.join(playlistDir, 'ledger.md');
  const configPath = path.join(playlistDir, 'spotify.json');
  const statusPath = path.join(playlistDir, 'spotify-status.json');
  const dryRun = hasFlag('--dry-run');
  const allowEmpty = hasFlag('--allow-empty');

  const rows = await readLedger(ledgerPath, { allowEmpty });
  const desiredUris = rows.map((row) => row.uri);
  const config = await readJson(configPath);
  const coverBase64 = await readCoverBase64(playlistDir, config);

  const tokenResult = await refreshAccessToken({
    clientId: requiredEnv('SPOTIFY_CLIENT_ID'),
    refreshToken: requiredEnv('SPOTIFY_REFRESH_TOKEN'),
  });
  const spotify = new SpotifyClient(tokenResult.accessToken);
  const me = await spotify.getCurrentUser();

  let playlist = null;
  if (config.playlistId) {
    try {
      playlist = await spotify.getPlaylist(config.playlistId);
    } catch (error) {
      if (error.status !== 404) throw error;
    }
  }

  const creationRequired = !playlist;
  if (playlist && playlist.owner?.id !== me.id) {
    throw new Error('Configured playlist is not owned by the authenticated Spotify user.');
  }

  if (dryRun) {
    const currentUris = playlist ? await spotify.getAllPlaylistUris(playlist.id) : [];
    console.log(JSON.stringify({
      dryRun: true,
      playlistId: playlist?.id ?? null,
      creationRequired,
      currentTrackCount: currentUris.length,
      desiredTrackCount: desiredUris.length,
      exactMatch: arraysEqual(currentUris, desiredUris),
      coverConfigured: Boolean(coverBase64),
      desired: rows,
    }, null, 2));
    return;
  }

  if (!playlist) {
    playlist = await spotify.createPlaylist({
      name: config.playlistName,
      description: config.description,
      isPublic: Boolean(config.public),
    });
    config.playlistId = playlist.id;
    config.ownerUserId = me.id;
    await writeJson(configPath, config);
  } else {
    if (config.ownerUserId && config.ownerUserId !== me.id) {
      throw new Error('spotify.json ownerUserId does not match the authenticated Spotify user.');
    }
    config.ownerUserId = me.id;
  }

  await spotify.updatePlaylistDetails(playlist.id, {
    name: config.playlistName,
    description: config.description,
    isPublic: Boolean(config.public),
  });

  let coverUploaded = false;
  if (coverBase64) {
    await spotify.uploadPlaylistCover(playlist.id, coverBase64);
    coverUploaded = true;
  }

  const snapshotId = await spotify.replacePlaylistItems(playlist.id, desiredUris);
  const actualUris = await spotify.getAllPlaylistUris(playlist.id);
  const exactMatch = arraysEqual(actualUris, desiredUris);
  const actualPlaylist = await spotify.getPlaylist(playlist.id);
  const nameMatch = normalizeText(actualPlaylist.name) === normalizeText(config.playlistName);
  const descriptionMatch = normalizeText(actualPlaylist.description) === normalizeText(config.description);
  const privacyMatch = actualPlaylist.public == null
    ? Boolean(config.public) === false
    : Boolean(actualPlaylist.public) === Boolean(config.public);
  const metadataMatch = nameMatch && descriptionMatch && privacyMatch;
  const images = coverBase64 ? await spotify.getPlaylistImages(playlist.id) : [];
  const coverPresent = !coverBase64 || images.length > 0;
  const complete = exactMatch && metadataMatch && coverPresent;

  const status = {
    status: complete ? 'COMPLETE' : 'PARTIAL',
    playlistId: playlist.id,
    playlistUrl: `https://open.spotify.com/playlist/${playlist.id}`,
    ledgerCommit: process.env.GITHUB_SHA ?? null,
    ledgerTrackCount: desiredUris.length,
    spotifyTrackCount: actualUris.length,
    metadataVerified: metadataMatch,
    metadataChecks: {
      nameMatch,
      descriptionMatch,
      privacyMatch,
    },
    coverConfigured: Boolean(coverBase64),
    coverUploaded,
    coverPresent,
    verifiedAt: now(),
    snapshotId,
    error: complete ? null : 'Spotify read-back did not exactly match ledger, metadata, or cover state.',
  };
  await writeJson(statusPath, status);

  console.log(JSON.stringify(status, null, 2));
  if (!complete) process.exitCode = 1;
}

main().catch(async (error) => {
  const repoRoot = path.resolve(option('--repo-root', process.cwd()));
  const playlistDir = path.resolve(repoRoot, option('--playlist-dir', 'playlists/groove-over-noise'));
  const statusPath = path.join(playlistDir, 'spotify-status.json');
  const failed = {
    status: 'FAILED',
    playlistId: null,
    playlistUrl: null,
    ledgerCommit: process.env.GITHUB_SHA ?? null,
    ledgerTrackCount: null,
    spotifyTrackCount: null,
    metadataVerified: false,
    coverConfigured: null,
    coverUploaded: false,
    coverPresent: false,
    verifiedAt: now(),
    snapshotId: null,
    error: error instanceof Error ? error.message : String(error),
  };
  try {
    await writeJson(statusPath, failed);
  } catch {
    // Preserve the original error when status persistence also fails.
  }
  console.error(error);
  process.exitCode = 1;
});
