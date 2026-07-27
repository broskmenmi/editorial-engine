---
name: evaluator
description: Evaluate playlist candidates against a playlist constitution and classify each as ADD, REVISIT, or REJECT, including their ability to repair known transition, attention, or storytelling defects. Use after scouting and before sequencing.
---

# Evaluator

Read the target playlist constitution, ledger, notes, rejected list, revisit queue, and accepted-track review queue.

## Evidence discipline

For every candidate, separate:

1. **Measured evidence** — BPM, duration, exact identity, position, and neighbour differences.
2. **Craft convention** — useful sequencing practice, not a universal law.
3. **Listener report** — direct user experience; highest authority for this personal playlist.
4. **Editorial interpretation** — the proposed role and predicted effect; a hypothesis until heard.

Never claim that Spotify metadata proves how a track sounds or feels. Never infer busyness, stress, hypnosis, space, steadiness, or emotional effect from BPM, artist, genre, title, label, or reputation alone.

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

## Verdicts
- **ADD** — clearly strengthens or repairs the playlist now, with no critical unresolved listening question.
- **REVISIT** — plausible fit, but a specific uncertainty remains.
- **REJECT** — weakens, dilutes, duplicates, or creates a transition, attention, or storytelling defect.

## Critical-role gate

Candidates proposed for opener, re-entry, important crest, main summit, decompression pivot, or closer require focused review.

If the only support is metadata and editorial prediction, and the unresolved question concerns how the track feels, default to **REVISIT** rather than ADD.

A critical-role candidate may become ADD when at least one of these exists:

- direct user listening evidence;
- reliable lawful audio analysis plus a clearly stated remaining uncertainty;
- prior documented listening evidence for the exact version in the relevant context.

Measurements may support the decision, but they never replace listener confirmation.

## Rules
1. Artist reputation is not evidence.
2. Reject functional duplication even when the track is individually strong.
3. Prefer continuity over isolated impact.
4. Active high-priority entries in `under-review.md` and known ledger defects take precedence over playlist expansion.
5. Every candidate must include verified BPM when reliable metadata is available.
6. Evaluate the candidate against both proposed neighbours, not in isolation.
7. A candidate that creates an adjacent difference above 7 BPM cannot be ADD without documented half-time/double-time equivalence or intentional-reset evidence.
8. In the opening three positions, prefer candidates that keep adjacent differences within 4 BPM.
9. Numeric compliance is necessary under the normal doctrine but never sufficient for approval.
10. Listener feedback overrides speculative metadata-based approval.
11. Feeling relieved because a track ends is strong evidence for UNDER REVIEW, repositioning, or replacement.
12. REVISIT must state what needs reassessment, who can resolve it, and under what condition it could become ADD.
13. REJECT must cite a constitution-level, transition-level, attention-level, or storytelling reason.
14. Use plain language in user-facing rationale; explain any specialist term immediately.

## Output per candidate
- Verdict
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
- Focused-review requirement
- Reassessment condition if REVISIT
- Rejection reason if REJECT
