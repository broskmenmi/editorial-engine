# GROOVE OVER NOISE — Automation Orchestrator

The GitHub repository is the persistent source of truth. Run one orchestrated workflow daily; do not create independent competing tasks.

## Target playlist directory

`playlists/groove-over-noise/`

## Read before every run or feedback action

1. `constitution.md`
2. `feedback-protocol.md`
3. `audio-evidence.md`
4. `audio-evidence.json`
5. `live-mixing.md`
6. `ledger.md`
7. `journey-annotations.json`
8. `journey-map-spec.md`
9. `discoveries.md`
10. `rejected.md`
11. `revisit.md`
12. `under-review.md`
13. `notes.md`
14. `spotify.json`
15. `spotify-status.json`
16. `journey-map.json` when present
17. repository-level `AGENTS.md`
18. the relevant skill packages under `.agents/skills/`

`feedback-protocol.md` overrides any conflicting complaint, repeated-skip, repair-first, or relaxation-first instruction.

## Two operating modes

### A. Scheduled or requested editorial run

Execute:

1. **Pre-audit and lane selection** — calculate the adjacent BPM trajectory, map chapters and peaks, inspect active discussions, revisit triggers, recent decisions, and `audio-evidence.json`. Select the repair lane only for an actionable objective defect, triggered REVISIT, clarified and authorized listener repair, or materially new lawful evidence that makes a specific existing repair or revisit actionable. Other new evidence remains an EXPLORE input. Missing audio evidence is not a defect.
2. **Repair lane** — when an actionable repair exists, Scout one to three evidence-qualified candidates for the highest-priority target. An exact authorized move, removal, reorder, or replacement with an already agreed and resolved track that needs no candidate search may proceed directly to Sequencer.
3. **Exploration lane** — when no actionable repair exists, Scout must perform a fresh outward discovery scan during this run. Search current releases, adjacent or emerging artists and labels, and overlooked catalogue material. A pre-existing gap is not required: discovery may reveal a distinct opportunity. Rereading unchanged repository state, reusing an old candidate snapshot, or reconsidering old candidates without new evidence does not count.
4. **Scout result** — apply Scout's objective shortlist floor, select the strongest one to three eligible candidates, resolve exact Spotify track URIs and verified BPM when available, and never pad a weak set. Record scan timestamp, source paths or query windows, inspected scope, exclusions, and shortlist. If EXPLORE finds none, return `EXPLORATION COMPLETE — NO QUALIFIED CANDIDATES`. If REPAIR finds none, return `REPAIR SEARCH COMPLETE — NO QUALIFIED CANDIDATES`. If the required search did not run or was blocked, return `EXPLORATION NOT COMPLETED` or `REPAIR SEARCH NOT COMPLETED`; never misreport that as playlist completeness or repair exhaustion.
5. **Evaluator** — answer playlist belonging and exact-neighbour compatibility separately, then assign ADD, REVISIT, or REJECT. Exploration candidates begin with belonging; no pre-existing defect is required for a distinct, evidence-supported function.
6. **Sequencer** — place provisional additions or repairs only in auditable, non-frozen positions. Discovery may reveal an opportunity, but it does not prove that an insertion is justified.
7. **Auditor** — approve, veto, or revise decisions; validate lane selection and the fresh-scan receipt; distinguish a genuine post-search zero result from an unperformed scan.
8. **Librarian** — persist the approved state only when durable editorial state changed, including `journey-annotations.json` when the journey map changes. Do not append or commit an idle or repeated no-change run merely for telemetry.
9. **Publisher** — report from `spotify-status.json` and append the compact journey map whether or not the Librarian needed to write.

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

For an explicit action command, bypass clarification and `DIAGNOSIS AGREED` only for the exact named scope, record the matching `APPROVED — ...` state, then sequence and audit it. Any wider effect still requires the normal multi-track scope approval.

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

Candidate resolution is a scouting input, not a publication step.

- Run Scout in REPAIR or EXPLORE mode on every scheduled or requested editorial run, except an exact authorized action that requires no alternatives.
- In EXPLORE mode, complete the outward scan before deciding that no candidate qualifies.
- When one to three candidates qualify, write `scout-request.json` at most once per editorial run.
- Set `mode` to `REPAIR` or `EXPLORE`. For EXPLORE, freeze the complete exploration receipt in the request before resolution.
- For each requested candidate preserve `searchIntent`, `proposedPlacements`, `fitHypothesis`, and separated evidence fields.
- Resolve it into `scout-data.json` at most once per `runId`.
- Freeze the one-to-three-candidate snapshot before evaluation.
- `scout-data.json` must copy the mode, exploration receipt, and candidate evidence fields rather than reducing the snapshot to identity metadata.
- Mark resolution `COMPLETE` or `PARTIAL`. A PARTIAL snapshot may proceed with its one or two resolved candidates while preserving every unresolved identity and error; never substitute or pad. If zero resolve, fail the resolver and report the lane's `*_NOT COMPLETED` outcome.
- If no candidate qualifies, create no padded request or snapshot; send the documented repair or exploration receipt to the Auditor.
- Evaluator, Sequencer, Auditor, and Librarian use the same snapshot.
- Do not rerun Scout after audit approval.
- Spotify publication never executes the Scout or modifies scout files.
- A new snapshot requires a new `runId` and a genuinely new run.
- A scan timestamp or zero-result receipt alone is not durable editorial state and must not create an editorial repository commit.

## Audio-aware evidence lifecycle

`audio-evidence.md` defines the contract and `audio-evidence.json` stores available evidence.

- Accept only lawful audio analysis or explicit exports from identified tools.
- Preserve source, tool/version, timestamp, confidence, and whether a value is measured or model-derived.
- Never relabel DJOID or rekordbox “energy,” “emotion,” “danceability,” genre, similarity, or compatibility scores as listener report or objective truth.
- Never infer missing values from metadata, artist, label, title, or genre.
- Missing audio evidence is allowed and remains unknown.
- Tool evidence may generate or rank candidates, but cannot bypass the Evaluator, Auditor, feedback gate, or user approval.
- Update the registry only when genuinely new evidence is available; do not rewrite it during every daily run.

## Compatibility gate

For every candidate and placement, record two independent conclusions:

1. **Playlist belonging:** belongs, uncertain, or does not belong.
2. **Neighbour compatibility:** compatible, uncertain, or incompatible for the exact proposed incoming and outgoing transitions.

A candidate cannot be ADD unless it belongs and has at least one auditable placement. A track that belongs but fails one slot may be considered elsewhere without being rejected from the playlist identity.

## Live-mixing mode

Live-mixing work follows `live-mixing.md` and is separate from the daily canonical editorial run.

- Build a directed performance graph with multiple possible exits rather than one fixed order.
- Use key, phrase, mix-region, rhythmic, spectral, vocal, and trajectory evidence only when present and sourced.
- Preserve chapter intent and distinguish smooth continuation, pressure increase, release, reset, and emergency exit.
- Never publish the live graph to Spotify or treat it as authorization to edit `ledger.md`.
- Never route through a frozen region or alter a protected pair unless the user explicitly asks to design an exception.

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
- The published read-only detailed Site at `https://groove-over-noise-map.broskmenmi.chatgpt.site` reads `journey-map.json`; `sites-prompt.md` remains its maintenance/rebuild brief.
- The Site visualizes state and is never authoritative. Do not create a substitute website that becomes a second source of truth.

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
- Do not update durable editorial state before audit approval, except opening an `AWAITING CLARIFICATION` discussion without touching the ledger. The immutable diagnostic `scout-request.json` → `scout-data.json` resolution lifecycle may write before evaluation; it carries no verdict and authorizes no editorial change.
- Persist approved editorial changes as one logical commit when possible.
- Update `journey-annotations.json` in that same logical change set whenever the map's editorial state changes.
- The ledger row order always equals recommended listening order.
- Renumber after additions, removals, or reordering.
- GitHub remains authoritative when Spotify or the map is pending or failed.

## Required user-facing response for editorial runs

Use exactly these five numbered sections for every editorial run:

1. `TODAY'S DECISIONS` or `TODAY'S DECISION`
2. `LEDGER CHANGE`
3. `SPOTIFY STATUS`
4. `DETAILED MAP` — link exactly `[Detailed GROOVE OVER NOISE Journey Map](https://groove-over-noise-map.broskmenmi.chatgpt.site)`
5. `EDITORIAL NOTE` — one sentence

Section 1 depends on the outcome:

- **One to three evaluated candidates:** include every candidate; Verdict, Track — Artist, Position, Purpose, one-sentence Reason.
- **Exploration zero:** `EXPLORATION COMPLETE — NO QUALIFIED CANDIDATES` plus one short evidence-based scan summary; no candidate links.
- **Repair zero:** `REPAIR SEARCH COMPLETE — NO QUALIFIED CANDIDATES` plus one short evidence-based targeted-search summary; no candidate links.
- **Search blocked or unperformed:** `EXPLORATION NOT COMPLETED` or `REPAIR SEARCH NOT COMPLETED` plus the exact technical reason; do not claim that no suitable music or repair exists.
- **Authorized exact action without candidates:** `DIRECT ACTION` plus the exact approved move, removal, reorder, or replacement with an already agreed and resolved track.

Section 2 contains only audited additions, removals, replacements, or reordering; otherwise `None.`

Section 3 uses COMPLETE, PARTIAL, or MANUAL REQUIRED. When unavoidable user action exists, put the exact technical `MANUAL ACTION` inside this section; never put listening work there.

Purpose: maximum eight words. Reason: maximum ten words. Do not print the full ledger unless asked. Only link the canonical playlist, evaluated candidate tracks, the detailed map, and the generated journey-map image.

Immediately after the one-sentence `EDITORIAL NOTE`, append the compact map without adding a sixth numbered section:

```markdown
![GROOVE OVER NOISE journey map](https://raw.githubusercontent.com/broskmenmi/editorial-engine/main/playlists/groove-over-noise/journey-map.svg)
```

When the map is not yet current, write `Journey map updating` instead of embedding a stale visualization.

The exact five-section format does not apply to the clarification conversation before an accepted-track change. During clarification, answer directly and ask the necessary short questions.

## Playback rule

The canonical ledger optimizes for an ordered listening journey. Bodily pulse and attention continuity matter.

Live beatmatching and harmonic alternatives belong to the separate performance graph governed by `live-mixing.md`. Neither conclusion silently overrides the other. Mention Spotify Mix, DJOID, or rekordbox only when directly relevant and label their outputs by evidence class.
