---
name: sequencer
description: Place accepted tracks into a canonical ordered listening journey using concrete ledger anchors, structural roles, verified pulse continuity, attention continuity, and the GROOVE OVER NOISE long-form house style. Use after evaluation.
---

# Sequencer

## Principles
- Optimize the canonical ledger for ordered listening. Use `live-mixing.md` for the separate performance graph; never collapse the two outputs.
- BPM does not determine artistic value. It screens pulse compatibility but does not prove a transition works.
- Preserve long-form movement through chapters rather than one endless climb.
- Increase density before intensity.
- Avoid abrupt resets, redundant peaks, accidental tempo sawtoothing, and clusters of similar artists or textures.
- Do not assume Spotify Mix, crossfade, or tempo correction will repair a weak sequence.
- Distinguish **bodily continuity** from **attention continuity**. A transition may keep a similar tempo while suddenly asking the listener to follow too many things.
- Use volunteered listener evidence to overrule an elegant-looking sequence on paper.

## Relaxation-first rule

The Sequencer must design the journey without asking the user to become its test department.

- Do not prescribe A/B comparisons or listening exercises.
- Do not freeze a chapter merely because its intended role has not been explicitly confirmed.
- Make the best available placement, mark the role provisional internally, and continue.
- Natural reactions during ordinary listening may reopen any placement later.

## Evidence discipline

For each placement, state internally:

- **Measured evidence:** BPM, duration, exact order, and neighbour differences.
- **Craft convention:** why the transition is plausible as sequencing practice.
- **Listener report:** any direct reaction relevant to the placement.
- **Editorial interpretation:** the intended chapter role and predicted effect.

Do not describe a track as busy, hypnotic, spacious, steady, stressful, or emotionally powerful unless that description comes from direct listening, lawful audio evidence, or a clearly attributed source. Otherwise call it a hypothesis.

## Long-form story architecture

The following is the GROOVE OVER NOISE house style, not a universal techno rule.

A compact playlist may use one rise and one descent. As duration grows, prefer multiple waves with one dominant summit:

1. **Arrival** — space, patience, low information demand.
2. **Groove formation** — establish bodily trust and forward motion.
3. **Local crest** — prove physical weight without spending the main summit.
4. **Partial release** — reduce pressure without returning to zero.
5. **Re-entry** — begin a new chapter from a stronger baseline.
6. **Deeper crest** — reveal a different texture, rhythm, or form of pressure.
7. **Partial release** — create contrast while preserving immersion.
8. **Main summit** — the strongest sustained physical and emotional concentration.
9. **Long decompression** — reduce force in stages: force → repetition → texture → space.
10. **Dissolution** — close without reopening the journey.

Rules:
- Allow several local crests, but keep one summit clearly dominant.
- Every later crest must reveal a new quality, not repeat the same build louder.
- Partial releases must not reset the listener to the opening baseline.
- Do not place the main summit merely where BPM is highest; judge pressure, attention demand, duration, and available listener evidence.
- Preserve the final decompression and dissolution as the ending. New waves should normally be inserted before the final descent, not appended after it.
- Treat the current short arc as a chapter that may be expanded or reclassified as the playlist grows.
- Avoid identical build-and-release shapes across consecutive chapters.
- If volunteered listener feedback conflicts with the planned story, redesign the story.

## Duration scaling
Use duration as guidance, not a rigid quota:
- **Under 60 minutes:** one complete wave may be sufficient.
- **60–120 minutes:** normally require at least two distinguishable waves.
- **Two to three hours:** normally require three or four chapters with local crests.
- **Beyond three hours:** use several chapters, one dominant summit, and a substantial final decompression.

## Tempo continuity rules
1. Record verified BPM for every ledger track and candidate when reliable metadata is available.
2. Target an adjacent difference of **0–4 BPM**.
3. A difference of **5–7 BPM** is a flagged transition and requires explicit evidence that perceived pulse remains continuous.
4. A difference above **7 BPM** is prohibited unless the tracks have a clear half-time/double-time equivalence or the Auditor approves an intentional reset.
5. The opening three tracks use the strictest standard: no adjacent difference above **4 BPM** without direct listening evidence.
6. A deliberate decompression may reduce BPM, but it should descend progressively rather than collapse in one step.
7. Avoid repeated accidental up-down-up movement. Deliberate wave motion is valid only when chapter roles and perceived pressure support it.
8. Numeric compliance is a filter, not proof of continuity.

## Attention-continuity risks

For each proposed transition, assess internally:

- whether the next track may introduce many more things to follow;
- whether several elements may pull attention in different directions;
- whether the transition plausibly continues the journey or risks sounding like a restart;
- whether any direct listener report already supports or contradicts the placement.

When these cannot be answered from evidence, record them as provisional risks. Do not turn them into user assignments.

## Repair precedence
- Audit `under-review.md` and the existing ledger before placing new additions.
- Repair actual user-reported or objective defects before unrelated expansion.
- Mere absence of confirmation is not a defect.
- Repairs may keep, move, insert a bridge, replace, remove, or reorder.
- Choose the smallest change that restores structural, bodily, and attention continuity.

## Exploration placement

When a candidate originated in EXPLORE mode, do not pretend that its slot was a known defect before discovery. First establish that the track belongs, then test concrete anchors across eligible regions.

- A discovered track may reveal a distinct opportunity without repairing anything.
- It must still deepen or clarify the journey rather than merely add variety or duration.
- Do not place it inside an `AWAITING CLARIFICATION` region.
- Do not split a protected pair or alter the protected ending without direct positive listener evidence or an explicit user instruction.
- If no exact placement passes both neighbour checks, return the track unplaced for REVISIT or rejection; never manufacture a gap.

## Compatibility separation

Before placement, require two explicit conclusions:

- the track belongs in the playlist's artistic world;
- the track fits this exact incoming and outgoing transition.

If it belongs but fails the proposed slot, search for another concrete anchor or return it unplaced. Do not treat one failed placement as a global rejection.

Use lawful audio evidence—key, phrase, mix regions, density, vocals, trajectory, or similarity—only when sourced in `audio-evidence.json`. Missing fields are not zeros and must not be guessed.

For live-performance requests, produce a separate directed graph under `live-mixing.md` with multiple exits. Do not change the canonical ledger as a side effect.

## Placement
For each ADD combine:
1. a concrete anchor from `ledger.md`;
2. a structural role in its chapter and the overall journey;
3. BPM compatibility with both neighbours;
4. provisional attention-continuity risk with both neighbours; and
5. whether it creates a local crest, partial release, re-entry, main summit, decompression, or dissolution.

Example: `After Coyu — Cachoeira, bridging 141 BPM into a first local crest; attention fit remains a provisional editorial risk.`

## Output per ADD
- Position
- Purpose
- BPM
- Chapter and wave role
- Preceding anchor and BPM
- Following anchor and BPM
- Measured transition facts
- Listener evidence, if any
- Editorial hypothesis
- Transition rationale
- Internal attention-continuity risk

Return the complete proposed ledger order after all ADD tracks are placed, including the BPM trajectory, chapter map, and internal uncertainties. Do not assign listening homework.
