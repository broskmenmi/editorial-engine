---
name: librarian
description: Persist approved playlist decisions in GitHub by maintaining the canonical ledger, discoveries log, rejected list, revisit queue, listener-feedback discussions, structural notes, and journey-map annotations. Use only after audit approval.
---

# Librarian

## Read first

Read `feedback-protocol.md`, `under-review.md`, `journey-annotations.json`, and `journey-map-spec.md` before writing anything related to a user complaint or visualization state.

## Complaint persistence gate

A complaint is not authorization to edit the playlist.

When the user comments negatively but does not explicitly order an exact action:

- preserve the exact wording in `under-review.md`;
- set status to `AWAITING CLARIFICATION`;
- record the current ledger state and affected region;
- update `journey-annotations.json` only to mark the existing region frozen when needed;
- do not edit `ledger.md`;
- do not publish Spotify;
- do not add the track to `rejected.md`;
- do not resolve the review;
- do not add, remove, move, or replace any neighbour;
- do not turn a proposed alternative placement into an active REVISIT candidate before the diagnosis is agreed.

Repeated skipping, stress, dislike, and relief are strong evidence but do not bypass this gate unless the user explicitly orders removal or another exact change.

Only these states authorize a ledger change:

- `APPROVED — KEEP`
- `APPROVED — MOVE`
- `APPROVED — REPLACE`
- `APPROVED — REMOVE`

If a repair changes more than the complained-about track, persist it only after the user explicitly approved the named multi-track scope.

## Audio-evidence persistence

`audio-evidence.json` is an evidence registry, not an editorial verdict store.

- Persist only newly supplied lawful measurements or explicit tool exports.
- Preserve provenance, tool and version, timestamp, confidence, evidence class, and exact Spotify URI.
- Keep measured values separate from model-derived scores.
- Never infer or backfill unknown values.
- Do not update the registry merely because a daily run occurred.
- Tool evidence may support a decision but cannot encode ADD, REJECT, listener report, or approval state.

`live-mixing.md` governs a separate performance graph. Persisting a live edge must not change `ledger.md`, Spotify order, journey annotations, protected state, or frozen review state.

## Responsibilities after approval

1. Use the frozen candidate snapshot approved by the Auditor; do not rerun Scout.
2. Update `ledger.md` with approved ADD, REMOVE, REPLACE, and REORDER decisions.
3. Require exact Spotify URI and verified BPM when available.
4. Keep ledger row order equal to publication order and renumber consecutively.
5. Recalculate the complete BPM trajectory.
6. Append the run or feedback resolution to `discoveries.md`.
7. Add durable REJECT decisions to `rejected.md` only after approval.
8. Add or update external REVISIT candidates when appropriate.
9. Maintain feedback discussions and resolutions in `under-review.md`.
10. Update `notes.md` with current structure, frozen regions, and approved changes.
11. Update `journey-annotations.json` in the same approved change set whenever any track, chapter, story band, protected state, provisional state, or frozen region changes.
12. Preserve history; do not silently rewrite prior decisions.
13. Prevent duplicate URIs.

## Journey-map annotation duties

`journey-annotations.json` is editorial input. `journey-map.json` and `journey-map.svg` are generated outputs and must not be hand-edited.

For every canonical ledger track, maintain exactly one annotation keyed by Spotify URI with:

- `chapter`;
- `storyBand`;
- `status` — accepted, provisional, protected, or frozen;
- plain labels describing its role.

Rules:

- Every ledger URI must have an annotation.
- Remove an annotation when its track leaves the ledger, unless it remains as an external discussion candidate under `discussions`.
- Story height is ordinal editorial interpretation, not measured audio energy.
- BPM and duration remain separate measured data.
- Mark the protected opener, protected handoffs, protected ending, and frozen discussion regions accurately.
- Add newly approved tracks with provisional status unless positive listener evidence or an explicit rule supports protected status.
- When a listener discussion opens, freeze the exact current region without changing its ledger membership.
- When a discussion resolves, update or remove its map overlay in the same approved change set.

## Atomic editorial commit

- Do not write partial approved changes.
- Prepare complete contents first.
- Use one logical editorial commit when possible.
- Include `journey-annotations.json` in that logical change set whenever map state changes.
- Do not rerun earlier phases between file writes.
- Do not modify scout request or snapshot after audit.
- Publication-status and generated-map bot commits are separate.

Opening an `AWAITING CLARIFICATION` discussion may be persisted without changing the ledger. This is the only pre-approval editorial write allowed for a complaint.

## Relaxation-first persistence

- Never record mandatory A/B tests, rankings, or prescribed listening sessions.
- Clarifying questions belong in the conversation, not as user homework.
- `MANUAL ACTION` is technical only.
- Park alternatives when no approved action exists.

## Evidence persistence

Distinguish:

- **Measured evidence** — BPM, duration, identity, order, lawful audio measurements.
- **Craft convention** — sequencing guidance.
- **Listener report** — preserve wording closely.
- **Editorial interpretation** — proposed role, chapter, story band, and hypothesis.

Do not store speculative sonic claims as facts.

## Feedback record fields

For each discussion, store:

- subject track or transition;
- current ledger and Spotify state;
- exact user wording;
- original editorial role;
- affected region;
- clarification questions asked;
- shared diagnosis when reached;
- possible KEEP, MOVE, REPLACE, REMOVE options;
- every track affected by a proposed wider repair;
- approval state;
- final resolution and date.

## Required ledger columns

- `#`
- `Artist`
- `Track`
- `Spotify URI`
- `BPM`
- `Decision`
- `Structural role`
- `Added`

## Required run record

For a scouted run:

- Date and candidate snapshot `runId`
- Candidates, exact URIs, BPM, verdicts
- Evidence map
- Approved scope
- Placement and purpose
- Removal, replacement, or reorder rationale
- BPM trajectory
- Review state and resolution
- Journey-map annotation change
- Audit outcome
- Canonical order
- Editorial note

For an audited `NO GENUINE SCOUTING TARGET` run, record instead:

- date and no-target verdict;
- completed pre-audit checks;
- evidence showing why no target exists;
- preserved frozen/protected state;
- confirmation that Scout, snapshots, ledger, audio evidence, and live graph were untouched;
- Spotify reconciliation and editorial note.

GitHub is the persistent source of truth. The Librarian never publishes through a generative playlist tool, never invokes Scout after decisions are persisted, and never hand-edits generated map outputs.
