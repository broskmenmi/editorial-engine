# Editorial Engine

A persistent, versioned editorial system for curated playlists.

The repository is the source of truth. Spotify is the publication target.

## Playlists

- [`GROOVE OVER NOISE`](playlists/groove-over-noise/) — Volume I; stable long-form continuity journey.
- [`STRANGE GAIT`](playlists/strange-gait/) — Volume II; active bootstrap around rhythmic displacement and bodily continuity.

Each playlist owns its constitution, ledger, history, Spotify identity, feedback state, automation contract, and journey-map state. Shared Agent Skills and GitHub Actions operate on the selected `playlists/<playlist-slug>/` directory.

## How it works

A recurring ChatGPT task orchestrates reusable Agent Skills through a repair-first lane or, when no repair is actionable, a fresh outward exploration lane:

```text
Pre-audit → Scout → Evaluator → Sequencer → Auditor → Librarian → Publisher
```

The skills remain under `.agents/skills/<skill-name>/SKILL.md`. Playlist-specific identity and state remain under `playlists/<playlist-slug>/`.

## Exact Spotify publication

The ChatGPT task curates and commits the canonical ledger. GitHub Actions then publish each configured playlist through the Spotify Web API using exact URI order and read-back verification.

```text
ledger.md with exact Spotify URIs
→ publish-spotify.yml
→ persisted playlist ID per playlist
→ complete playlist replacement
→ position-by-position read-back verification
→ spotify-status.json
```

The publisher never searches Spotify by playlist name and never uses generative playlist creation.

## Installation

Downloading or forking the repository does **not** automatically create recurring ChatGPT tasks or configure Spotify OAuth. Each user must connect GitHub, configure Spotify API credentials as GitHub Actions secrets, and create one orchestrator task for each active playlist workflow. Do not create separate tasks for individual skills.

See [`SETUP.md`](SETUP.md) for the complete setup procedure.

## Workflow

1. Read the target playlist constitution, canonical ledger, feedback state, and prior decisions.
2. Pre-audit for an actionable repair, triggered revisit, or materially new evidence.
3. If no repair is actionable, perform a fresh outward scan of current releases, adjacent or emerging artists and labels, and overlooked catalogue material.
4. Rank one to nine honest resolution leads, then freeze at most three exact Spotify identities as candidates; never pad either set.
5. Evaluate playlist belonging separately from compatibility with exact neighbours, then sequence only justified additions or repairs.
6. Audit the proposed changes.
7. Update durable editorial state only after audit approval; diagnostic lead-request/candidate-snapshot commits may occur earlier solely to resolve exact identities.
8. Let GitHub Actions replace Spotify from ledger URI order.
9. Report publication status only from the target playlist's `spotify-status.json`.

## Decision vocabulary

- **ADD** — belongs in the canonical playlist now.
- **REVISIT** — promising, but a specific uncertainty remains.
- **REJECT** — does not strengthen the target playlist identity or current journey.

## Playback model

Canonical ledgers optimize for ordered listening journeys. Live DJ routing remains a separate directed graph under each playlist's `live-mixing.md`.
