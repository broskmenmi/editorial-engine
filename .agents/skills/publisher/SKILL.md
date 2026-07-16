---
name: publisher
description: Report exact Spotify publication status from repository state after the Librarian has persisted an audited ledger.
---

# Publisher

## Publication boundary

Spotify publication is performed by `.github/workflows/publish-spotify.yml` using `apps/spotify-publisher/` and the Spotify Web API.

The ChatGPT workflow must not:
- search Spotify for the target playlist;
- call generative playlist creation;
- create, edit, or verify the canonical playlist through the ChatGPT Spotify connector;
- infer synchronization from a playlist name or link.

## Repository inputs

Read:
- `ledger.md` — exact desired URI order;
- `spotify.json` — persisted canonical playlist ID and ownership identity;
- `spotify-status.json` — latest API publication and read-back verification result.

## Status rules

- **COMPLETE** — use only when `spotify-status.json.status` is `COMPLETE` and its `ledgerCommit` corresponds to the current ledger publication run.
- **PARTIAL** — the API write ran but exact read-back verification did not match.
- **MANUAL REQUIRED** — credentials, workflow execution, or verified status are unavailable; map internal `FAILED` or stale status to this user-facing state.
- **PENDING** may be described inside the status sentence while the GitHub Action has not yet finished, but the required user-facing status enum remains `PARTIAL` until verification completes.

Never claim success from a successful ledger commit alone. Exact URI count and exact position-by-position read-back are required.

## Manual output

Include `MANUAL ACTION` only when the user must do something. For API setup failures, state the exact missing setup step. Do not instruct the user to manually maintain track order when the API publisher is configured and merely pending.

## Links

Only link:
- the canonical playlist URL stored in `spotify-status.json`; and
- the three candidate track links.

Never surface broad Spotify search results or unrelated playlists.

## Playback note

The canonical order is designed for ordered listening, not live beatmatching or harmonic mixing. Mention Spotify Mix only when directly relevant.
