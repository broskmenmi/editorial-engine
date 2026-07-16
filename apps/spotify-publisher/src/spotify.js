const API_BASE = 'https://api.spotify.com/v1';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const RETRYABLE = new Set([429, 502, 503, 504]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function parseBody(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function refreshAccessToken({ clientId, clientSecret, refreshToken }) {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const body = await parseBody(response);
  if (!response.ok || !body?.access_token) {
    throw new Error(`Spotify token refresh failed (${response.status}): ${JSON.stringify(body)}`);
  }
  return body.access_token;
}

export class SpotifyClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  async request(path, { method = 'GET', body, attempt = 1 } = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });

    const parsed = await parseBody(response);
    if (response.ok) return { body: parsed, headers: response.headers, status: response.status };

    if (RETRYABLE.has(response.status) && attempt < 5) {
      const retryAfter = Number.parseInt(response.headers.get('retry-after') ?? '', 10);
      const baseDelay = Number.isFinite(retryAfter)
        ? retryAfter * 1000
        : Math.min(8000, 500 * 2 ** (attempt - 1));
      await sleep(baseDelay + Math.floor(Math.random() * 250));
      return this.request(path, { method, body, attempt: attempt + 1 });
    }

    const error = new Error(`Spotify API ${method} ${path} failed (${response.status}): ${JSON.stringify(parsed)}`);
    error.status = response.status;
    error.responseBody = parsed;
    throw error;
  }

  async getCurrentUser() {
    return (await this.request('/me')).body;
  }

  async createPlaylist({ name, description, isPublic }) {
    return (await this.request('/me/playlists', {
      method: 'POST',
      body: { name, description, public: isPublic, collaborative: false },
    })).body;
  }

  async getPlaylist(playlistId) {
    return (await this.request(`/playlists/${encodeURIComponent(playlistId)}`)).body;
  }

  async updatePlaylistDetails(playlistId, { name, description, isPublic }) {
    await this.request(`/playlists/${encodeURIComponent(playlistId)}`, {
      method: 'PUT',
      body: { name, description, public: isPublic },
    });
  }

  async replacePlaylistItems(playlistId, uris) {
    const firstBatch = uris.slice(0, 100);
    const response = await this.request(`/playlists/${encodeURIComponent(playlistId)}/items`, {
      method: 'PUT',
      body: { uris: firstBatch },
    });

    for (let index = 100; index < uris.length; index += 100) {
      await this.request(`/playlists/${encodeURIComponent(playlistId)}/items`, {
        method: 'POST',
        body: { uris: uris.slice(index, index + 100) },
      });
    }

    return response.body?.snapshot_id ?? null;
  }

  async getAllPlaylistUris(playlistId) {
    const uris = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const query = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      const page = (await this.request(`/playlists/${encodeURIComponent(playlistId)}/items?${query}`)).body;
      const items = page?.items ?? [];
      for (const entry of items) {
        const uri = entry?.item?.uri;
        if (uri) uris.push(uri);
      }
      if (!page?.next || items.length === 0) break;
      offset += items.length;
    }

    return uris;
  }
}

export function arraysEqual(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}
