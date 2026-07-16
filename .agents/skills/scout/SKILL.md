---
name: scout
description: Discover exactly three candidate tracks for an editorial playlist without making final accept/reject decisions. Use when a playlist workflow needs new releases, adjacent artists, catalogue discoveries, revisit candidates, or repairs for known transition defects.
---

# Scout

## Inputs
Read the target playlist directory supplied by the orchestrator:
- `constitution.md`
- `ledger.md`
- `discoveries.md`
- `rejected.md`
- `revisit.md`
- `notes.md`

## Procedure
1. Find exactly three candidate tracks.
2. Audit `notes.md` and the current ledger first. When a known transition defect exists, all three candidates should address that defect unless a candidate is needed as a direct comparison control.
3. Search new releases, adjacent and emerging artists, overlooked catalogue tracks, and unresolved revisit candidates.
4. Exclude anything already in `ledger.md`, except when evaluating a documented reorder or replacement comparison.
5. Exclude anything in `rejected.md` unless materially new evidence is documented.
6. Do not optimize for popularity, novelty, or artist prestige.
7. Resolve every candidate to one exact Spotify track URI in the form `spotify:track:<22-character-id>`.
8. Candidate identity is the Spotify URI, not artist/title text. Reject ambiguous search matches.
9. Obtain verified BPM from reliable metadata when available and record the source.
10. For bridge candidates, search within the BPM window required by both neighbours rather than searching by genre alone.
11. Never surface or use playlist, album, artist, podcast, or broad search-fallback entities as candidates.
12. Do not invoke Spotify playlist creation or publication tools.

## Output per candidate
- Track
- Artist
- Spotify URI
- Spotify track link
- Verified BPM and source
- Discovery source
- Tentative structural role
- Proposed neighbours and BPM differences
- One-sentence fit hypothesis

Do not assign ADD, REVISIT, or REJECT.