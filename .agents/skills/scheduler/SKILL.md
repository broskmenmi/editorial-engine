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
2. The playlist directory must contain `automation.md`, `constitution.md`, `ledger.md`, `under-review.md`, `spotify.json`, and `spotify-status.json`.
3. Repository-level `AGENTS.md` and all required Agent Skills must exist.
4. Spotify API credentials are configured as GitHub Actions secrets when automatic publication is desired.

## Task creation procedure
Create one recurring ChatGPT task, not one task per skill.

The task prompt must:
1. Name the repository and playlist directory explicitly.
2. Read `AGENTS.md` and the playlist's `automation.md` first.
3. Load the Agent Skills from `.agents/skills/<skill-name>/SKILL.md`.
4. Read `under-review.md` before scouting.
5. Execute the configured workflow in order.
6. Treat GitHub as the persistent source of truth.
7. Update GitHub only after audit approval.
8. Require an exact Spotify URI and verified BPM when available for every candidate and every approved ledger row.
9. Distinguish measured evidence, craft convention, listener report, and editorial interpretation.
10. Never claim to hear or analyse Spotify audio from metadata or account scopes.
11. Never assign listening homework, A/B comparisons, rankings, or required subjective confirmation.
12. Never freeze growth solely because the user has not confirmed a proposed role.
13. Never put listening tasks in `MANUAL ACTION`; reserve it for unavoidable technical steps.
14. Never use the ChatGPT Spotify connector for playlist search, creation, editing, or publication.
15. Let the GitHub Action publish from the ledger using the persisted playlist ID.
16. Read `spotify-status.json` for publication status and never infer success.
17. Never surface unrelated Spotify playlists or broad fallback results.

## Default schedule
Use a daily flexible schedule at approximately 08:00 in the user's timezone unless the user specifies another cadence or time.

## Canonical task prompt template

```text
Run the <PLAYLIST_TITLE> editorial workflow using GitHub repository <OWNER/REPO> as the persistent source of truth. Read repository-level AGENTS.md and <PLAYLIST_DIRECTORY>/automation.md first. Load and follow the Agent Skills under .agents/skills/, each from its SKILL.md. Use <PLAYLIST_DIRECTORY>/ as the target playlist directory. Execute the workflow in the order defined by automation.md. Read under-review.md before scouting. Find exactly three candidate tracks and resolve each to one exact Spotify track URI and verified BPM when available. Separate measured evidence, craft convention, listener report, and editorial interpretation. Never infer sonic or emotional qualities from metadata alone, and never claim to hear or analyse Spotify audio through the Web API. Make the best available editorial decision without assigning the user A/B comparisons, rankings, prescribed listening sessions, or subjective confirmation. Do not freeze playlist growth merely because a role is unconfirmed. Never place listening tasks in MANUAL ACTION; reserve that section for unavoidable technical steps only. Never surface unrelated Spotify playlists or broad search fallback results. Update GitHub only after audit approval. Every approved ledger row must include its exact Spotify URI and remain in recommended listening order. Do not use the ChatGPT Spotify connector to search for, create, edit, or publish the canonical playlist. Spotify publication is handled by the repository GitHub Action using spotify.json and the Spotify Web API. Read spotify-status.json and report COMPLETE only after exact verification; otherwise report PARTIAL or MANUAL REQUIRED accurately. Only link the canonical playlist URL from spotify-status.json and the three candidate tracks. Keep the user-facing response compact and follow the exact response structure defined in automation.md.
```

## Verification
After creating or updating the task, verify:
- it is enabled;
- the schedule and timezone are correct;
- the task prompt references the correct repository and playlist directory;
- it reads `AGENTS.md`, `automation.md`, `under-review.md`, and Agent Skills from their normal paths;
- it distinguishes evidence from interpretation;
- it forbids connector-based Spotify publication and false audio-listening claims;
- it forbids mandatory listening work;
- it uses `spotify-status.json` as the only publication-status source.
