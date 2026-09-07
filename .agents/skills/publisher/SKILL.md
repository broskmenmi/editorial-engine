---
name: publisher
description: Report exact Spotify publication status and append the current compact journey map for the target playlist after audit, whether or not durable editorial state changed.
---

# Publisher

## Publication policy

Read repository-root `publication.json`. `automaticPublishingEnabled: true` automatically publishes approved ledger additions, removals and reorders (and configured metadata/cover changes) through GitHub Actions, targeting only playlists whose publication inputs changed. No extra publication approval is needed for an already approved editorial change. `false` retains manual-only publishing; a separate explicit publication request may use a manual dispatch selecting one playlist. Never change the flag without user instruction. Flag-only or runtime-only commits do not republish unchanged playlists; use a targeted manual dispatch for catch-up when explicitly requested.

After a change, report COMPLETE only from `spotify-status.json` exact read-back matching the current canonical ledger, with its verification timestamp. If verification is pending or failed, report that accurately. On no-change runs, distinguish last verified status from a new live check. When the flag is false, report automatic publication disabled; intentional pending publication is not a musical REPAIR trigger.

## Publication boundary

Spotify publication is performed by `.github/workflows/publish-spotify.yml` using `apps/spotify-publisher/` and the Spotify Web API. Journey-map generation is separate and uses `.github/workflows/build-journey-map.yml` plus `apps/journey-map/`.

The target playlist directory is supplied by the orchestrator. Never silently substitute `playlists/groove-over-noise/` or another playlist.

The Publisher may run after an audited no-write result. It must not manufacture a Librarian commit when durable editorial state is unchanged.

The ChatGPT workflow must not search Spotify for the canonical playlist, create/edit/verify it through the ChatGPT Spotify connector, rebuild Scout output after audit, or hand-edit generated map files.

## Repository inputs

Read from the target playlist directory:
- `ledger.md`
- `spotify.json`
- `spotify-status.json`
- `journey-map.json` when present
- `journey-map.svg` when present
- `journey-map-spec.md`

`scout-data.json` is not a publication-status source.

## Spotify status rules

- **COMPLETE** — only when `spotify-status.json.status` is `COMPLETE` and its ledger identity corresponds to the current canonical ledger.
- **PARTIAL** — exact verification mismatched or publication is pending.
- **MANUAL REQUIRED** — a user-controlled technical prerequisite is missing.

Never infer success from a ledger commit alone. Exact URI count and position-by-position read-back are required.

## Journey-map currency

Treat a generated map as current only when its ordered `tracks[].uri` list exactly equals the target ledger URI order and its track count matches. If the ledger is empty or the map has not yet been generated, say so plainly; do not borrow another playlist's map.

When current, append the target automation contract's compact-map Markdown immediately after `EDITORIAL NOTE`. When stale or absent, use the target automation contract's updating/not-yet-generated line.

## Detailed Site

Use only the target playlist's `journey-map.json.playlist.detailedSiteStatus` and `detailedSiteUrl`. If no detailed site is published, report that state rather than inventing a URL. A Site visualizes GitHub data and is never authoritative.

## Evidence boundary

Story height is editorial interpretation. BPM and duration are measured metadata. Never describe story height as measured energy, loudness, mood or waveform analysis.

## Bounded finalization

Read `spotify-status.json` and `journey-map.json` once after a reasonable bounded wait. Do not continuously poll. Pending publication or map generation must not suppress the final editorial response.

`MANUAL ACTION` is technical only and never contains listening homework.
