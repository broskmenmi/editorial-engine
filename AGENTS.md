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
- `under-review.md`
- `feedback-protocol.md`
- `notes.md`
- `automation.md`
- `spotify.json`
- `spotify-status.json`

These Markdown paths are the canonical ChatGPT instruction and editorial-state paths. Do not relocate them when adding runtime applications or automation.

The playlist directory is persistent editorial state. The skill packages are generic and must operate on the target playlist directory supplied by the orchestrator.

`revisit.md` is for candidates not yet admitted. `under-review.md` is for listener-feedback discussions and accepted tracks whose continued place or position is unresolved.

## Listener-feedback authority

Before acting on any user complaint about a track or transition, read the target playlist's `feedback-protocol.md`.

A complaint is evidence, not authorization to change Spotify.

Unless the user explicitly orders an exact removal, movement, replacement, or reorder:

- freeze the affected playlist region;
- ask short clarifying questions first;
- do not edit the ledger, reject the track, resolve the review, scout a replacement into that region, or publish a change;
- summarize the shared diagnosis before proposing action;
- obtain explicit approval before any repair that changes neighbouring or additional tracks.

`feedback-protocol.md` overrides conflicting complaint, repeated-skip, repair-first, and relaxation-first instructions elsewhere in the repository.

## Candidate snapshot lifecycle

- Candidate resolution occurs once before evaluation.
- One `scout-request.json` `runId` produces one immutable completed `scout-data.json` snapshot.
- Evaluator, Sequencer, Auditor, and Librarian use the same frozen three-candidate snapshot.
- After audit approval, do not rerun Scout, rewrite the request, or regenerate the candidate snapshot.
- The Publisher only publishes the canonical ledger. It never invokes `apps/spotify-scout/` and never modifies scout files.
- `scout-data.json` is diagnostic evidence. It cannot override the audited ledger or suppress the final response.

## Relaxation-first operation

The editorial engine exists to reduce the user's effort and stress around discovering music.

- Never assign mandatory A/B comparisons, rankings, prescribed listening sessions, or subjective confirmation tasks.
- Clarifying conversation after volunteered feedback is not homework; keep it short, plain, and answerable from memory.
- Do not freeze playlist growth merely because the user has not confirmed a proposed role.
- Do freeze the specific region named in an unresolved complaint until the clarification gate is complete.
- Do not repeatedly resurface PARKED candidates while waiting for feedback.
- Make the best available editorial decision elsewhere, record uncertainty internally, and continue.
- Natural listener feedback may reopen any accepted decision later.
- `MANUAL ACTION` is reserved for unavoidable technical steps and must never contain listening homework.

## Evidence discipline

Every substantive editorial claim must be understood as one of four kinds:

1. **Measured evidence** — BPM, duration, track identity, position, or later lawful audio measurements.
2. **Craft convention** — useful sequencing practice, not a universal musical law.
3. **Listener report** — the user's actual experience; highest authority when volunteered.
4. **Editorial interpretation** — chapter, crest, summit, re-entry, decompression, and similar role labels; useful hypotheses rather than facts.

Never imply that Spotify access allows the agent to hear or analyse raw Spotify audio. Never infer busyness, stress, spaciousness, hypnosis, or emotional effect from BPM, artist, genre, title, or metadata alone.

## Required order

For curation workflows run:

Scout → Evaluator → Sequencer → Auditor → Librarian → Publisher

Do not write persistent state before audit approval. GitHub is the source of truth. Spotify is a publication target.

Persist the approved editorial change set as one batched commit when GitHub tree/commit tools are available. Do not create intermediate commits for partial phases of one run.

## Delivery safety

- Do not restart completed phases or poll the same status continuously.
- If Spotify publication is pending when the task must finish, report PARTIAL and deliver the final response.
- Pending or secondary-cache failures must not be reported as a failed scheduled task when the editorial commit succeeded.
- The final report is based on the audited decisions, `ledger.md`, and `spotify-status.json`, never on post-publication scout output.

## Spotify publication

- Every canonical ledger row must include one exact Spotify track URI.
- Exact publication is performed by `.github/workflows/publish-spotify.yml` through `apps/spotify-publisher/` only.
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
