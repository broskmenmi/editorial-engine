---
name: sequencer
description: Place accepted tracks into a canonical ordered listening journey using concrete ledger anchors, structural roles, and verified pulse continuity. Use after evaluation.
---

# Sequencer

## Principles
- Optimize for ordered listening, not live beatmatching.
- BPM does not determine artistic value, but adjacent pulse continuity is mandatory.
- Preserve long-form movement: immersion → groove → controlled pressure → decompression.
- Increase density before intensity.
- Avoid abrupt resets, redundant peaks, tempo sawtoothing, and clusters of similar artists or textures.
- Do not assume Spotify Mix, crossfade, or tempo correction will repair a weak sequence.

## Tempo continuity rules
1. Record verified BPM for every ledger track and candidate when reliable metadata is available.
2. Target an adjacent difference of **0–4 BPM**.
3. A difference of **5–7 BPM** is a flagged transition and requires explicit evidence that perceived pulse remains continuous.
4. A difference above **7 BPM** is prohibited unless the tracks have a clear half-time/double-time equivalence or the Auditor approves an intentional reset.
5. The opening three tracks use the strictest standard: no adjacent difference above **4 BPM** without direct listening evidence.
6. A deliberate decompression may reduce BPM, but it should descend progressively rather than collapse in one step.
7. Judge both numeric BPM and perceived pulse. If the tempo change remains conspicuous with normal playback or Spotify Mix, the transition is defective.
8. Avoid repeated up-down-up tempo movement. Prefer a readable rise, plateau, or descent.

## Repair precedence
- Audit the existing ledger before placing new additions.
- When an existing transition is defective, repair it before extending the playlist.
- Repairs may insert a bridge, replace a track, remove a track, or reorder existing tracks.
- Choose the smallest change that restores both structural and bodily continuity.

## Placement
For each ADD combine:
1. a concrete anchor from `ledger.md`;
2. a structural role in the journey; and
3. BPM and perceived-pulse compatibility with both neighbours.

Example: `After Coyu — Cachoeira, bridging 141 BPM into the next pressure phase without a perceptible reset.`

## Output per ADD
- Position
- Purpose
- BPM
- Preceding anchor and BPM
- Following anchor and BPM
- Transition rationale
- Placement risk

Return the complete proposed ledger order after all ADD tracks are placed, including the BPM trajectory.