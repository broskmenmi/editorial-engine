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

1. **Scout** — use `.agents/skills/scout/SKILL.md`; return exactly three track candidates with exact Spotify track URIs.
2. **Evaluator** — use `.agents/skills/evaluator/SKILL.md`; assign ADD, REVISIT, or REJECT.
3. **Sequencer** — use `.agents/skills/sequencer/SKILL.md`; place every provisional ADD.
4. **Auditor** — use `.agents/skills/auditor/SKILL.md`; approve, downgrade, reject, or reposition.
5. **Librarian** — use `.agents/skills/librarian/SKILL.md`; update persistent GitHub state only after audit.
6. **Publisher** — use `.agents/skills/publisher/SKILL.md`; report status from `spotify-status.json` after the GitHub Action publisher runs.

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
- Every approved ADD must have one verified Spotify track URI.
- When an approved change alters surrounding flow, reorder those existing tracks in the same ledger update.
- GitHub updates define the authoritative editorial outcome even when Spotify publication is pending or failed.

## Required user-facing response

Use exactly these sections:

1. `TODAY'S DECISIONS` — exactly three candidates; for each show Verdict, Track — Artist, Position, Purpose, and one-sentence Reason.
2. `LEDGER CHANGE` — list only additions, removals, or reordering made today.
3. `SPOTIFY STATUS` — one of COMPLETE, PARTIAL, or MANUAL REQUIRED, based only on `spotify-status.json`.
4. `MANUAL ACTION` — only exact user steps; omit entirely when none are needed.
5. `EDITORIAL NOTE` — one sentence.

Purpose must be maximum eight words. Reason must be one sentence, maximum ten words. Do not print the full canonical ledger unless explicitly requested. Do not include internal GitHub operations, audit details, scoring tables, or long explanations.

Only link:
- the canonical playlist URL stored in `spotify-status.json`; and
- the three candidate tracks.

## Playback rule

Optimize for a curated listening journey, not a live DJ set. Do not assume beatmatching or harmonic mixing. Mention Spotify Mix only when directly relevant.
