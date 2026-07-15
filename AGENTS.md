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

## Playlist state
Each playlist has its own directory under `playlists/<playlist-slug>/` containing:
- `constitution.md`
- `ledger.md`
- `discoveries.md`
- `rejected.md`
- `revisit.md`
- `notes.md`
- `automation.md`

The playlist directory is persistent editorial state. The skill packages are generic and must operate on the target playlist directory supplied by the orchestrator.

## Required order
For curation workflows run:

Scout → Evaluator → Sequencer → Auditor → Librarian → Publisher

Do not write persistent state before audit approval. GitHub is the source of truth. Spotify is a publication target.