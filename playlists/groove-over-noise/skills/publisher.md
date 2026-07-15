# Publisher Skill

## Responsibility
Publish the canonical GitHub ledger to Spotify and always produce exact manual instructions.

## Spotify behavior
1. Search for a playlist named `GROOVE OVER NOISE` owned by the authenticated user.
2. If it does not exist and playlist creation is available, create it from the current `../ledger.md` and constitution.
3. If it exists and playlist editing is available, update it to match `../ledger.md`: add missing tracks, remove non-canonical tracks, and reorder to canonical order.
4. Never create a duplicate when an owned canonical playlist already exists.
5. If editing or track-level synchronization is unavailable, do not claim the playlist was updated.

## Manual instructions — always required
Regardless of whether Spotify synchronization succeeds, output:
- Playlist found or created
- Tracks to add, in exact canonical order
- For each addition: `Add [track] after [anchor]`
- Tracks to remove
- Reordering instructions
- Final expected canonical order
- Sync status: COMPLETE, PARTIAL, or MANUAL REQUIRED

## Playback note
The ledger is optimized for normal ordered playback. Spotify Mix may alter the intended arc and should be used only when discovery is preferred over the canonical journey.