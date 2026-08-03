---
name: scout
description: Discover exactly three candidate tracks for a genuine editorial target without making final accept/reject decisions. Use only after pre-audit establishes a real need such as a defect, triggered revisit, new evidence, or distinct structural opportunity.
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

## Relaxation-first rule

The Scout must find music without turning the user into a tester.

- Never assign A/B comparisons, ranking exercises, or prescribed listening sessions.
- Do not resurface PARKED REVISIT candidates without new evidence, a changed structural need, or a user request.
- Do not treat missing user confirmation as an accepted-track defect.
- Natural feedback volunteered during ordinary listening is enough; the Scout should continue working without waiting for it.

## Search intent

Before searching, label the need as one of:

- **BELONGING** — find tracks that could belong somewhere in the playlist's world.
- **NEIGHBOUR** — find tracks for one exact incoming/outgoing transition.
- **BOTH** — the candidate must satisfy the identity and a concrete slot.

Do not use a neighbour score as proof of playlist belonging. Do not reject a track from the playlist identity merely because one placement fails.

Read `audio-evidence.md` and `audio-evidence.json` when present. Tool-derived evidence may narrow or rank the search, but unknown measurements stay unknown and no tool score decides admission.

## Entry gate

Scout must not run merely because the workflow is scheduled. The orchestrator must supply a genuine target established by pre-audit. If none exists, return control without candidates or snapshot creation; do not invent a bridge, replacement, or expansion question.

## Procedure
1. For the supplied genuine target, find exactly three candidate tracks.
2. Audit `under-review.md`, `notes.md`, and the current ledger first. Actual user complaints and known objective defects take precedence over expansion.
3. When a genuine accepted-track review exists, search for repositioning or replacement options for that exact role without assigning the user comparison work.
4. When no new evidence exists for a review, make a best-effort repair recommendation or leave the track provisionally accepted; do not repeat the same comparison indefinitely.
5. Search new releases, adjacent and emerging artists, overlooked catalogue tracks, and eligible unresolved revisit candidates after actual repair priorities are satisfied.
6. Ignore PARKED REVISIT entries unless their documented trigger has occurred.
7. Exclude anything already in `ledger.md`, except when an accepted track is intentionally used as a KEEP or MOVE control in internal reasoning.
8. Exclude anything in `rejected.md` unless materially new evidence is documented.
9. Do not optimize for popularity, novelty, or artist prestige.
10. Resolve every candidate to one exact Spotify track URI in the form `spotify:track:<22-character-id>`.
11. Candidate identity is the Spotify URI, not artist/title text. Reject ambiguous search matches.
12. Obtain verified BPM from reliable metadata when available and record the source.
13. For bridge candidates, search within the BPM window required by both neighbours rather than searching by genre alone.
14. Never infer busyness, stress, spaciousness, hypnosis, steadiness, emotional effect, or attention demand from BPM, artist, genre, title, label, reputation, or search snippets alone.
15. If no lawful direct listening or audio evidence is available, label every sonic description as a **fit hypothesis**, not an observed fact.
16. For opener, re-entry, important crest, main summit, decompression pivot, or closer candidates, flag internal uncertainty but do not require listener confirmation.
17. Never surface or use playlist, album, artist, podcast, or broad search-fallback entities as candidates.
18. Do not invoke Spotify playlist creation or publication tools.

## Evidence fields per candidate
- **Search intent:** BELONGING, NEIGHBOUR, or BOTH.
- **Playlist-belonging hypothesis:** belongs, uncertain, or does not belong, with reasons.
- **Exact-neighbour hypothesis:** compatible, uncertain, or incompatible for the proposed incoming and outgoing transitions.
- **Measured evidence:** exact identity, BPM, duration when available, neighbour differences, and sourced lawful audio measurements.
- **Craft convention:** why the position is plausible as sequencing practice.
- **Listener evidence:** any direct user reaction relevant to the role.
- **Editorial hypothesis:** the proposed job and remaining internal uncertainty.

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
- Internal uncertainty when applicable

Do not assign ADD, REVISIT, or REJECT.
