# Editorial Engine

A persistent, versioned editorial system for curated playlists.

The repository is the source of truth. Spotify is the publication target.

## Included reference playlist

- [`GROOVE OVER NOISE`](playlists/groove-over-noise/)

## How it works

One recurring ChatGPT task orchestrates reusable Agent Skills through a repair-first lane or, when no repair is actionable, a fresh outward exploration lane:

```text
Pre-audit → Scout → Evaluator → Sequencer → Auditor → Librarian → Publisher
```

The skills remain under `.agents/skills/<skill-name>/SKILL.md`. Playlist-specific identity and state remain under `playlists/<playlist-slug>/`, so ChatGPT can discover the same Markdown instruction paths on every run.

## Exact Spotify publication

The ChatGPT task curates and commits the canonical ledger. A GitHub Action then publishes it through the Spotify Web API:

```text
ledger.md with exact Spotify URIs
→ publish-spotify.yml
→ one persisted playlist ID
→ complete playlist replacement
→ position-by-position read-back verification
→ spotify-status.json
```

The publisher lives in `apps/spotify-publisher/`. It never searches Spotify by playlist name and never uses generative playlist creation.

## Installation

Downloading or forking the repository does **not** automatically create a recurring task or configure Spotify OAuth. Each user must connect GitHub, create one account-specific ChatGPT task, and configure Spotify API credentials as GitHub Actions secrets.

See [`SETUP.md`](SETUP.md) for the complete setup procedure.

The recurring task is created using the [`scheduler` skill](.agents/skills/scheduler/SKILL.md), which contains the canonical task prompt and verification checklist.

## Workflow

1. Read the playlist constitution, canonical ledger, feedback state, and prior decisions.
2. Pre-audit for an actionable repair, triggered revisit, or materially new evidence.
3. If no repair is actionable, perform a fresh outward scan of current releases, adjacent or emerging artists and labels, and overlooked catalogue material.
4. Rank one to nine honest resolution leads, then freeze at most three exact Spotify identities as candidates; never pad either set.
5. Evaluate playlist belonging separately from compatibility with exact neighbours, then sequence only justified additions or repairs.
6. Audit the proposed changes.
7. Update durable editorial state only after audit approval; diagnostic lead-request/candidate-snapshot commits may occur earlier solely to resolve exact identities.
8. Let the GitHub Action replace Spotify from ledger URI order.
9. Report publication status only from `spotify-status.json`.

## Decision vocabulary

- **ADD** — belongs in the canonical playlist now.
- **REVISIT** — promising, but a specific uncertainty remains.
- **REJECT** — does not strengthen the playlist identity.

## Playback model

The ledger is sequenced as a long-form listening journey, not as a live DJ set. Beatmatching and harmonic mixing are not assumed.
