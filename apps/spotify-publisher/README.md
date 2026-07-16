# Spotify Publisher

Publishes a canonical editorial ledger to exactly one owned Spotify playlist using the Spotify Web API.

The publisher does not search for playlists by name and never uses generative playlist creation. It uses the persisted `playlistId` in `playlists/<slug>/spotify.json`, replaces the complete item list from ledger Spotify URIs, then reads the playlist back and verifies exact URI order.

## Requirements

- Node.js 20 or newer
- A Spotify Developer application
- Spotify Premium for Development Mode apps
- OAuth scopes:
  - `playlist-read-private`
  - `playlist-modify-private`
  - `playlist-modify-public`

## One-time authorization

Set the client ID, then print an authorization URL:

```bash
cd apps/spotify-publisher
SPOTIFY_CLIENT_ID=... npm run authorize
```

After approval, copy the `code` query parameter from the redirect URL and exchange it:

```bash
SPOTIFY_CLIENT_ID=... \
SPOTIFY_CLIENT_SECRET=... \
npm run authorize -- --code "COPIED_CODE"
```

Store the resulting refresh token in GitHub Actions secrets as `SPOTIFY_REFRESH_TOKEN`. Also create secrets named `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`.

## Publish locally

Run from the repository root:

```bash
SPOTIFY_CLIENT_ID=... \
SPOTIFY_CLIENT_SECRET=... \
SPOTIFY_REFRESH_TOKEN=... \
node apps/spotify-publisher/src/index.js
```

Preview without modifying Spotify:

```bash
node apps/spotify-publisher/src/index.js --dry-run
```

An empty ledger is rejected by default. Clearing a playlist requires the explicit `--allow-empty` flag.

## Canonical identity

Each accepted ledger row must contain a stable URI in this form:

```text
spotify:track:1234567890123456789012
```

The publisher never resolves tracks from artist/title text during synchronization.
