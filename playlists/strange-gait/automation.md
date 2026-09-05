# STRANGE GAIT — Automation Orchestrator

GitHub is the persistent source of truth. Target directory: `playlists/strange-gait/`.

Read repository-level `AGENTS.md`, this file, `feedback-protocol.md`, and all seven skills under `.agents/skills/` before every editorial run. Also read:

1. `constitution.md`
2. `audio-evidence.md`
3. `audio-evidence.json`
4. `live-mixing.md`
5. `ledger.md`
6. `journey-annotations.json`
7. `journey-map-spec.md`
8. `discoveries.md`
9. `rejected.md`
10. `revisit.md`
11. `under-review.md`
12. `notes.md`
13. `spotify.json`
14. `spotify-status.json`
15. `journey-map.json` when present

`feedback-protocol.md` overrides conflicting complaint-handling rules.

## Operating lanes

### REPAIR
Choose REPAIR only for an actionable objective defect, a triggered STRANGE GAIT REVISIT, a clarified and authorized listener repair, or materially new lawful evidence that makes a specific repair/revisit actionable.

An `AWAITING CLARIFICATION` region is frozen and non-actionable. It does not block work elsewhere.

### EXPLORE
When no actionable repair exists, perform a genuinely fresh outward scan during this run. Search:

- current releases;
- adjacent or emerging artists and labels;
- overlooked catalogue material.

Prioritize rhythmic behaviours central to STRANGE GAIT: displacement, asymmetry, swing, polymeter, syncopation, elastic low end, organic/mechanical percussion, half-time illusion, phase-like drift, negative space, and controlled rhythmic fracture.

Do not search only for genre tags. Do not recycle old leads without materially new evidence. Begin with playlist belonging; discover the track before claiming a missing slot.

Record a fresh UTC receipt with source URLs or bounded query windows, approximate inspected scope, exclusions, and ranked leads.

## Volume boundary

GROOVE OVER NOISE is context, not this playlist's state. Do not mutate it, copy its ledger, or mechanically migrate its rejected/revisit queues.

A prior Volume I track may be considered only through fresh evidence under the STRANGE GAIT constitution.

## Bootstrap handling

When the ledger is empty or has fewer than three tracks, follow `constitution.md`'s bootstrap rule.

- A lead may use the concrete placement `bootstrap opener — track 1 in empty ledger` when no neighbours exist.
- Track 1 neighbour compatibility is `N/A — empty ledger`.
- Track 2 evaluates the incoming neighbour only.
- Until three canonical tracks exist, approve at most **one ADD per run**.
- Do not manufacture two-sided neighbour evidence where no neighbour exists.

## Scout and resolver lifecycle

When one or more honest leads meet the non-identity floor:

1. Read the current repository SHA immediately before writing.
2. Write `scout-request.json` exactly once with `schemaVersion: 2`, a new immutable `runId`, that SHA as `sourceCommit`, mode, target, EXPLORE receipt when applicable, and one to nine ranked entries under `leads`.
3. Never write request-side `candidates`, reuse a runId, or combine the request commit with ledger/rejected/revisit/discoveries changes.
4. Require the repository resolver's matching terminal `scout-data.json` with the same runId and canonical request fingerprint.
5. Only the strongest one to three unique exact identities in `scout-data.json.candidates` continue.
6. Preserve every warning, unresolved/duplicate lead and exact error, plus resolved-but-unselected alternates.

`COMPLETE` means every lead resolved. `PARTIAL` may proceed with selected candidates. `NONE` is valid only when every lookup completed normally. Credentials, authentication, network, rate limits, Spotify 5xx, stale inputs, malformed/conflicting state, or a missing terminal snapshot are `*_NOT_COMPLETED`, never NONE.

A resolver-only recovery follows repository-level recovery rules and never satisfies a later run's fresh-scan requirement.

If no lead clears the floor before resolution, create no padded request or snapshot; send the fresh receipt directly to Auditor.

## Evaluation

For every selected candidate separate:

- playlist belonging;
- exact-neighbour compatibility (or the documented bootstrap `N/A` case);
- measured evidence;
- craft convention;
- listener evidence;
- editorial interpretation;
- unknown audio properties.

Novelty, popularity, BPM, key, complexity, extra length, artist reputation, or a tool score never justifies admission.

STRANGE GAIT-specific scrutiny:

- Does asymmetry strengthen bodily pull or merely show complexity?
- Does a noticeable transition preserve the physical thread?
- Does the candidate introduce a distinct gait/function rather than another version of an occupied tilt/lock/fracture?
- Is the candidate becoming IDM spectacle, industrial impact, hardgroove cliché, or ornamental tribalism?
- Does a half/double-time relation have evidence, or is it being invented from numbers?

Unknown perceived pulse remains unknown.

## Sequencing

Preferred story:

`Ground → Tilt → Lock → Fracture → Deep Lock → Escape`

The shape is flexible. No dominant summit is required. A transition may be perceptible; it must not eject the body from the journey.

Default adjacent BPM target is 0–5. Differences of 6–9 require concrete continuity evidence. Above 9 normally requires documented half/double-time equivalence or an audited intentional reset. BPM compliance is never sonic proof.

Preserve protected and frozen regions. Live-mixing alternatives remain separate from canonical order.

## Audit and persistence

Auditor validates lane selection, fresh evidence, resolver integrity, belonging/placement separation, bootstrap handling, tempo reasoning, protected/frozen state, and unsupported sonic claims.

After approval, Librarian persists one logical editorial commit only when durable state changed. Update `journey-annotations.json` with every canonical track/chapter/status change. Do not append telemetry-only or repeated no-change commits.

The diagnostic scout request/snapshot lifecycle may commit before verdict; it carries no editorial decision.

## Spotify publication

GitHub Actions publish only the canonical target ledger through `apps/spotify-publisher/` and write `spotify-status.json` after exact read-back verification.

Never use the ChatGPT Spotify connector for canonical search, publication, or verification.

`COMPLETE` may be reported only from a matching `spotify-status.json` record.

## Journey-map model

Story height means **ordinal rhythmic displacement / narrative tension**, not measured energy, loudness, mood, density or waveform intensity.

Generated files are `journey-map.json` and `journey-map.svg`. Do not hand-edit them.

If the ledger is empty, the map may legitimately be absent. Once a map exists, treat it as current only when its ordered URI list exactly equals the ledger.

## Exact user-facing response

Use exactly five numbered sections for every editorial run:

1. `TODAY'S DECISION` or `TODAY'S DECISIONS`
2. `LEDGER CHANGE`
3. `SPOTIFY STATUS`
4. `DETAILED MAP`
5. `EDITORIAL NOTE`

For evaluated candidates, section 1 includes every selected candidate: Verdict, Track — Artist, Position, Purpose, and one-sentence Reason. Preserve unresolved errors for PARTIAL/NONE without linking unresolved identities.

For zero-lead EXPLORE: `EXPLORATION COMPLETE — NO QUALIFIED CANDIDATES` plus a short evidence-based scan summary.

For blocked discovery/resolution: `EXPLORATION NOT COMPLETED` or `REPAIR SEARCH NOT COMPLETED` plus the exact technical reason and affected leads. Never use stale scout data.

Section 2 contains only audited canonical additions/removals/replacements/reordering; otherwise `None.`

Section 3 uses only `spotify-status.json`. While the initial empty Spotify playlist is being created, report its actual persisted state rather than inferring success.

Section 4:
- if `journey-map.json` declares a published detailed site, link its exact URL;
- otherwise write `Not published yet — detailed map will activate after the journey has canonical material.`

Section 5 is one sentence.

When the compact map is current append:

```markdown
![STRANGE GAIT journey map](https://raw.githubusercontent.com/broskmenmi/editorial-engine/main/playlists/strange-gait/journey-map.svg)
```

If absent because the ledger is empty, write `Journey map not yet generated`. If stale/pending, write `Journey map updating`.

Then always append the unnumbered `## RUN ANALYSIS` required below.

Purpose: maximum eight words. Reason: maximum ten words. Do not print the full ledger unless asked.

## RUN ANALYSIS

Every scheduled/requested editorial run must end with a critical analysis grounded in the Auditor evidence packet and persisted final state.

It must:

1. identify exact run timestamp and candidate runId when present;
2. reconstruct the real funnel from material inspected → leads → exact resolutions → evaluated candidates → ADD/REJECT/REVISIT/NO VERDICT → verified published additions;
3. give at least two run-specific observations from distinct completed phases, or identify the last completed phase and blocker;
4. challenge the strongest conclusion with a plausible alternative explanation or contract issue;
5. state what the run proves and does not prove;
6. apply outcome-specific scrutiny;
7. compare recent runs only when genuinely comparable;
8. recommend a next action only when an evidenced defect/opportunity justifies one;
9. mark audio-evidence and live-mixing capabilities `NOT TESTED` unless actually exercised.

The analysis may not rerun Scout, mutate frozen request/snapshot data, revise audited decisions, write editorial state, or create an analysis-only commit.
