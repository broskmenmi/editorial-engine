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
2. The playlist directory must contain `automation.md`, `constitution.md`, `feedback-protocol.md`, `audio-evidence.md`, `audio-evidence.json`, `live-mixing.md`, `ledger.md`, `under-review.md`, `journey-annotations.json`, `spotify.json`, and `spotify-status.json`.
3. Repository-level `AGENTS.md` and all required Agent Skills must exist.
4. Spotify API credentials are configured as GitHub Actions secrets when automatic publication and duration-enriched maps are desired.

## Task creation procedure
Create one recurring ChatGPT task, not one task per skill.

The task prompt must:
1. Name the repository and playlist directory explicitly.
2. Read `AGENTS.md`, `automation.md`, and `feedback-protocol.md` first.
3. Load the Agent Skills from `.agents/skills/<skill-name>/SKILL.md`.
4. Read `under-review.md` before scouting.
5. Execute the configured workflow in order.
6. Treat GitHub as the persistent source of truth.
7. Update GitHub only after audit approval.
8. Require an exact Spotify URI and verified BPM when available for every candidate and approved ledger row.
9. Distinguish measured evidence, craft convention, listener report, and editorial interpretation.
10. Never claim to hear or analyse Spotify audio from metadata or account scopes.
11. Never assign listening homework, A/B comparisons, rankings, or required subjective confirmation.
12. Treat complaints as clarification conversations unless the user explicitly orders an exact action.
13. Freeze only the affected region during an unresolved complaint.
14. Obtain explicit approval before a complaint repair changes neighbouring or additional tracks.
15. Never put listening tasks in `MANUAL ACTION`; reserve it for unavoidable technical steps.
16. Never use the ChatGPT Spotify connector for playlist search, creation, editing, or publication.
17. Let GitHub Actions publish Spotify and generate the journey map.
18. Read `spotify-status.json` for publication status and never infer success.
19. Read `journey-map.json` and append the current compact SVG after `EDITORIAL NOTE` without adding a sixth numbered section.
20. Read `audio-evidence.md`, `audio-evidence.json`, and `live-mixing.md`.
21. Evaluate playlist belonging separately from exact-neighbour compatibility.
22. Preserve provenance and evidence class for DJOID, rekordbox, or other analysis; tool scores never override listener or editorial authority.
23. Keep the live-mixing graph separate from the canonical ledger and Spotify publication.
24. Never surface unrelated Spotify playlists or broad fallback results.

## Default schedule
Use a daily flexible schedule at approximately 08:00 in the user's timezone unless the user specifies another cadence or time.

## Canonical task prompt template

```text
Run the <PLAYLIST_TITLE> editorial workflow using GitHub repository <OWNER/REPO> as the persistent source of truth. Read repository-level AGENTS.md and <PLAYLIST_DIRECTORY>/automation.md first, including feedback-protocol.md, audio-evidence.md, audio-evidence.json, and live-mixing.md. Load and follow the Agent Skills under .agents/skills/, each from its SKILL.md. Use <PLAYLIST_DIRECTORY>/ as the target playlist directory. Execute the workflow in the order defined by automation.md. Read under-review.md before scouting. Find exactly three candidate tracks and resolve each to one exact Spotify track URI and verified BPM when available. Separate measured evidence, model-derived audio evidence, craft convention, listener report, and editorial interpretation. Evaluate playlist belonging separately from compatibility with the exact proposed neighbours. Preserve provenance for DJOID, rekordbox, and other analysis; their scores are sensors, not authority. Keep any live-mixing graph separate from the canonical ledger and Spotify order. Never infer sonic or emotional qualities from metadata alone, and never claim to hear or analyse Spotify audio through the Web API. Make the best available editorial decision without assigning A/B comparisons, rankings, prescribed listening sessions, or subjective confirmation. Treat a complaint as evidence rather than authorization unless the user explicitly orders an exact change; freeze the affected region, ask short clarifying questions, and obtain explicit approval before changing neighbouring or additional tracks. Never place listening tasks in MANUAL ACTION. Never surface unrelated Spotify playlists or broad search fallback results. Update GitHub only after audit approval. Every approved ledger row must include its exact Spotify URI and remain in recommended listening order. Update journey-annotations.json whenever the map's editorial state changes. Do not use the ChatGPT Spotify connector to search for, create, edit, or publish the canonical playlist. Spotify publication is handled by the repository GitHub Action using spotify.json and the Spotify Web API. Read spotify-status.json and report COMPLETE only after exact verification; otherwise report PARTIAL or MANUAL REQUIRED accurately. Follow the exact five-section response structure defined in automation.md, then append the current generated journey-map SVG after EDITORIAL NOTE without creating a sixth numbered section. If the map is stale, write Journey map updating instead. Only link the canonical playlist URL, the three candidate tracks, and the generated journey-map image.
```

## Verification
After creating or updating the task, verify:
- it is enabled;
- the schedule and timezone are correct;
- the task prompt references the correct repository and playlist directory;
- it reads `AGENTS.md`, `automation.md`, `feedback-protocol.md`, `under-review.md`, journey-map state, and Agent Skills from their normal paths;
- it distinguishes evidence from interpretation;
- it forbids connector-based Spotify publication and false audio-listening claims;
- it forbids mandatory listening work;
- it applies clarification and multi-track scope gates;
- it uses `spotify-status.json` as the only Spotify publication-status source;
- it appends the current compact journey map after the fifth section.
