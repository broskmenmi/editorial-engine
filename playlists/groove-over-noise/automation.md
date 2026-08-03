# GROOVE OVER NOISE — Automation Orchestrator

The GitHub repository is the persistent source of truth. Run one orchestrated workflow daily; do not create independent competing tasks.

## Target playlist directory

`playlists/groove-over-noise/`

## Read before every run or feedback action

1. `constitution.md`
2. `feedback-protocol.md`
3. `ledger.md`
4. `journey-annotations.json`
5. `journey-map-spec.md`
6. `discoveries.md`
7. `rejected.md`
8. `revisit.md`
9. `under-review.md`
10. `notes.md`
11. `spotify.json`
12. `spotify-status.json`
13. `journey-map.json` when present
14. repository-level `AGENTS.md`
15. the relevant skill packages under `.agents/skills/`

`feedback-protocol.md` overrides any conflicting complaint, repeated-skip, repair-first, or relaxation-first instruction.

## Two operating modes

### A. Scheduled or requested editorial run

Execute:

1. **Pre-audit** — calculate the adjacent BPM trajectory, map chapters and peaks, inspect active discussions, and identify objective defects.
2. **Scout** — return exactly three candidates with exact Spotify track URIs and verified BPM.
3. **Evaluator** — assign ADD, REVISIT, or REJECT.
4. **Sequencer** — place provisional additions or repairs.
5. **Auditor** — approve, veto, or revise.
6. **Librarian** — persist the approved state, including `journey-annotations.json` when the journey map changes.
7. **Publisher** — report from `spotify-status.json` and append the compact journey map.

An active `AWAITING CLARIFICATION` discussion freezes only its affected region. The run may continue elsewhere but must not scout into, edit, reorder, or publish changes to the frozen region.

### B. User complaint or question about an accepted track

Do **not** automatically run Scout → Publisher.

First classify the user's statement:

- **Explicit action:** “remove it,” “move it after X,” “replace it with Y,” or another exact command.
- **Complaint / exploration:** “I don't like it,” “too noisy,” “abrupt,” “too slow,” “I skip it,” “could it work somewhere else?” or uncertain wording.

For a complaint or exploration:

1. Freeze the affected region.
2. Keep `ledger.md` and Spotify unchanged.
3. Record the exact words in `under-review.md` as `AWAITING CLARIFICATION`.
4. Explain the track's original role in plain language.
5. Ask at most three short questions answerable from memory; do not assign listening or A/B homework.
6. Distinguish track, incoming transition, outgoing transition, placement, and broader style.
7. Summarize the shared diagnosis.
8. Propose KEEP, MOVE, REPLACE, or REMOVE.
9. If the repair affects any other track, list every affected track and obtain explicit approval before writing the ledger.

Do not reject, replace, move, remove, or resolve the complaint before this gate is complete unless the user's first message was an explicit action command.

## Clarifying questions

Choose only those needed:

- Is the problem mainly the first seconds, the whole track, or the transition from the previous track?
- Once the track settles, do you like the track itself?
- What changes too suddenly: speed, heaviness, rhythm, amount of sound, mood, or the feeling that another scene starts?
- Is the transition out also a problem?
- Should we try to preserve and move the track before considering removal?

Clarification is collaborative conversation, not quality-assurance homework.

## Scope-control rule

A complaint about one track authorizes no change by itself.

A repair is a **multi-track change** when it:

- adds a bridge;
- adds or removes a replacement;
- changes either neighbour;
- reorders a chapter;
- keeps a new substitute while restoring the complained-about track elsewhere.

Before a multi-track change, state the exact before-and-after sequence and ask for explicit approval.

## Candidate snapshot lifecycle

Candidate resolution is a pre-audit input, not a publication step.

- Write `scout-request.json` at most once per editorial run.
- Resolve it into `scout-data.json` at most once per `runId`.
- Freeze the exact three-candidate snapshot before evaluation.
- Evaluator, Sequencer, Auditor, and Librarian use the same snapshot.
- Do not rerun Scout after audit approval.
- Spotify publication never executes the Scout or modifies scout files.
- A new snapshot requires a new `runId` and a genuinely new run.

## Journey-map lifecycle

The visualization has a compact generated SVG and a Sites-ready detailed JSON model.

Inputs:

- `ledger.md`
- `journey-annotations.json`
- current listener-feedback state

Generated outputs:

- `journey-map.json`
- `journey-map.svg`

Rules:

- The story curve is ordinal editorial interpretation, not measured energy, mood, loudness, or waveform analysis.
- The BPM curve and duration axis are measured metadata and must remain visually separate.
- Every ledger ADD, MOVE, REPLACE, REMOVE, chapter change, protected state, provisional state, or frozen discussion must be reflected in `journey-annotations.json` in the same approved editorial change set.
- `.github/workflows/build-journey-map.yml` generates the derivative files through `apps/journey-map/`.
- Do not hand-edit generated `journey-map.json` or `journey-map.svg`.
- The detailed future ChatGPT Site will read `journey-map.json`; `sites-prompt.md` is the build brief.
- The Site is not deployed until ChatGPT Sites is available to the user. Do not create a temporary website that becomes a second source of truth.

Map currency check:

- Treat the map as current only when the ordered `journey-map.json.tracks[].uri` list exactly matches the current ledger URI order.
- If the map is pending, finish the editorial response normally and say `Journey map updating` after the editorial note. Do not fail the task.

## Runtime and delivery safety

- Do not restart completed phases.
- Do not poll the same status continuously.
- After the final editorial commit, read `spotify-status.json` and `journey-map.json` once after a bounded wait.
- If Spotify publication is still pending, report `PARTIAL — publication pending` and finish the response.
- If map generation is still pending, finish the response with `Journey map updating`.
- A secondary cache, map, or scout failure must not suppress the user-facing report after decisions are persisted.

## Relaxation-first rule

The workflow exists to reduce effort and stress.

- Never assign mandatory listening tests, rankings, or prescribed comparisons.
- Natural reactions during ordinary listening are sufficient evidence.
- Clarifying questions must be few, plain, and answerable from memory.
- Lack of confirmation is not a defect.
- An unresolved complaint freezes only its local region, not the whole playlist.
- `MANUAL ACTION` is reserved for unavoidable technical steps and never contains listening instructions.

## Evidence model

Every material claim must be classified internally as:

- **Measured evidence:** BPM, duration, exact identity, position, or lawful audio measurements.
- **Craft convention:** a useful sequencing practice, not a universal law.
- **Listener report:** the user's direct experience.
- **Editorial interpretation:** a proposed role such as re-entry, crest, summit, dissolution, or story height.

Rules:

- BPM screens and describes transitions; it does not prove they work.
- Never infer busyness, stress, spaciousness, hypnosis, emotional effect, or attention demand from metadata alone.
- Never claim to have listened to or waveform-analysed Spotify audio through the Web API.
- Use plain English in user-facing explanations.

## Accepted-track discussion states

- `AWAITING CLARIFICATION` — no playlist edits allowed in the affected region.
- `DIAGNOSIS AGREED` — the problem is jointly understood; options may be proposed.
- `APPROVED — KEEP`
- `APPROVED — MOVE`
- `APPROVED — REPLACE`
- `APPROVED — REMOVE`

Only an `APPROVED` state may change `ledger.md` or Spotify.

Repeated skipping, stress, and relief when a track ends are strong evidence, but they do not bypass clarification unless the user explicitly orders removal.

## Long-form storytelling architecture

The GROOVE OVER NOISE house style is:

`Arrival → Groove formation → Local crest → Partial release → Re-entry → Deeper crest → Partial release → Main summit → Long decompression → Dissolution`

Rules:

- Allow multiple local crests but one dominant summit.
- Later crests must reveal something new.
- Partial releases reduce pressure without returning to zero.
- Re-entry continues accumulated immersion rather than restarting.
- The main summit is not defined by BPM alone.
- Preserve the final decompression and dissolution.
- New waves normally enter before the final descent.
- If the listener's experience contradicts the planned story, the planned story loses.

Duration guidance:

- Under 60 minutes: one wave may be sufficient.
- 60–120 minutes: normally at least two waves.
- Two to three hours: normally three or four chapters.
- Beyond three hours: several chapters, one summit, substantial decompression.

## BPM and transition rules

- Record verified BPM when reliable metadata is available.
- Target adjacent differences of **0–4 BPM**.
- **5–7 BPM** requires explicit continuity evidence and Auditor approval.
- Above **7 BPM** is prohibited unless a documented half-time/double-time relationship or intentional reset preserves perceived pulse.
- The opening three tracks use the strictest standard.
- Decompression descends progressively.
- Avoid accidental tempo sawtoothing.
- Spotify Mix or crossfade cannot validate or excuse a defective transition.
- Numeric compliance is never sufficient certainty.

## Repair-first policy

Objective defects and clarified, approved listener complaints take priority over unrelated growth.

An unclarified complaint is not yet an approved repair instruction. Freeze its region and continue elsewhere if appropriate.

After diagnosis, choose the smallest approved repair that restores the journey. Audit the complete ledger after any change.

## Spotify publication

- Every ledger row must contain an exact `spotify:track:` URI.
- `.github/workflows/publish-spotify.yml` publishes through `apps/spotify-publisher/`.
- The publisher uses the persisted playlist ID in `spotify.json` and verifies exact order.
- Never use the ChatGPT Spotify connector for canonical playlist search, creation, editing, or publication.
- Never report COMPLETE unless `spotify-status.json` records exact read-back verification.

## Atomicity

- Read all source files before decisions.
- Do not update persistent editorial state before audit approval, except opening an `AWAITING CLARIFICATION` discussion without touching the ledger.
- Persist approved editorial changes as one logical commit when possible.
- Update `journey-annotations.json` in that same logical change set whenever the map's editorial state changes.
- The ledger row order always equals recommended listening order.
- Renumber after additions, removals, or reordering.
- GitHub remains authoritative when Spotify or the map is pending or failed.

## Required user-facing response for editorial runs

Use exactly five numbered sections:

1. `TODAY'S DECISIONS` — exactly three candidates; Verdict, Track — Artist, Position, Purpose, one-sentence Reason.
2. `LEDGER CHANGE` — only additions, removals, replacements, or reordering.
3. `SPOTIFY STATUS` — COMPLETE, PARTIAL, or MANUAL REQUIRED.
4. `MANUAL ACTION` — unavoidable technical steps only; omit otherwise.
5. `EDITORIAL NOTE` — one sentence.

Purpose: maximum eight words. Reason: maximum ten words. Do not print the full ledger unless asked. Only link the canonical playlist, the three candidate tracks, and the generated journey-map image.

Immediately after the one-sentence `EDITORIAL NOTE`, append the compact map without adding a sixth numbered section:

```markdown
![GROOVE OVER NOISE journey map](https://raw.githubusercontent.com/broskmenmi/editorial-engine/main/playlists/groove-over-noise/journey-map.svg)
```

When the map is not yet current, write `Journey map updating` instead of embedding a stale visualization.

The exact five-section format does not apply to the clarification conversation before an accepted-track change. During clarification, answer directly and ask the necessary short questions.

## Playback rule

Optimize for an ordered listening journey, not live beatmatching. Bodily pulse and attention continuity matter. Mention Spotify Mix only when directly relevant.
