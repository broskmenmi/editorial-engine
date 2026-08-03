import fs from 'node:fs/promises';

const originalFetch = globalThis.fetch.bind(globalThis);
let playlistItemsPromise = null;

async function loadPlaylistItems(headers) {
  if (playlistItemsPromise) return playlistItemsPromise;

  playlistItemsPromise = (async () => {
    const config = JSON.parse(await fs.readFile('playlists/groove-over-noise/spotify.json', 'utf8'));
    if (!config.playlistId) throw new Error('spotify.json has no playlistId for duration enrichment.');

    const tracks = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const url = `https://api.spotify.com/v1/playlists/${encodeURIComponent(config.playlistId)}/items?limit=${limit}&offset=${offset}`;
      const response = await originalFetch(url, { headers });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(`Spotify playlist metadata failed (${response.status}): ${JSON.stringify(body)}`);
      }

      const items = body?.items ?? [];
      for (const entry of items) {
        const track = entry?.item;
        if (track?.uri && Number.isFinite(track.duration_ms)) tracks.push(track);
      }

      if (!body?.next || items.length === 0) break;
      offset += items.length;
    }

    return tracks;
  })();

  return playlistItemsPromise;
}

globalThis.fetch = async (input, init = {}) => {
  const url = typeof input === 'string' ? input : input?.url;
  if (!url?.startsWith('https://api.spotify.com/v1/tracks?ids=')) {
    return originalFetch(input, init);
  }

  const parsed = new URL(url);
  const ids = new Set((parsed.searchParams.get('ids') ?? '').split(',').filter(Boolean));
  const playlistTracks = await loadPlaylistItems(init.headers ?? {});
  const tracksById = new Map(playlistTracks.map((track) => [track.id, track]));
  const tracks = [...ids].map((id) => tracksById.get(id) ?? null);

  return new Response(JSON.stringify({ tracks }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
