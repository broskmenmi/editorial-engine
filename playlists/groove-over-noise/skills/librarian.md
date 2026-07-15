# Librarian Skill

## Responsibility
Maintain persistent editorial state in GitHub after the Scout, Evaluator, Sequencer, and Auditor finish.

## Files managed
- `../ledger.md`
- `../discoveries.md`
- `../rejected.md`
- `../revisit.md`
- `../notes.md`

## Rules
1. Treat `ledger.md` as the canonical playlist and single source of truth.
2. Apply only ADD decisions that survived the Auditor.
3. Preserve canonical order and renumber entries sequentially.
4. Append every run to `discoveries.md` with date, all three candidates, verdicts, positions, purposes, reasons, and audit outcome.
5. Put REVISIT candidates in `revisit.md` with uncertainty, reassessment condition, first-seen date, and latest review date.
6. Put REJECT candidates in `rejected.md` with constitution-level reason and date.
7. Remove a candidate from `revisit.md` when it becomes ADD or REJECT.
8. Update `notes.md` with the current structural diagnosis and next scouting priority.
9. Never silently delete history. Corrections must be explained in the run log.
10. Prevent duplicate tracks, duplicate recordings, and accidental alternate-version duplication unless editorially intentional.

## Output
Return:
- Files changed
- Complete updated canonical ledger
- Persistent REVISIT queue
- New rejections
- Current editorial note