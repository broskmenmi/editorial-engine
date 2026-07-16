# GROOVE OVER NOISE — Automation Orchestrator

The GitHub repository is the persistent source of truth. Run one orchestrated workflow daily; do not create independent competing tasks.

## Target playlist directory

`playlists/groove-over-noise/`

## Read before every run

1. `constitution.md`
2. `ledger.md`
3. `discoveries.md`
4. `rejected.md`
5. `revisit.md`
6. `notes.md`
7. `spotify.json`
8. `spotify-status.json`
9. repository-level `AGENTS.md`
10. the relevant skill packages under `.agents/skills/`

These paths remain the normal ChatGPT discovery paths. Do not relocate or duplicate the instruction files.

## Execution order

1. **Pre-audit** — calculate the complete adjacent BPM trajectory and identify unresolved transition defects before scouting.
2. **Scout** — use `.agents/skills/scout/SKILL.md`; return exactly three track candidates with exact Spotify track URIs and verified BPM.
3. **Evaluator** — use `.agents/skills/evaluator/SKILL.md`; assign ADD, REVISIT, or REJECT.
4. **Sequencer** — use `.agents/skills/sequencer/SKILL.md`; place every provisional ADD or proposed repair.
5. **Auditor** — use `.agents/skills/auditor/SKILL.md`; approve, downgrade, reject, reposition, remove, replace, or reorder.
6. **Librarian** — use `.agents/skills/librarian/SKILL.md`; update persistent GitHub state only after audit.
7. **Publisher** — use `.agents/skills/publisher/SKILL.md`; report status from `spotify-status.json` after the GitHub Action publisher runs.

## Transition and BPM rules

- Every ledger row must contain verified BPM when reliable metadata is available.
- Target adjacent BPM difference: **0–4 BPM**.
- **5–7 BPM** requires explicit pulse-continuity evidence and Auditor approval.
- Above **7 BPM** is prohibited unless a documented half-time/double-time relationship or intentional reset makes the perceived pulse continuous.
- The first three tracks may not exceed **4 BPM** between neighbours without direct listening evidence.
- A decompression may descend in BPM, but it must descend progressively rather than collapse abruptly.
- Avoid tempo sawtoothing: repeated rise-fall-rise movement is a sequence defect.
- Spotify Mix, crossfade, and automatic transition processing cannot validate or excuse a defective transition.
- If the user still hears a jump with Spotify Mix enabled, record the transition as defective.
- User listening feedback is direct evidence and overrides speculative approval based on metadata.

## Repair-first policy

- Known transition defects take priority over new playlist growth.
- When a defect exists, candidates must repair it through a bridge, replacement, removal, or reorder.
- Do not add tracks elsewhere while leaving the known defect untouched.
- Choose the smallest repair that produces a coherent BPM trajectory and preserves the editorial arc.
- After every repair, audit the entire ledger rather than only the changed pair.

## Spotify publication architecture

- The canonical ledger must contain an exact `spotify:track:` URI for every row.
- A ledger commit triggers `.github/workflows/publish-spotify.yml`.
- The workflow runs `apps/spotify-publisher/`, uses the persisted playlist ID in `spotify.json`, replaces all playlist items, then verifies the exact URI order.
- Never use the ChatGPT Spotify connector to search for, create, edit, or publish the canonical playlist.
- Never surface unrelated playlists, similarly named results, or broad search fallbacks.
- Never report COMPLETE unless `spotify-status.json` records exact read-back verification for the current ledger publication.

## Atomicity

- Read all source files before making decisions.
- Do not update `ledger.md` until the Auditor approves the final change set.
- The row order in `ledger.md` must always equal the recommended final listening order.
- Insert every approved ADD at its exact sequenced position, then renumber the full ledger consecutively.
- Every approved ADD must have one verified Spotify track URI and BPM.
- When an approved change alters surrounding flow, reorder those existing tracks in the same ledger update.
- GitHub updates define the authoritative editorial outcome even when Spotify publication is pending or failed.

## Required user-facing response

Use exactly these sections:

1. `TODAY'S DECISIONS` — exactly three candidates; for each show Verdict, Track — Artist, Position, Purpose, and one-sentence Reason.
2. `LEDGER CHANGE` — list only additions, removals, replacements, or reordering made today.
3. `SPOTIFY STATUS` — one of COMPLETE, PARTIAL, or MANUAL REQUIRED, based only on `spotify-status.json`.
4. `MANUAL ACTION` — only exact user steps; omit entirely when none are needed.
5. `EDITORIAL NOTE` — one sentence.

Purpose must be maximum eight words. Reason must be one sentence, maximum ten words. Do not print the full canonical ledger unless explicitly requested. Do not include internal GitHub operations, audit details, scoring tables, or long explanations.

Only link:
- the canonical playlist URL stored in `spotify-status.json`; and
- the three candidate tracks.

## Playback rule

Optimize for a curated listening journey, not a live DJ set. Beatmatching is not required, but bodily pulse continuity is. Mention Spotify Mix only when directly relevant.