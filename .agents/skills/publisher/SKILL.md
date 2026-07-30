---
name: publisher
description: Report exact Spotify publication status from repository state after the Librarian has persisted an audited ledger.
---

# Publisher

## Publication boundary

Spotify publication is performed by `.github/workflows/publish-spotify.yml` using only `apps/spotify-publisher/` and the Spotify Web API.

The publication workflow must not run the Scout, rebuild candidate metadata, or modify `scout-request.json` or `scout-data.json`.

The ChatGPT workflow must not:
- search Spotify for the target playlist;
- call generative playlist creation;
- create, edit, or verify the canonical playlist through the ChatGPT Spotify connector;
- infer synchronization from a playlist name or link;
- rerun candidate discovery or resolution after the Librarian commits decisions.

## Repository inputs

Read:
- `ledger.md` — exact desired URI order;
- `spotify.json` — persisted canonical playlist ID and ownership identity;
- `spotify-status.json` — latest API publication and read-back verification result.

`scout-data.json` is not a publication-status source and must not be reread or rebuilt during this phase.

## Status rules

- **COMPLETE** — use only when `spotify-status.json.status` is `COMPLETE` and its `ledgerCommit` corresponds to the current ledger publication run.
- **PARTIAL** — use when exact verification mismatched or when publication is still pending for the current ledger.
- **MANUAL REQUIRED** — credentials, authorization, workflow execution, or another user-controlled technical prerequisite is unavailable; map internal `FAILED` requiring user intervention to this state.

Never claim success from a successful ledger commit alone. Exact URI count and exact position-by-position read-back are required.

## Bounded finalization

The user-facing response is more important than prolonged status polling.

- Read `spotify-status.json` once after a reasonable bounded wait when available.
- Do not continuously poll GitHub Actions or the status file.
- If status is stale but no user action is required, report `PARTIAL — publication pending` and finish the response.
- Do not mark the scheduled task failed merely because the publisher has not finished.
- Do not suppress the final response because a non-authoritative cache, scout file, or secondary workflow failed.
- A later Action or the next editorial run may report COMPLETE.

## Manual output

Include `MANUAL ACTION` only when the user must perform an unavoidable technical step. For API setup failures, state the exact missing setup step.

Do not instruct the user to manually maintain track order when the API publisher is configured and merely pending. Never put listening tasks in `MANUAL ACTION`.

## Links

Only link:
- the canonical playlist URL stored in `spotify-status.json`; and
- the three candidate track links.

Never surface broad Spotify search results or unrelated playlists.

## Playback note

The canonical order is designed for ordered listening, not live beatmatching or harmonic mixing. Mention Spotify Mix only when directly relevant.
