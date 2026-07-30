import fs from 'node:fs/promises';

const API_BASE = 'https://api.spotify.com/v1';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const REQUEST = 'playlists/groove-over-noise/scout-request.json';
const OUTPUT = 'playlists/groove-over-noise/scout-data.json';

function idsFromText(text) {
  return new Set([...text.matchAll(/spotify:track:([A-Za-z0-9]{22})/g)].map((m) => m[1]));
}

function normalized(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

async function refreshToken() {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
      client_id: process.env.SPOTIFY_CLIENT_ID,
    }),
  });
  const body = await response.json();
  if (!response.ok || !body.access_token) {
    throw new Error(`Spotify token refresh failed: ${response.status} ${JSON.stringify(body)}`);
  }
  return body.access_token;
}

async function spotifyGet(token, path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await response.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  if (!response.ok) throw new Error(`Spotify ${path} failed: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

function identityMatches(item, request) {
  const wantedTrack = normalized(request.track);
  const wantedArtist = normalized(request.artist);
  const title = normalized(item?.name);
  const titleMatch = title === wantedTrack || title.startsWith(`${wantedTrack} -`);
  const artistMatch = (item?.artists ?? []).some((artist) => normalized(artist.name) === wantedArtist);
  return Boolean(item?.id && titleMatch && artistMatch);
}

function candidateRecord(track, requested, album = null) {
  return {
    id: track.id,
    uri: track.uri ?? `spotify:track:${track.id}`,
    name: track.name,
    artists: (track.artists ?? []).map((artist) => artist.name),
    album: track.album?.name ?? album?.name ?? requested.album ?? null,
    releaseDate: track.album?.release_date ?? album?.release_date ?? null,
    durationMs: track.duration_ms ?? null,
    spotifyUrl: track.external_urls?.spotify ?? `https://open.spotify.com/track/${track.id}`,
    bpm: requested.bpm,
    tempoSource: requested.bpmSource,
    discoverySource: requested.discoverySource,
    requestedIdentity: requested,
  };
}

async function resolveRequestedTrack(token, requested, excluded) {
  if (requested.spotifyTrackId) {
    const id = requested.spotifyTrackId;
    if (excluded.has(id)) return { error: 'already present in persistent state' };
    try {
      const track = await spotifyGet(token, `/tracks/${id}?market=SE`);
      if (!identityMatches(track, requested)) return { error: 'direct Spotify track identity mismatch' };
      return { track: candidateRecord(track, requested) };
    } catch (error) {
      // The exact public Spotify ID remains authoritative even if metadata lookup is unavailable.
      return {
        track: candidateRecord({
          id,
          uri: `spotify:track:${id}`,
          name: requested.track,
          artists: [{ name: requested.artist }],
          external_urls: { spotify: `https://open.spotify.com/track/${id}` },
        }, requested),
        warning: String(error),
      };
    }
  }

  if (requested.spotifyAlbumId) {
    try {
      const album = await spotifyGet(token, `/albums/${requested.spotifyAlbumId}?market=SE`);
      const track = (album?.tracks?.items ?? []).find((item) => identityMatches(item, requested) && !excluded.has(item.id));
      if (!track) return { error: 'exact track not found on supplied Spotify album' };
      return { track: candidateRecord(track, requested, album) };
    } catch (error) {
      return { error: String(error) };
    }
  }

  return { error: 'no exact Spotify track or album identifier supplied' };
}

async function main() {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_REFRESH_TOKEN) {
    throw new Error('Missing Spotify credentials');
  }

  const request = JSON.parse(await fs.readFile(REQUEST, 'utf8'));
  if (!Array.isArray(request.candidates) || request.candidates.length !== 3) {
    throw new Error('scout-request.json must contain exactly three candidates');
  }

  const sourcePaths = [
    'playlists/groove-over-noise/ledger.md',
    'playlists/groove-over-noise/rejected.md',
    'playlists/groove-over-noise/revisit.md',
    'playlists/groove-over-noise/discoveries.md',
  ];
  const sourceTexts = await Promise.all(sourcePaths.map((path) => fs.readFile(path, 'utf8')));
  const excluded = new Set();
  for (const text of sourceTexts) for (const id of idsFromText(text)) excluded.add(id);

  const token = await refreshToken();
  const candidates = [];
  const unresolved = [];
  const warnings = [];

  for (const requested of request.candidates) {
    const result = await resolveRequestedTrack(token, requested, excluded);
    if (result.track) candidates.push(result.track);
    else unresolved.push({ artist: requested.artist, track: requested.track, error: result.error });
    if (result.warning) warnings.push({ artist: requested.artist, track: requested.track, warning: result.warning });
  }

  const output = {
    generatedAt: new Date().toISOString(),
    runId: request.runId ?? null,
    target: request.target,
    source: 'Exact Spotify identity from supplied public track IDs or Spotify album metadata; BPM from the declared external source.',
    requestedCount: request.candidates.length,
    resolvedCount: candidates.length,
    unresolved,
    warnings,
    candidates,
  };

  await fs.writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Resolved ${candidates.length}/${request.candidates.length} exact candidates`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
