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
6. Select REPAIR only for an actionable repair, including new evidence only when it makes a specific repair or revisit actionable; otherwise run mandatory fresh EXPLORE scouting.
7. Keep `AWAITING CLARIFICATION` regions frozen without letting them block exploration elsewhere.
8. Require EXPLORE to search current releases, adjacent or emerging artists or labels, and overlooked catalogue material during the current run.
9. Reject unchanged repository state, an old snapshot, or unsupported reconsideration as proof of fresh discovery.
10. When candidate search is required, apply Scout's objective shortlist floor, select one to three evidence-qualified candidates without quota padding, and distinguish a completed zero-result search from an unperformed or blocked search.
11. Allow an explicitly authorized exact move, removal, reorder, or replacement with an already agreed and resolved track that needs no candidate search to proceed directly to Sequencer and audit.
12. Treat GitHub as the persistent source of truth.
13. Update durable editorial state only after audit approval; allow the immutable diagnostic request/data lifecycle to resolve exact candidate identities before evaluation.
14. Require an exact Spotify URI and verified BPM when available for every candidate and approved ledger row.
15. Distinguish measured evidence, craft convention, listener report, and editorial interpretation.
16. Never claim to hear or analyse Spotify audio from metadata or account scopes.
17. Never assign listening homework, A/B comparisons, rankings, or required subjective confirmation.
18. Treat complaints as clarification conversations unless the user explicitly orders an exact action.
19. Obtain explicit approval before a complaint repair changes neighbouring or additional tracks.
20. Never put listening tasks in `MANUAL ACTION`; reserve it for unavoidable technical steps.
21. Never use the ChatGPT Spotify connector for playlist search, creation, editing, or publication.
22. Let GitHub Actions publish Spotify and generate the journey map.
23. Read `spotify-status.json` for publication status and never infer success.
24. Read `journey-map.json` and append the current compact SVG after `EDITORIAL NOTE` without adding a sixth numbered section.
25. Read `audio-evidence.md`, `audio-evidence.json`, and `live-mixing.md`.
26. Evaluate playlist belonging separately from exact-neighbour compatibility.
27. Preserve provenance and evidence class for DJOID, rekordbox, or other analysis; tool scores never override listener or editorial authority.
28. Keep the live-mixing graph separate from the canonical ledger and Spotify publication.
29. Never surface unrelated Spotify playlists or broad fallback results.

## Default schedule
Use a daily flexible schedule at approximately 08:00 in the user's timezone unless the user specifies another cadence or time.

## Canonical task prompt template

```text
Run the <PLAYLIST_TITLE> editorial workflow using GitHub repository <OWNER/REPO> as the persistent source of truth and <PLAYLIST_DIRECTORY>/ as the target directory. Before acting, read repository-level AGENTS.md, the playlist automation.md and feedback-protocol.md, every file required by automation.md, and all Agent Skills under .agents/skills/.

Use two lanes. First pre-audit for an actionable objective defect, triggered REVISIT, clarified and authorized listener repair, or materially new lawful evidence that makes a specific repair or revisit actionable. If one exists, use REPAIR mode. Other new evidence remains an EXPLORE input. An AWAITING CLARIFICATION region remains frozen and is not actionable; it must not block work elsewhere.

If no actionable repair exists, use EXPLORE mode and perform a mandatory fresh outward discovery scan during this run. Search current releases, adjacent or emerging artists and labels, and overlooked catalogue material. Rereading unchanged repository state, reusing an old candidate snapshot, or reconsidering old candidates without new evidence does not count. Record the scan timestamp, source paths or query windows, inspected scope, exclusions, and shortlist. Begin with playlist belonging; do not invent a missing slot before finding the track.

When candidate search is required, apply Scout's objective shortlist floor, select the strongest one to three evidence-qualified candidates, and resolve each to one exact Spotify track URI and verified BPM when available. Never pad the set. A PARTIAL resolver snapshot may proceed with its one or two resolved candidates while preserving unresolved identities and errors; zero resolved candidates means the lane's search is NOT COMPLETED. If EXPLORE finds none before resolution, report EXPLORATION COMPLETE — NO QUALIFIED CANDIDATES with the scan evidence. If REPAIR finds none, report REPAIR SEARCH COMPLETE — NO QUALIFIED CANDIDATES with the targeted-search evidence. If required search did not run or was blocked, report EXPLORATION NOT COMPLETED or REPAIR SEARCH NOT COMPLETED and the exact reason; do not claim that no suitable music or repair exists. An explicitly authorized exact move, removal, reorder, or replacement with an already agreed and resolved track that needs no candidate search may proceed directly to Sequencer and audit without Scout.

Freeze one immutable run snapshot, then evaluate every candidate strictly. Playlist belonging and exact-neighbour compatibility are separate gates. Novelty, popularity, BPM, key, or a tool score never justifies admission. Unknown audio properties remain unknown. Preserve evidence class and provenance, and never claim to hear Spotify audio through metadata or the Web API. Preserve every frozen and protected region. Treat complaints as evidence, not authorization, and never assign listening homework. Keep live mixing separate from the canonical ordered playlist.

After Auditor approval, persist one batched editorial commit only when durable editorial state changed, such as the ledger, rejected or revisit decisions, listener-review state, substantive notes or annotations, audio evidence, or live-mixing state. A scan timestamp, repeated no-change result, or appended nothing-changed record alone must not create an editorial commit.

Let GitHub Actions publish Spotify and generate the journey map. Read spotify-status.json and report COMPLETE only after exact verification. Follow automation.md's five-section response format, include the target playlist's published detailed-site URL from its automation contract or journey-map.json, and append the current generated journey-map SVG after EDITORIAL NOTE. If the compact map is stale, write Journey map updating. Never use the ChatGPT Spotify connector for canonical search, publication, or verification, and never surface unrelated Spotify playlists or broad fallback results.
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
- it selects REPAIR only for an actionable target and otherwise requires a fresh outward EXPLORE scan;
- it records exploration provenance and distinguishes completed zero-result from blocked or unperformed search;
- it permits one to three strong candidates without quota padding;
- it handles repair-zero and explicitly authorized direct-action branches without inventing candidates;
- it creates no repository commit when durable editorial state remains unchanged;
- it uses `spotify-status.json` as the only Spotify publication-status source;
- it appends the current compact journey map after the fifth section.
