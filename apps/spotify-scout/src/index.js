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

function chooseExactTrack(items, request, excluded) {
  const wantedTrack = normalized(request.track);
  const wantedArtist = normalized(request.artist);
  const wantedAlbum = request.album ? normalized(request.album) : null;

  const matches = items.filter((item) => {
    if (!item?.id || excluded.has(item.id)) return false;
    const title = normalized(item.name);
    const titleMatch = title === wantedTrack || title.startsWith(`${wantedTrack} -`);
    const artistMatch = (item.artists ?? []).some((artist) => normalized(artist.name) === wantedArtist);
    const albumMatch = !wantedAlbum || normalized(item.album?.name) === wantedAlbum;
    return titleMatch && artistMatch && albumMatch;
  });

  matches.sort((a, b) => {
    const exactA = normalized(a.name) === wantedTrack ? 1 : 0;
    const exactB = normalized(b.name) === wantedTrack ? 1 : 0;
    if (exactA !== exactB) return exactB - exactA;
    return String(b.album?.release_date ?? '').localeCompare(String(a.album?.release_date ?? ''));
  });
  return matches[0] ?? null;
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

  for (const requested of request.candidates) {
    const query = new URLSearchParams({
      q: `track:"${requested.track}" artist:"${requested.artist}"`,
      type: 'track',
      market: 'SE',
      limit: '20',
    });
    const data = await spotifyGet(token, `/search?${query}`);
    const track = chooseExactTrack(data?.tracks?.items ?? [], requested, excluded);
    if (!track) {
      unresolved.push({ artist: requested.artist, track: requested.track, album: requested.album ?? null });
      continue;
    }

    candidates.push({
      id: track.id,
      uri: track.uri,
      name: track.name,
      artists: (track.artists ?? []).map((artist) => artist.name),
      album: track.album?.name ?? null,
      releaseDate: track.album?.release_date ?? null,
      durationMs: track.duration_ms ?? null,
      spotifyUrl: track.external_urls?.spotify ?? `https://open.spotify.com/track/${track.id}`,
      bpm: requested.bpm,
      tempoSource: requested.bpmSource,
      discoverySource: requested.discoverySource,
      requestedIdentity: requested,
    });
  }

  const output = {
    generatedAt: new Date().toISOString(),
    target: request.target,
    source: 'Exact Spotify track identity from Spotify Web API; BPM from the external source declared per request.',
    requestedCount: request.candidates.length,
    resolvedCount: candidates.length,
    unresolved,
    candidates,
  };

  await fs.writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Resolved ${candidates.length}/${request.candidates.length} exact candidates`);
  if (unresolved.length) process.exitCode = 2;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
