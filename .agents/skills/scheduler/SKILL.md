# Scheduler Skill

## Responsibility
Create or update the recurring ChatGPT task that runs an editorial workflow for a selected playlist.

## Inputs
- Repository full name.
- Playlist directory, for example `playlists/groove-over-noise/`.
- Desired schedule and timezone.
- Playlist title.

## Preconditions
1. The GitHub connector must have read/write access to the repository.
2. Spotify should be connected if publication is desired.
3. The playlist directory must contain `automation.md`, `constitution.md`, and `ledger.md`.
4. Repository-level `AGENTS.md` and all required Agent Skills must exist.

## Task creation procedure
Create one recurring ChatGPT task, not one task per skill.

The task prompt must:
1. Name the repository and playlist directory explicitly.
2. Read `AGENTS.md` and the playlist's `automation.md` first.
3. Load the Agent Skills from `.agents/skills/<skill-name>/SKILL.md`.
4. Execute the configured workflow in order.
5. Treat GitHub as the persistent source of truth.
6. Update GitHub only after audit approval.
7. Search for the canonical Spotify playlist; create it if absent and creation is available; update it if editing is available.
8. Never create a duplicate canonical playlist.
9. Always output exact manual add/remove/reorder instructions and the final canonical order.

## Default schedule
Use a daily flexible schedule at approximately 08:00 in the user's timezone unless the user specifies another cadence or time.

## Canonical task prompt template

```text
Run the <PLAYLIST_TITLE> editorial workflow using GitHub repository <OWNER/REPO> as the persistent source of truth. Read repository-level AGENTS.md and <PLAYLIST_DIRECTORY>/automation.md first. Load and follow the Agent Skills under .agents/skills/, each from its SKILL.md. Use <PLAYLIST_DIRECTORY>/ as the target playlist directory. Execute the workflow in the order defined by automation.md. Find exactly three candidates. Update GitHub only after audit approval. The Publisher must search for an owned Spotify playlist named <PLAYLIST_TITLE>; create it if it does not exist and creation is available, or update it to match ledger.md if editing is available. Never create a duplicate when the canonical playlist already exists. Always provide exact manual add/remove/reorder instructions and the final canonical order, regardless of Spotify synchronization success. Optimize for ordered listening rather than beatmatching or harmonic mixing. State that Spotify Mix may alter the intended arc and is for discovery rather than the canonical journey.
```

## Verification
After creating or updating the task, verify:
- it is enabled;
- the schedule and timezone are correct;
- the task prompt references the correct repository and playlist directory;
- the Publisher behavior includes create-if-missing, update-if-present, no duplicates, and manual instructions.
