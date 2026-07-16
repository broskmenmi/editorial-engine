---
name: evaluator
description: Evaluate playlist candidates against a playlist constitution and classify each as ADD, REVISIT, or REJECT, including their ability to repair known transition defects. Use after scouting and before sequencing.
---

# Evaluator

Read the target playlist constitution, ledger, notes, rejected list, and revisit queue.

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
- Repair value for known transition defects

Penalties:
- Spectacle
- Aggression without purpose
- Melodic or vocal dominance
- Dramatic-breakdown dependence
- Gimmick or trend dependence
- Abrupt BPM discontinuity
- Tempo sawtoothing
- Functional duplication

## Verdicts
- **ADD** — clearly strengthens or repairs the playlist now.
- **REVISIT** — plausible fit, but a specific uncertainty remains.
- **REJECT** — weakens, dilutes, or creates a transition defect.

## Rules
1. Artist reputation is not evidence.
2. Reject functional duplication even when the track is individually strong.
3. Prefer continuity over isolated impact.
4. Known ledger defects take precedence over playlist expansion.
5. Every candidate must include verified BPM when reliable metadata is available.
6. Evaluate the candidate against both proposed neighbours, not in isolation.
7. A candidate that creates an adjacent difference above 7 BPM cannot be ADD without documented half-time/double-time equivalence or intentional-reset evidence.
8. In the opening three positions, prefer candidates that keep adjacent differences within 4 BPM.
9. REVISIT must state what needs reassessment and under what condition it could become ADD.
10. REJECT must cite a constitution-level or transition-level reason.

## Output per candidate
- Verdict
- BPM
- Proposed neighbours and their BPM
- Scores and penalties
- Concise rationale
- Proposed structural role if ADD
- Repair function if relevant
- Reassessment condition if REVISIT
- Rejection reason if REJECT