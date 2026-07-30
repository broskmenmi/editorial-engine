import fs from 'node:fs/promises';

const API_BASE = 'https://api.spotify.com/v1';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const OUTPUT = 'playlists/groove-over-noise/scout-data.json';

const seeds = [
  'Setaoc Mass', 'Temudo', 'Norbak', 'Quelza', 'Ignez', 'Border One',
  'Pfirter', 'Decoder', 'TWR72', 'Kaiser', 'PWCCA', 'YANT', 'Cravo',
  'Chlar', 'Linear System', 'Translate', 'Augusto Taito', 'Yan Cook',
  'Jeroen Search', 'Developer', 'Oscar Mulero', 'Polygonia', 'Rrose',
  'Donato Dozzy', 'Svarog', 'Mike Parker', 'Dustin Zahn', 'Amotik',
  'Kashpitzky', 'Arthur Robert', 'Takaaki Itoh', 'Lewis Fautzi',
  'Kangding Ray', 'Adriana Lopez', 'Marron', 'The Lady Machine',
  'Dasha Rush', 'Rene Wise', 'Altinbas', 'Alarico', 'Marcal', 'Vil'
];

function idsFromText(text) {
  return new Set([...text.matchAll(/spotify:track:([A-Za-z0-9]{22})/g)].map((m) => m[1]));
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

async function getTempoFromSpotify(token, ids) {
  const tempos = new Map();
  const errors = [];
  for (let i = 0; i < ids.length; i += 100) {
    const batch = ids.slice(i, i + 100);
    try {
      const data = await spotifyGet(token, `/audio-features?ids=${batch.join(',')}`);
      for (const feature of data.audio_features ?? []) {
        if (feature?.id && Number.isFinite(feature.tempo)) tempos.set(feature.id, feature.tempo);
      }
    } catch (error) {
      errors.push(String(error));
      break;
    }
  }
  return { tempos, errors };
}

async function getTempoFromReccoBeats(id) {
  const urls = [
    `https://api.reccobeats.com/v1/track/${id}/audio-features`,
    `https://api.reccobeats.com/v1/audio-features/${id}`,
  ];
  for (const url of urls) {
    try {
      const response = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!response.ok) continue;
      const body = await response.json();
      const tempo = body?.tempo ?? body?.bpm ?? body?.audio_features?.tempo;
      if (Number.isFinite(Number(tempo))) return Number(tempo);
    } catch {
      // Try the next public endpoint shape.
    }
  }
  return null;
}

async function main() {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_REFRESH_TOKEN) {
    throw new Error('Missing Spotify credentials');
  }

  const sourcePaths = [
    'playlists/groove-over-noise/ledger.md',
    'playlists/groove-over-noise/rejected.md',
    'playlists/groove-over-noise/revisit.md',
    'playlists/groove-over-noise/discoveries.md',
  ];
  const sourceTexts = await Promise.all(sourcePaths.map((p) => fs.readFile(p, 'utf8')));
  const excluded = new Set();
  for (const text of sourceTexts) for (const id of idsFromText(text)) excluded.add(id);

  const token = await refreshToken();
  const tracks = new Map();

  for (const artist of seeds) {
    const query = new URLSearchParams({
      q: `artist:"${artist}" year:2024-2026`,
      type: 'track',
      market: 'SE',
      limit: '10',
    });
    try {
      const data = await spotifyGet(token, `/search?${query}`);
      for (const track of data?.tracks?.items ?? []) {
        if (!track?.id || excluded.has(track.id)) continue;
        const releaseDate = track.album?.release_date ?? '';
        if (releaseDate && releaseDate < '2024-01-01') continue;
        tracks.set(track.id, {
          id: track.id,
          uri: track.uri,
          name: track.name,
          artists: (track.artists ?? []).map((a) => a.name),
          album: track.album?.name ?? null,
          releaseDate,
          durationMs: track.duration_ms,
          popularity: track.popularity,
          explicit: track.explicit,
          spotifyUrl: track.external_urls?.spotify ?? `https://open.spotify.com/track/${track.id}`,
          seedArtist: artist,
        });
      }
    } catch (error) {
      console.error(`Search failed for ${artist}:`, error.message);
    }
  }

  const ids = [...tracks.keys()];
  const spotifyTempo = await getTempoFromSpotify(token, ids);

  const candidates = [];
  for (const track of tracks.values()) {
    let tempo = spotifyTempo.tempos.get(track.id) ?? null;
    let tempoSource = tempo ? 'Spotify audio-features' : null;
    if (!tempo) {
      tempo = await getTempoFromReccoBeats(track.id);
      if (tempo) tempoSource = 'ReccoBeats audio-features';
    }
    if (!tempo) continue;
    const roundedBpm = Math.round(tempo);
    if (roundedBpm < 134 || roundedBpm > 142) continue;
    if ((track.durationMs ?? 0) < 240000) continue;
    candidates.push({ ...track, tempo, bpm: roundedBpm, tempoSource });
  }

  candidates.sort((a, b) => {
    const targetA = Math.abs(a.bpm - 139);
    const targetB = Math.abs(b.bpm - 139);
    if (targetA !== targetB) return targetA - targetB;
    if (a.popularity !== b.popularity) return a.popularity - b.popularity;
    return (b.releaseDate ?? '').localeCompare(a.releaseDate ?? '');
  });

  const output = {
    generatedAt: new Date().toISOString(),
    target: {
      role: 'summit decompression hinge',
      neighbours: [
        { artist: 'Alarico', track: 'Iruka', bpm: 141 },
        { artist: 'Stef Mendesidis', track: 'Interlynx', bpm: 137 },
      ],
      preferredBpm: 139,
    },
    source: 'Spotify exact track identity and release metadata; tempo from Spotify audio-features when available, otherwise ReccoBeats.',
    spotifyAudioFeatureErrors: spotifyTempo.errors,
    searchedTrackCount: tracks.size,
    eligibleCount: candidates.length,
    candidates: candidates.slice(0, 40),
  };

  await fs.writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote ${output.candidates.length} candidates to ${OUTPUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
