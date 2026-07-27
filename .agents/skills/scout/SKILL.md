---
name: scout
description: Discover exactly three candidate tracks for an editorial playlist without making final accept/reject decisions. Use when a playlist workflow needs new releases, adjacent artists, catalogue discoveries, revisit candidates, accepted-track comparisons, or repairs for known defects.
---

# Scout

## Inputs
Read the target playlist directory supplied by the orchestrator:
- `constitution.md`
- `ledger.md`
- `discoveries.md`
- `rejected.md`
- `revisit.md`
- `under-review.md`
- `notes.md`

## Procedure
1. Find exactly three candidate tracks.
2. Audit `under-review.md`, `notes.md`, and the current ledger first. Active high-priority accepted-track reviews and known defects take precedence over expansion.
3. When a user complaint or accepted-track review exists, search for direct comparison, repositioning, or replacement options for that exact role. Do not broaden the search into unrelated playlist growth.
4. When no new listener evidence exists for an active review, prefer reusing documented comparison candidates over spending the run on speculative broad discovery.
5. Search new releases, adjacent and emerging artists, overlooked catalogue tracks, and unresolved revisit candidates only after review and repair priorities are satisfied.
6. Exclude anything already in `ledger.md`, except when an accepted track is intentionally used as a KEEP or MOVE comparison control.
7. Exclude anything in `rejected.md` unless materially new evidence is documented.
8. Do not optimize for popularity, novelty, or artist prestige.
9. Resolve every candidate to one exact Spotify track URI in the form `spotify:track:<22-character-id>`.
10. Candidate identity is the Spotify URI, not artist/title text. Reject ambiguous search matches.
11. Obtain verified BPM from reliable metadata when available and record the source.
12. For bridge candidates, search within the BPM window required by both neighbours rather than searching by genre alone.
13. Never infer busyness, stress, spaciousness, hypnosis, steadiness, emotional effect, or attention demand from BPM, artist, genre, title, label, reputation, or search snippets alone.
14. If no lawful direct listening or audio evidence is available, label every sonic description as a **fit hypothesis**, not an observed fact.
15. For opener, re-entry, important crest, main summit, decompression pivot, or closer candidates, explicitly flag the need for focused listener confirmation.
16. Never surface or use playlist, album, artist, podcast, or broad search-fallback entities as candidates.
17. Do not invoke Spotify playlist creation or publication tools.

## Evidence fields per candidate
- **Measured evidence:** exact identity, BPM, duration when available, and neighbour differences.
- **Craft convention:** why the position is plausible as sequencing practice.
- **Listener evidence:** any direct user reaction relevant to the role.
- **Editorial hypothesis:** the proposed job and what must be confirmed by listening.

## Output per candidate
- Track
- Artist
- Spotify URI
- Spotify track link
- Verified BPM and source
- Discovery source
- Tentative structural role
- Proposed neighbours and BPM differences
- Evidence fields
- One-sentence fit hypothesis
- Focused-review requirement when applicable

Do not assign ADD, REVISIT, or REJECT.
