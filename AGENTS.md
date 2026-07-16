# Editorial Engine — Codex Instructions

This repository is a playlist-agnostic editorial system.

## Skill discovery

Reusable Codex/ChatGPT Agent Skills live under:

`.agents/skills/<skill-name>/SKILL.md`

Available skills:
- scout
- evaluator
- sequencer
- auditor
- librarian
- publisher
- scheduler

The `scheduler` skill creates or updates the single recurring ChatGPT task that invokes the editorial workflow. The task itself is account-specific and is not automatically installed when this repository is cloned or forked. See `SETUP.md`.

## Playlist state

Each playlist has its own directory under `playlists/<playlist-slug>/` containing:
- `constitution.md`
- `ledger.md`
- `discoveries.md`
- `rejected.md`
- `revisit.md`
- `notes.md`
- `automation.md`
- `spotify.json`
- `spotify-status.json`

These Markdown paths are the canonical ChatGPT instruction and editorial-state paths. Do not relocate them when adding runtime applications or automation.

The playlist directory is persistent editorial state. The skill packages are generic and must operate on the target playlist directory supplied by the orchestrator.

## Required order

For curation workflows run:

Scout → Evaluator → Sequencer → Auditor → Librarian → Publisher

Do not write persistent state before audit approval. GitHub is the source of truth. Spotify is a publication target.

## Spotify publication

- Every canonical ledger row must include one exact Spotify track URI.
- Exact publication is performed by `.github/workflows/publish-spotify.yml` through `apps/spotify-publisher/`.
- The canonical playlist ID is persisted in `spotify.json`.
- Publication is COMPLETE only when `spotify-status.json` records exact URI-order verification.
- Do not use the ChatGPT Spotify connector for canonical playlist search, creation, editing, or publication.
- Do not surface unrelated Spotify playlists or broad search fallback results.

## Installation behavior

For a new user or fork:
1. Follow `SETUP.md`.
2. Connect GitHub to ChatGPT.
3. Configure Spotify Web API credentials as GitHub Actions secrets if automatic publication is desired.
4. Invoke the scheduler skill once to create the recurring task.
5. Use one orchestrator task per playlist workflow; never create competing per-skill recurring tasks.
