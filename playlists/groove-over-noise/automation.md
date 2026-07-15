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
7. repository-level `AGENTS.md`
8. the relevant skill packages under `.agents/skills/`

## Execution order

1. **Scout** — use `.agents/skills/scout/SKILL.md`; return exactly three candidates.
2. **Evaluator** — use `.agents/skills/evaluator/SKILL.md`; assign ADD, REVISIT, or REJECT.
3. **Sequencer** — use `.agents/skills/sequencer/SKILL.md`; place every provisional ADD.
4. **Auditor** — use `.agents/skills/auditor/SKILL.md`; approve, downgrade, reject, or reposition.
5. **Librarian** — use `.agents/skills/librarian/SKILL.md`; update persistent GitHub state only after audit.
6. **Publisher** — use `.agents/skills/publisher/SKILL.md`; find or create the Spotify playlist, update it when supported, and always produce manual instructions.

## Atomicity

- Read all source files before making decisions.
- Do not update `ledger.md` until the Auditor approves the final change set.
- GitHub updates define the authoritative outcome even when Spotify synchronization fails.
- Never create a duplicate Spotify playlist when an owned canonical playlist already exists.

## Required daily response

1. Three candidates and verdicts.
2. Position, Purpose, and Reason for every ADD.
3. Reassessment condition for every REVISIT.
4. Rejection reason for every REJECT.
5. Audit result.
6. Files updated in GitHub.
7. Complete canonical ledger.
8. Spotify synchronization status.
9. Exact manual add/remove/reorder instructions, even if Spotify synchronization succeeded.
10. One Editorial note.

## Playback rule

Optimize for a curated listening journey, not a live DJ set. Do not assume beatmatching or harmonic mixing. Spotify Mix may alter the intended sequence and should be used only when discovery is preferred over the canonical journey.