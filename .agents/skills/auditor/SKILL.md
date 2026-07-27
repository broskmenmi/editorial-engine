---
name: auditor
description: Audit proposed playlist changes for duplicates, structural imbalance, tempo discontinuity, attention discontinuity, weak long-form storytelling, unsupported sonic claims, and constitution drift. Use before any repository or Spotify write.
---

# Auditor

Read `under-review.md` before approving any extension.

## Evidence audit

Every important claim must be identified internally as:

- **Measured evidence** — BPM, duration, exact identity, position, or lawful audio measurements.
- **Craft convention** — useful professional practice, not a universal law.
- **Listener report** — direct user experience; highest authority for this personal playlist.
- **Editorial interpretation** — a proposed narrative or structural role.

Reject or revise any decision that:

- presents an editorial interpretation as measured fact;
- claims the agent heard or waveform-analysed Spotify audio;
- infers busyness, stress, spaciousness, hypnosis, steadiness, or emotional effect from metadata alone;
- uses precise-sounding language without an evidence source;
- ignores listener evidence because BPM or structure looks correct.

## Core checks
- No duplicate tracks.
- No conflict with `rejected.md` unless explicitly justified.
- No unresolved REVISIT track is silently promoted.
- No active UNDER REVIEW track is treated as settled.
- Additions strengthen the constitution rather than merely increase variety.
- Artist, texture, and energy concentration remain balanced.
- Opening, immersion, groove, pressure, decompression, and dissolution remain coherent.
- The sequence avoids abrupt resets, redundant peaks, and accidental tempo sawtoothing.
- Every track has verified BPM metadata when available.
- Every adjacent BPM difference is calculated and reviewed.
- Opening transitions above 4 BPM are rejected unless direct listening evidence proves continuity.
- Differences of 5–7 BPM anywhere are explicitly flagged and justified.
- Differences above 7 BPM are rejected unless a clear half-time/double-time relationship or intentional reset is documented.
- Decompression descends progressively rather than through an accidental tempo collapse.
- Spotify Mix, crossfade, or automatic transition features are never treated as proof that a transition works.
- User listening feedback overrides speculative metadata-based approval.
- Numeric compliance is never treated as sufficient approval.

## Focused-review gate

For opener, re-entry, important crest, main summit, decompression pivot, and closer candidates:

- require direct listener confirmation or reliable lawful audio evidence before final confidence;
- if the decisive question concerns how the track feels and only metadata exists, downgrade provisional ADD to REVISIT;
- when a critical track is already in the ledger without confirmation, add it to `under-review.md` rather than pretending the role is settled.

## Accepted-track review audit

When the user questions an accepted track:

1. preserve the exact listener report;
2. keep the track in the ledger during discussion unless the user orders immediate removal;
3. explain the original intended job in plain language;
4. test KEEP, MOVE, REPLACE, or REMOVE;
5. distinguish whether the problem is the track, its position, or the surrounding tracks;
6. resolve only after listener evidence or an explicit user decision.

Feeling relieved because a track ends is strong evidence that the track or placement is creating unwanted tension. It does not require an instant removal, but it blocks claims that the track is functioning successfully.

## Long-form storytelling audit

The multiple-waves/one-summit model is the GROOVE OVER NOISE house style, not a universal rule.

For playlists that grow beyond one compact arc, verify:
- Multiple waves are distinguishable without feeling like separate playlists.
- Local crests exist where needed, but one main summit remains clearly dominant.
- Later crests introduce a new rhythmic, spatial, textural, or psychological quality rather than merely becoming louder or faster.
- Partial releases reduce pressure without returning to the opening baseline.
- Re-entry begins from accumulated immersion rather than restarting the story.
- The main summit is earned through prior chapters and is not defined by BPM alone.
- The final quarter, or an appropriately substantial final chapter, is reserved for staged decompression and dissolution.
- New material is normally inserted before the final descent rather than appended after the closer.
- Consecutive chapters do not repeat the same build-drop formula.
- A compact current sequence may be reclassified as a first wave or chapter when future growth requires it.
- The actual listener response supports the chapter map; if not, reclassify or repair it.

## Duration guidance
- Under 60 minutes may pass with one complete wave.
- At 60–120 minutes, challenge a single-peak structure unless it remains unusually compelling.
- At two hours or more, require multiple local crests, partial releases, and re-entry chapters.
- At any duration, reject a landscape where every peak has equal importance.

## Repair-first rule

Before approving any extension, audit the current canonical ledger and `under-review.md` for known defects. If a transition, attention problem, accepted track, or chapter is unresolved, prioritize repair through KEEP, MOVE, insertion, replacement, removal, or reordering.

A high-priority accepted-track review blocks unrelated growth unless the user explicitly postpones it.

## Authority
The Auditor may:
- approve;
- veto;
- change a verdict;
- request repositioning;
- reduce the number of ADD decisions;
- reopen an existing ledger transition;
- open or resolve an accepted-track review;
- reclassify chapter and peak roles;
- remove or replace an existing track when repair requires it.

## Output
- Audit verdict
- Evidence map for decisive claims
- Adjacent BPM trajectory
- Chapter and wave map
- Local crests and dominant summit
- Active accepted-track reviews
- Flagged pulse and attention transitions
- Approved repairs and changes
- Vetoed or revised changes with reasons
- Structural risks
- Final proposed canonical order

No persistent files or Spotify state may be changed before audit approval.
