---
name: publisher
description: Report exact Spotify publication status and append the current compact journey map after audit, whether the Librarian persisted a durable change or correctly performed no write.
---

# Publisher

## Publication boundary

Spotify publication is performed by `.github/workflows/publish-spotify.yml` using only `apps/spotify-publisher/` and the Spotify Web API.

Journey-map generation is performed separately by `.github/workflows/build-journey-map.yml` using `apps/journey-map/`.

Neither workflow may run the Scout, rebuild candidate metadata, or modify `scout-request.json` or `scout-data.json`.

The Publisher may run after an audited no-write result. It must not require or manufacture a Librarian commit when durable editorial state is unchanged.

The ChatGPT workflow must not:
- search Spotify for the target playlist;
- call generative playlist creation;
- create, edit, or verify the canonical playlist through the ChatGPT Spotify connector;
- infer synchronization from a playlist name or link;
- rerun candidate discovery or resolution after the Librarian commits decisions;
- hand-edit generated journey-map files.

## Repository inputs

Read:
- `ledger.md` — exact desired URI order;
- `spotify.json` — persisted canonical playlist ID and ownership identity;
- `spotify-status.json` — latest API publication and read-back verification result;
- `journey-map.json` — latest generated Sites-ready map model;
- `journey-map.svg` — compact visualization;
- `journey-map-spec.md` — evidence and display boundaries.

`scout-data.json` is not a publication-status source and must not be reread or rebuilt during this phase.

## Spotify status rules

- **COMPLETE** — use only when `spotify-status.json.status` is `COMPLETE` and its ledger identity corresponds to the current canonical ledger.
- **PARTIAL** — use when exact verification mismatched or publication is still pending.
- **MANUAL REQUIRED** — credentials, authorization, workflow execution, or another user-controlled technical prerequisite is unavailable.

Never claim success from a successful ledger commit alone. Exact URI count and exact position-by-position read-back are required.

## Journey-map currency

Treat the compact map as current only when:

- `journey-map.json.tracks[].uri` exactly equals the ledger URI order; and
- the generated track count equals the ledger track count.

When current, append this image immediately after the one-sentence `EDITORIAL NOTE`, without adding a sixth numbered section:

```markdown
![GROOVE OVER NOISE journey map](https://raw.githubusercontent.com/broskmenmi/editorial-engine/main/playlists/groove-over-noise/journey-map.svg)
```

When stale or absent, write:

```text
Journey map updating
```

Do not embed a stale visualization and do not fail the editorial run because map generation is pending.

## Evidence boundary

The compact map contains:

- editorial story height;
- measured BPM;
- elapsed time from Spotify duration metadata when available;
- protected, provisional, accepted, and frozen states.

Never describe editorial story height as measured energy, loudness, mood, waveform analysis, or scientific intensity.

## Bounded finalization

The user-facing response is more important than prolonged status polling.

- Read `spotify-status.json` and `journey-map.json` once after a reasonable bounded wait.
- Do not continuously poll GitHub Actions or either file.
- If Spotify status is stale and no user action is required, report `PARTIAL — publication pending` and finish.
- If the map is stale, write `Journey map updating` and finish.
- Do not mark the scheduled task failed merely because either workflow has not finished.
- Do not suppress the final response because a non-authoritative cache, scout file, or map workflow failed.
- A later Action or the next editorial run may report the completed state.

## Manual output

Include `MANUAL ACTION` only when the user must perform an unavoidable technical step. For API setup failures, state the exact missing setup step.

Do not instruct the user to manually maintain track order or build the map when configured workflows are merely pending. Never put listening tasks in `MANUAL ACTION`.

## Links

Only link:
- the canonical playlist URL stored in `spotify-status.json`;
- candidate track links when scouting occurred; and
- the detailed journey-map URL declared by the target playlist when its generated status is published;
- the generated compact journey-map image.

Never surface broad Spotify search results or unrelated playlists.

## Detailed Site

When `journey-map.json` declares a published detailed-site status and URL, link that exact target-playlist URL. The Site visualizes generated GitHub data and is not authoritative. `sites-prompt.md` remains the maintenance/rebuild brief. Do not deploy a substitute that becomes a second source of truth, and never reuse one playlist's Site URL for another playlist or fork.

## Playback note

The canonical order is designed for ordered listening, not live beatmatching or harmonic mixing. Mention Spotify Mix only when directly relevant.
