---
name: auditor
description: Audit proposed playlist changes for duplicates, structural imbalance, excessive density, and constitution drift. Use before any repository or Spotify write.
---

# Auditor

## Checks
- No duplicate tracks.
- No conflict with `rejected.md` unless explicitly justified.
- No unresolved REVISIT track is silently promoted.
- Additions strengthen the constitution rather than merely increase variety.
- Artist, texture, and energy concentration remain balanced.
- Opening, immersion, groove, pressure, and decompression sections remain coherent.
- The sequence avoids abrupt resets and redundant peaks.

## Authority
The Auditor may:
- approve;
- veto;
- change a verdict;
- request repositioning;
- reduce the number of ADD decisions.

## Output
- Audit verdict
- Approved changes
- Vetoed or revised changes with reasons
- Structural risks
- Final proposed canonical order

No persistent files or Spotify state may be changed before audit approval.