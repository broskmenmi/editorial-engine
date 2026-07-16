---
name: scout
description: Discover exactly three candidate tracks for an editorial playlist without making final accept/reject decisions. Use when a playlist workflow needs new releases, adjacent artists, catalogue discoveries, or revisit candidates.
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
2. Search new releases, adjacent and emerging artists, overlooked catalogue tracks, and unresolved revisit candidates.
3. Exclude anything already in `ledger.md`.
4. Exclude anything in `rejected.md` unless materially new evidence is documented.
5. Prefer candidates that fill a structural need in `notes.md`.
6. Do not optimize for popularity, novelty, or artist prestige.
7. Resolve every candidate to one exact Spotify track URI in the form `spotify:track:<22-character-id>`.
8. Candidate identity is the Spotify URI, not artist/title text. Reject ambiguous search matches.
9. Never surface or use playlist, album, artist, podcast, or broad search-fallback entities as candidates.
10. Do not invoke Spotify playlist creation or publication tools.

## Output per candidate
- Track
- Artist
- Spotify URI
- Spotify track link
- Discovery source
- Tentative structural role
- One-sentence fit hypothesis

Do not assign ADD, REVISIT, or REJECT.
