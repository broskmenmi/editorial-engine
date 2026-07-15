# Setup

This repository contains editorial state and Codex/ChatGPT Agent Skills. Cloning or forking it does **not** automatically create a recurring ChatGPT task or connect Spotify/GitHub. Each user must perform the setup below in their own ChatGPT account.

## 1. Fork or clone the repository

Use a repository to which the user and the ChatGPT GitHub connector have read/write access.

If the repository name changes, replace every reference to `broskmenmi/editorial-engine` in the task prompt with the new `owner/repository` value.

## 2. Connect apps in ChatGPT

Required:
- **GitHub** — read/write access to the repository.

Optional but recommended:
- **Spotify** — required to find, create, or update the published playlist. When track-level editing is unavailable, the workflow still maintains the canonical ledger and returns manual Spotify instructions.

Verify GitHub access by asking ChatGPT to list accessible repositories and read `AGENTS.md` from the selected repository.

## 3. Choose or create a playlist definition

Each playlist lives at:

```text
playlists/<playlist-slug>/
```

Required files:
- `constitution.md` — editorial identity and acceptance criteria.
- `ledger.md` — canonical ordered track list.
- `discoveries.md` — append-only run history.
- `rejected.md` — rejected candidates and reasons.
- `revisit.md` — unresolved candidates.
- `notes.md` — current structural diagnosis and scouting priority.
- `automation.md` — playlist-specific orchestration.

`playlists/groove-over-noise/` is the included reference implementation.

## 4. Create the recurring ChatGPT task

The task is account-specific and cannot be installed merely by downloading the repository. In a ChatGPT conversation with GitHub connected, ask:

```text
Use the scheduler skill in .agents/skills/scheduler/SKILL.md to create a daily recurring task for playlists/groove-over-noise/ at 08:00 in my timezone.
```

The scheduler skill contains the canonical task-prompt template and verification checklist.

The recurring task should be a **single orchestrator task**. Do not create separate recurring tasks for Scout, Evaluator, Sequencer, Auditor, Librarian, and Publisher.

## 5. Verify the task

Confirm that the task:
- is enabled;
- uses the intended schedule and timezone;
- references the correct GitHub repository;
- reads `AGENTS.md` and the target playlist's `automation.md`;
- loads Agent Skills from `.agents/skills/*/SKILL.md`;
- treats GitHub as the source of truth;
- creates the Spotify playlist when absent if creation is available;
- updates the existing playlist when editing is available;
- never creates duplicates;
- always returns manual add/remove/reorder instructions.

## 6. First-run expectation

The first run should:
1. read the current ledger and editorial history;
2. scout exactly three candidates;
3. evaluate, sequence, and audit them;
4. update GitHub only after audit approval;
5. attempt Spotify publication;
6. return manual instructions and the final canonical order regardless of sync status.

## Portability boundary

The repository preserves:
- skills;
- playlist constitutions;
- canonical ledgers;
- editorial history;
- orchestration instructions.

The repository does **not** preserve:
- another user's ChatGPT recurring task;
- connector authorization;
- Spotify authentication;
- timezone or notification preferences.

Those account-specific elements must be configured once by each user.