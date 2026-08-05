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
- `journey-annotations.json`
- `journey-map.json`
- `journey-map.svg`
- `journey-map-spec.md`
- `audio-evidence.md`
- `audio-evidence.json`
- `live-mixing.md`
- `sites-prompt.md`

These Markdown and JSON paths are the canonical ChatGPT instruction, editorial-state, and visualization paths. Do not relocate them when adding runtime applications or automation.

The playlist directory is persistent editorial state. The skill packages are generic and must operate on the target playlist directory supplied by the orchestrator.

`revisit.md` is for candidates not yet admitted. `under-review.md` is for listener-feedback discussions and accepted tracks whose continued place or position is unresolved.

## Listener-feedback authority

Before acting on any user complaint about a track or transition, read the target playlist's `feedback-protocol.md`.

A complaint is evidence, not authorization to change Spotify.

An exact first-message action command bypasses clarification and `DIAGNOSIS AGREED` for exactly the named scope. Record it as the matching `APPROVED — ...` state before persistence. Any additional neighbour, bridge, replacement search, or wider reorder still requires explicit scope approval.

Unless the user explicitly orders an exact removal, movement, replacement, or reorder:

- freeze the affected playlist region;
- ask short clarifying questions first;
- do not edit the ledger, reject the track, resolve the review, scout a replacement into that region, or publish a change;
- summarize the shared diagnosis before proposing action;
- obtain explicit approval before any repair that changes neighbouring or additional tracks.

`feedback-protocol.md` overrides conflicting complaint, repeated-skip, repair-first, and relaxation-first instructions elsewhere in the repository.

## Editorial lanes and candidate snapshots

Every scheduled or explicitly requested editorial run has two lanes:

1. **Repair lane** — pre-audit first looks for an actionable objective defect, a triggered REVISIT, a clarified and authorized listener repair, or materially new lawful evidence that makes a specific existing repair or revisit actionable.
2. **Exploration lane** — when no actionable repair exists, Scout must perform a fresh outward discovery scan. A pre-existing gap is not required; a newly found track may reveal a distinct opportunity.

An `AWAITING CLARIFICATION` discussion is frozen and non-actionable. It does not block exploration elsewhere.

- Rereading unchanged repository state, reusing an old snapshot, or reconsidering old candidates without new evidence does not count as fresh discovery.
- Exploration must search current releases, adjacent or emerging artists and labels, and overlooked catalogue material, with source paths and timestamp recorded in the run evidence.
- Scout may send one to nine ranked **resolution leads** to the Spotify resolver. A lead is not yet a candidate. The resolver deduplicates exact identities and freezes the strongest one to three exactly resolved tracks as the candidate snapshot; never pad either set to meet a quota.
- A lead without an exact Spotify identity is recorded as an exclusion or unresolved outcome, not evaluated as a candidate. Supplied track IDs are verified against exact title, artist, and version; broad, alternate-version, or unrelated matches are forbidden. A unique exact title/artist match may survive album wording or release-date variance only when the variance is preserved as a warning.
- If the fresh scan yields none, return `EXPLORATION COMPLETE — NO QUALIFIED CANDIDATES` and have the Auditor validate the scan itself. If search did not run or was blocked, return `EXPLORATION NOT COMPLETED`; neither result proves that the playlist is complete.
- If an actionable repair search yields none, return `REPAIR SEARCH COMPLETE — NO QUALIFIED CANDIDATES` and have the Auditor validate the targeted search.
- If required exploration or repair search did not run or was blocked, return `EXPLORATION NOT COMPLETED` or `REPAIR SEARCH NOT COMPLETED` with the exact reason; never convert a technical failure into a musical conclusion.
- Candidate resolution occurs once before evaluation. New requests use `schemaVersion: 2`, pin the canonical resolver inputs with `sourceCommit`, store ranked entries under `leads`, and reserve `candidates` for exactly resolved `scout-data.json` output.
- One `scout-request.json` `runId` produces one immutable terminal `scout-data.json` snapshot. Editing any target, receipt, lead, or evidence under the same `runId` is invalid anywhere in repository history; a changed request requires a new `runId`.
- A resolver-only recovery of a previously failed request uses a new `runId` plus `recoveryOfRunId` and `recoveryReason`, pins `sourceCommit` to the commit containing the failed request, and preserves its mode, target, receipt, and ranked leads exactly apart from the schema-v2 lead migration. It completes that original scan; it does not claim a second fresh scan. A recovered snapshot is usable only while canonical resolver inputs remain unchanged.
- Recovery may not hide a mutated source request. A pre-enforcement source with multiple historical contents requires an explicit `legacySalvage` reason and an exhaustive list of every commit containing those conflicting variants; the validator additionally proves every listed commit is at or before the hard immutable-history cutoff. New source mutations are never salvageable workflow behavior.
- The request and snapshot preserve `mode`; EXPLORE also preserves the frozen exploration receipt. Lead and candidate records preserve search intent, proposed placements, fit hypothesis, and evidence fields.
- `scout-data.json.resolutionStatus` is `COMPLETE`, `PARTIAL`, or `NONE`. COMPLETE means every lead resolved, PARTIAL means at least one but not all resolved, and NONE means zero resolved. PARTIAL may proceed with at most three selected candidates while preserving every unresolved identity and error; never substitute or pad. NONE is valid only after every identity lookup completes normally. Credentials, network, authentication, rate limits, Spotify 5xx responses, stale resolver inputs, and malformed/conflicting snapshots fail operationally and remain `*_NOT_COMPLETED`.
- The snapshot stores a canonical request fingerprint and must pass count, status, selection, uniqueness, and outcome invariants before reuse. Spotify market relinking is allowed only when `linked_from` proves the supplied ID and the changed playable ID is preserved as a warning.
- Every resolver-dependent report must use a matching request/data `runId`. PARTIAL and NONE outcomes name every unresolved `Artist — Track` and exact resolver error. If no matching terminal snapshot arrives after a bounded wait, the blocked report names the request leads and reports `no matching terminal snapshot`; it must never reason from stale scout data.
- Evaluator, Sequencer, Auditor, and Librarian use the same frozen snapshot.
- After audit approval, do not rerun Scout, rewrite the request, or regenerate the candidate snapshot.
- The Publisher only publishes the canonical ledger. It never invokes `apps/spotify-scout/` and never modifies scout files.
- `scout-data.json` is diagnostic evidence. It cannot override the audited ledger or suppress the final response.

## Audio-aware compatibility

The editorial engine asks two different questions:

1. **Playlist belonging** — does the track belong anywhere in the playlist's artistic world?
2. **Neighbour compatibility** — does it work in this exact position between these neighbours?

A track may pass belonging and fail a proposed placement. Evaluate and record both questions separately.

Lawful audio-derived measurements and model outputs are stored under the target playlist's `audio-evidence.json` contract defined by `audio-evidence.md`. Every field requires provenance, tool/version, timestamp, confidence, and evidence class. DJOID, rekordbox, or another analyser may contribute evidence, but its scores never become listener report and never outrank the constitution or volunteered listener experience. Missing audio evidence remains unknown and must never be invented.

Live mixing is a separate performance layer governed by `live-mixing.md`. Its transition graph may offer several exits from a track, but it must not alter the canonical ordered-listening ledger, Spotify order, journey annotations, or frozen review regions unless the user separately authorizes an editorial change.

## Journey-map lifecycle

The playlist visualization has two layers:

1. `journey-map.svg` — compact map for the end of editorial-run responses.
2. `journey-map.json` — Sites-ready detailed data model.

Rules:

- `journey-annotations.json` is editorial input and must be updated in the same approved change set whenever a ledger change alters chapter, role, protected, provisional, or frozen state.
- Story height is ordinal editorial interpretation, never measured audio energy, mood, loudness, or waveform analysis.
- BPM and duration remain separate measured layers.
- `.github/workflows/build-journey-map.yml` generates JSON and SVG through `apps/journey-map/`.
- The map is derivative output. `ledger.md`, `journey-annotations.json`, and listener-feedback state remain authoritative.
- A published read-only detailed front end must take its status and URL from the target playlist's generated `journey-map.json` or playlist-specific automation contract; `sites-prompt.md` remains its maintenance/rebuild brief. No replacement website should become a second source of truth.
- The compact map should appear after `EDITORIAL NOTE` without adding a sixth numbered response section. When the target playlist's `automation.md` requires an unnumbered `RUN ANALYSIS`, append it after the map.
- If map generation is pending, finish the response and label the map as updating rather than failing the editorial run.

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
4. **Editorial interpretation** — chapter, crest, summit, re-entry, decompression, story height, and similar role labels; useful hypotheses rather than facts.

Never imply that Spotify access allows the agent to hear or analyse raw Spotify audio. Never infer busyness, stress, spaciousness, hypnosis, or emotional effect from BPM, artist, genre, title, or metadata alone.

## Required order

For an actionable repair:

Pre-audit → Repair Scout → Evaluator → Sequencer → Auditor → Librarian → Publisher

For an explicitly authorized exact move, removal, reorder, or replacement with an already agreed and resolved track that requires no candidate search:

Pre-audit → Sequencer → Auditor → Librarian → Publisher

When no actionable repair exists:

Pre-audit → Exploration Scout → Evaluator → Sequencer → Auditor → Librarian → Publisher

When a fresh exploration scan yields no qualified candidate:

Pre-audit → Exploration Scout → Auditor → Publisher

When an actionable repair search yields no qualified candidate:

Pre-audit → Repair Scout → Auditor → Publisher

Do not write durable editorial state before audit approval. The immutable diagnostic `scout-request.json` → `scout-data.json` resolution lifecycle may write before evaluation; it carries no verdict and authorizes no editorial change. GitHub is the source of truth. Spotify is a publication target.

Persist the approved editorial change set as one batched commit when GitHub tree/commit tools are available. Do not create intermediate editorial commits for partial phases of one run. Do not create a repository commit merely to append a repeated no-change or zero-qualified-candidate run record.

## Delivery safety

- Do not restart completed phases or poll the same status continuously.
- If Spotify or map publication is pending when the task must finish, report the pending state and deliver the final response.
- Pending or secondary-cache failures must not be reported as a failed scheduled task when the editorial commit succeeded.
- The final report is based on the audited decisions, `ledger.md`, `spotify-status.json`, and the latest matching map fingerprint, never on post-publication scout output.
- When the target playlist requires end-of-run analysis, base it on the Auditor's evidence packet and persisted final state. The analysis may challenge the run but must not reopen Scout, alter audited decisions, or create a telemetry-only commit.

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
3. Configure Spotify Web API credentials as GitHub Actions secrets if automatic publication and duration-enriched maps are desired.
4. Invoke the scheduler skill once to create the recurring task.
5. Use one orchestrator task per playlist workflow; never create competing per-skill recurring tasks.
