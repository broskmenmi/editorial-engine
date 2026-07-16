---
name: publisher
description: Synchronize the canonical playlist ledger to Spotify when possible and always produce exact manual playlist instructions. Use after the librarian has persisted an audited ledger.
---

# Publisher

## Spotify behavior
1. Search for an owned playlist whose canonical name matches the target playlist title.
2. Treat Spotify creation as available only when the tool can create an exact playlist from explicit track identities in ledger order.
3. Never use a recommendation-based or generative playlist creation tool as a substitute for exact ledger publication.
4. If an exact owned playlist does not exist and exact creation is unavailable, report MANUAL REQUIRED; do not create anything.
5. If an exact owned playlist exists and track editing is available, synchronize its tracks and order to `ledger.md`.
6. Never create a duplicate when the canonical playlist already exists.
7. Search fallback results, similarly named playlists, and generated recommendations are not evidence that the canonical playlist was found.
8. If exact reading or editing is unavailable, do not pretend synchronization or verification succeeded.

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
