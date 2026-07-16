# Editorial Engine

A persistent, versioned editorial system for curated playlists.

The repository is the source of truth. Spotify is the publication target.

## Included reference playlist

- [`GROOVE OVER NOISE`](playlists/groove-over-noise/)

## How it works

One recurring ChatGPT task orchestrates reusable Agent Skills in this order:

```text
Scout → Evaluator → Sequencer → Auditor → Librarian → Publisher
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

1. Read the playlist constitution and canonical ledger.
2. Review prior discoveries, rejections, revisit candidates, and editorial notes.
3. Scout exactly three candidate tracks with exact Spotify URIs.
4. Evaluate and sequence them.
5. Audit the proposed changes.
6. Update GitHub only after audit approval.
7. Let the GitHub Action replace Spotify from ledger URI order.
8. Report publication status only from `spotify-status.json`.

## Decision vocabulary

- **ADD** — belongs in the canonical playlist now.
- **REVISIT** — promising, but a specific uncertainty remains.
- **REJECT** — does not strengthen the playlist identity.

## Playback model

The ledger is sequenced as a long-form listening journey, not as a live DJ set. Beatmatching and harmonic mixing are not assumed.
