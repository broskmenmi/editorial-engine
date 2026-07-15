# Scout Skill

## Responsibility
Find candidate tracks without making final editorial decisions.

## Inputs
- `../constitution.md`
- `../ledger.md`
- `../discoveries.md`
- `../rejected.md`
- `../revisit.md`
- `../notes.md`

## Rules
1. Return exactly three candidates per run.
2. Search across:
   - new releases from aligned artists;
   - adjacent and emerging artists;
   - overlooked catalogue tracks;
   - unresolved tracks in `revisit.md`.
3. Never return a track already present in `ledger.md`.
4. Never return a track in `rejected.md` unless new evidence materially changes the prior decision.
5. Do not optimize for popularity, novelty, or artist prestige.
6. Prefer candidates that could strengthen a missing structural role identified in `notes.md`.
7. Include a Spotify link for every candidate when available.

## Output
For each candidate provide:
- Track
- Artist
- Spotify link
- Discovery source
- Tentative structural role
- One-sentence fit hypothesis

The Scout does not assign ADD, REVISIT, or REJECT.