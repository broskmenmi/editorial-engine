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

The skills live under `.agents/skills/<skill-name>/SKILL.md`. Playlist-specific identity and state live under `playlists/<playlist-slug>/`.

## Installation

Downloading or forking the repository does **not** automatically create a recurring task or connect GitHub/Spotify. Each user must connect their own apps and create one account-specific ChatGPT task.

See [`SETUP.md`](SETUP.md) for the complete setup procedure.

The recurring task is created using the [`scheduler` skill](.agents/skills/scheduler/SKILL.md), which contains the canonical task prompt and verification checklist.

## Workflow

1. Read the playlist constitution and canonical ledger.
2. Review prior discoveries, rejections, revisit candidates, and editorial notes.
3. Scout exactly three candidates.
4. Evaluate and sequence them.
5. Audit the proposed changes.
6. Update GitHub only after audit approval.
7. Find or create the Spotify playlist and update it when supported.
8. Always return exact manual add/remove/reorder instructions.

## Decision vocabulary

- **ADD** — belongs in the canonical playlist now.
- **REVISIT** — promising, but a specific uncertainty remains.
- **REJECT** — does not strengthen the playlist identity.

## Playback model

The ledger is sequenced as a long-form listening journey, not as a live DJ set. Beatmatching and harmonic mixing are not assumed. Spotify Mix may alter the intended sequence and should be used only when discovery is preferred over the curated journey.