# Spotify Publisher

Publishes a canonical editorial ledger to exactly one owned Spotify playlist using the Spotify Web API.

The publisher does not search for playlists by name and never uses generative playlist creation. It uses the persisted `playlistId` in `playlists/<slug>/spotify.json`, replaces the complete item list from ledger Spotify URIs, then reads the playlist back and verifies exact URI order.

## Phone-only authorization

The authorization page is hosted through GitHub Pages at:

```text
https://broskmenmi.github.io/editorial-engine/spotify-auth/
```

It uses Spotify Authorization Code with PKCE. No computer, terminal, npm command, localhost callback, or Spotify Client Secret is required.

Register the exact page URL as a redirect URI in the Spotify Developer Dashboard. Open the page on the phone, paste the Spotify Client ID, approve access, then copy the displayed refresh token.

Create only these GitHub Actions repository secrets:

```text
SPOTIFY_CLIENT_ID
SPOTIFY_REFRESH_TOKEN
```

The page does not submit credentials to GitHub. The user manually copies them into repository secrets.

## GitHub Pages

The workflow `.github/workflows/deploy-pages.yml` deploys the `docs/` directory. In repository settings, configure Pages to use **GitHub Actions** if it is not already enabled.

## GitHub Action publisher

The workflow `.github/workflows/publish-spotify.yml` runs the publisher whenever an ordered ledger changes. It:

1. reads exact Spotify track URIs from the ledger;
2. loads the one persisted playlist ID;
3. creates one empty playlist only when that ID is absent or deleted;
4. replaces the complete playlist contents;
5. reads all items back;
6. marks publication COMPLETE only on an exact positional URI match.

## Optional local execution

Node.js 20 or newer can be used for development, but it is not required by the playlist owner. GitHub Actions runs the publisher.

```bash
SPOTIFY_CLIENT_ID=... \
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
