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

const repoRoot = path.resolve(option('--repo-root', process.cwd()));
const playlistDir = path.resolve(repoRoot, option('--playlist-dir', 'playlists/groove-over-noise'));
const ledgerPath = path.join(playlistDir, 'ledger.md');
const configPath = path.join(playlistDir, 'spotify.json');
const statusPath = path.join(playlistDir, 'spotify-status.json');
const dryRun = hasFlag('--dry-run');
const allowEmpty = hasFlag('--allow-empty');

async function main() {
  const rows = await readLedger(ledgerPath, { allowEmpty });
  const desiredUris = rows.map((row) => row.uri);
  const config = await readJson(configPath);

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
    const readBack = playlist
      ? await spotify.getAllPlaylistUris(playlist.id)
      : { uris: [], skippedCount: 0 };
    console.log(JSON.stringify({
      dryRun: true,
      playlistId: playlist?.id ?? null,
      creationRequired,
      currentTrackCount: readBack.uris.length,
      desiredTrackCount: desiredUris.length,
      exactMatch: arraysEqual(readBack.uris, desiredUris),
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
    if (config.ownerUserId !== me.id) {
      config.ownerUserId = me.id;
      await writeJson(configPath, config);
    }
  }

  await spotify.updatePlaylistDetails(playlist.id, {
    name: config.playlistName,
    description: config.description,
    isPublic: Boolean(config.public),
  });

  const snapshotId = await spotify.replacePlaylistItems(playlist.id, desiredUris);
  const { uris: actualUris, skippedCount } = await spotify.getAllPlaylistUris(playlist.id);
  const exactMatch = arraysEqual(actualUris, desiredUris);

  const mismatchError = skippedCount > 0
    ? `Spotify read-back did not exactly match ledger URI order (${skippedCount} read-back entries had no URI).`
    : 'Spotify read-back did not exactly match ledger URI order.';

  const status = {
    status: exactMatch ? 'COMPLETE' : 'PARTIAL',
    playlistId: playlist.id,
    playlistUrl: `https://open.spotify.com/playlist/${playlist.id}`,
    ledgerCommit: process.env.GITHUB_SHA ?? null,
    ledgerTrackCount: desiredUris.length,
    spotifyTrackCount: actualUris.length,
    verifiedAt: now(),
    snapshotId,
    error: exactMatch ? null : mismatchError,
  };
  await writeJson(statusPath, status);

  console.log(JSON.stringify(status, null, 2));
  if (!exactMatch) process.exitCode = 1;
}

main().catch(async (error) => {
  if (!dryRun) {
    const failed = {
      status: 'FAILED',
      playlistId: null,
      playlistUrl: null,
      ledgerCommit: process.env.GITHUB_SHA ?? null,
      ledgerTrackCount: null,
      spotifyTrackCount: null,
      verifiedAt: now(),
      snapshotId: null,
      error: error instanceof Error ? error.message : String(error),
    };
    try {
      await writeJson(statusPath, failed);
    } catch {
      // Preserve the original error when status persistence also fails.
    }
  }
  console.error(error);
  process.exitCode = 1;
});
