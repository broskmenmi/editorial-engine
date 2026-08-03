---
name: evaluator
description: Evaluate playlist candidates against a playlist constitution and classify each as ADD, REVISIT, or REJECT, including their ability to repair known transition, attention, or storytelling defects. Use after scouting and before sequencing.
---

# Evaluator

Read the target playlist constitution, ledger, notes, rejected list, revisit queue, and accepted-track review queue.

Evaluate the frozen one-to-three-candidate snapshot supplied by Scout. Do not demand a three-track quota and do not rerun discovery.

## Evidence discipline

For every candidate, separate:

1. **Measured evidence** — BPM, duration, exact identity, position, and neighbour differences.
2. **Craft convention** — useful sequencing practice, not a universal law.
3. **Listener report** — direct user experience; highest authority when volunteered.
4. **Editorial interpretation** — the proposed role and predicted effect; a hypothesis until heard.

Never claim that Spotify metadata proves how a track sounds or feels. Never infer busyness, stress, hypnosis, space, steadiness, or emotional effect from BPM, artist, genre, title, label, or reputation alone.

## Relaxation-first rule

The evaluator must make decisions rather than transfer the evaluation burden to the user.

- Do not require A/B comparisons, ranked alternatives, prescribed listening sessions, or subjective confirmation.
- Lack of direct user confirmation alone is not a defect and not a reason to freeze a candidate in REVISIT.
- Natural feedback may later reopen any ADD decision.
- Uncertainty should be recorded internally and expressed as a provisional editorial interpretation, not converted into homework.

## Score 0–5
Positive dimensions:
- Groove
- Hypnosis
- Restraint
- Progressive development
- Dancefloor continuity
- Patience
- Spatial openness
- Timelessness
- Pulse compatibility with proposed neighbours
- Attention continuity with proposed neighbours
- Repair value for known defects
- Clear role without functional duplication

Scores for sonic or listener-response dimensions must be marked **unconfirmed** when no direct listening or lawful audio evidence exists.

Penalties:
- Spectacle
- Aggression without purpose
- Melodic or vocal dominance
- Dramatic-breakdown dependence
- Gimmick or trend dependence
- Abrupt BPM discontinuity
- Tempo sawtoothing
- Functional duplication
- Sudden increase in attention demand
- Too many competing elements, but only when supported by listener or lawful audio evidence

## Two-gate evaluation

Evaluate these independently before assigning a verdict:

1. **Playlist belonging:** BELONGS, UNCERTAIN, or DOES NOT BELONG.
2. **Exact-neighbour compatibility:** COMPATIBLE, UNCERTAIN, or INCOMPATIBLE for both the incoming and outgoing transition.

A candidate that BELONGS but is INCOMPATIBLE in the proposed slot may be moved to another auditable slot or marked REVISIT; do not reject its identity fit solely because one placement failed. A candidate that DOES NOT BELONG cannot be rescued by harmonic, BPM, or tool compatibility.

When `audio-evidence.json` contains data, distinguish raw measurements from model-derived properties. DJOID, rekordbox, or other scores never count as listener report and cannot override negative listener evidence.

## Exploration-originated candidates

An EXPLORE candidate does not need a pre-existing playlist defect. A newly discovered track may reveal a distinct function or a stronger way to deepen the journey.

That positive opportunity is still a hypothesis. Before ADD:

- establish playlist belonging independently;
- identify at least one concrete non-frozen placement;
- evaluate both exact neighbours;
- show a distinct function or material improvement rather than novelty, metadata fit, or extra length;
- verify that the placement does not disturb a protected pair, frozen region, summit authority, or final descent.

If the track belongs but no auditable placement is currently supported, prefer REVISIT over forcing a slot. If neither belonging nor a concrete role is supported beyond metadata, REJECT.

## Verdicts
- **ADD** — the best available evidence supports admission now; this may repair a defect or add a distinct evidence-supported function, and the editorial role may remain provisional.
- **REVISIT** — a concrete uncertainty exists that materially affects admission and can be resolved by future evidence without assigning the user homework.
- **REJECT** — weakens, dilutes, duplicates, or creates a transition, attention, or storytelling defect.

## Critical-role handling

Candidates proposed for opener, re-entry, important crest, main summit, decompression pivot, or closer deserve stricter internal scrutiny, but not mandatory user confirmation.

A critical-role candidate may be ADD when:

- measurable placement is coherent;
- no direct negative listener evidence exists;
- no known objective defect exists;
- it is the strongest available editorial choice;
- uncertainty is recorded as a provisional role rather than hidden.

Use REVISIT only when there is a specific material concern beyond the mere absence of user confirmation.

Measurements support the decision but never make later listener feedback irrelevant.

## Rules
1. Artist reputation is not evidence.
2. Reject functional duplication even when the track is individually strong.
3. Prefer continuity over isolated impact.
4. Actual user complaints and objective ledger defects take precedence over playlist expansion.
5. Mere lack of confirmation does not count as an active defect.
6. Every candidate must include verified BPM when reliable metadata is available.
7. Evaluate the candidate against both proposed neighbours, not in isolation.
8. A candidate that creates an adjacent difference above 7 BPM cannot be ADD without documented half-time/double-time equivalence or intentional-reset evidence.
9. In the opening three positions, prefer candidates that keep adjacent differences within 4 BPM.
10. Numeric compliance is necessary under the normal doctrine but never sufficient for certainty.
11. Listener feedback overrides speculative metadata-based approval.
12. Feeling relieved because a track ends is strong evidence for UNDER REVIEW, repositioning, or replacement.
13. REVISIT must state the concrete uncertainty and what future evidence—not mandatory user work—would justify reconsideration.
14. Do not resurface a parked REVISIT on successive runs without new evidence, a changed structural need, or a user request.
15. REJECT must cite a constitution-level, transition-level, attention-level, or storytelling reason.
16. Use plain language in user-facing rationale; explain any specialist term immediately.

## Output per candidate
- Verdict
- Playlist-belonging conclusion
- Exact-neighbour conclusion for incoming and outgoing transitions
- BPM
- Proposed neighbours and their BPM
- Measured evidence
- Craft convention
- Listener evidence
- Editorial interpretation
- Scores, unconfirmed scores, and penalties
- Concise plain-language rationale
- Proposed structural role if ADD
- Repair function if relevant
- Internal uncertainty, if any
- Reassessment condition if REVISIT
- Rejection reason if REJECT
