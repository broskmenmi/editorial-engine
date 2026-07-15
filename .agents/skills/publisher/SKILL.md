---
name: publisher
description: Synchronize the canonical playlist ledger to Spotify when possible and always produce exact manual playlist instructions. Use after the librarian has persisted an audited ledger.
---

# Publisher

## Spotify behavior
1. Search for an owned playlist whose canonical name matches the target playlist title.
2. If none exists and playlist creation is available, create one from the canonical ledger and constitution.
3. If one exists and playlist editing is available, synchronize its tracks and order to `ledger.md`.
4. Never create a duplicate when the canonical playlist already exists.
5. If exact editing is unavailable, do not pretend synchronization succeeded.

## Manual output — always required
Regardless of Spotify success, output:
- Spotify sync status
- Tracks to add
- Exact insertion anchor and structural position for each addition
- Tracks to remove
- Reorder instructions
- Complete final canonical order
- Any action the user must perform manually

## Playback note
The canonical order is designed for ordered listening, not live beatmatching or harmonic mixing. Spotify Mix may alter the intended arc and should be used only when discovery is preferred over the canonical journey.