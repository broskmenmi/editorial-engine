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
6. `under-review.md`
7. `notes.md`
8. `spotify.json`
9. `spotify-status.json`
10. repository-level `AGENTS.md`
11. the relevant skill packages under `.agents/skills/`

These paths remain the normal ChatGPT discovery paths. Do not relocate or duplicate the instruction files.

## Execution order

1. **Pre-audit** — calculate the adjacent BPM trajectory, map current chapters and peaks, inspect `under-review.md`, and identify unresolved transition, attention, or storytelling defects before scouting.
2. **Scout** — use `.agents/skills/scout/SKILL.md`; return exactly three track candidates with exact Spotify track URIs and verified BPM.
3. **Evaluator** — use `.agents/skills/evaluator/SKILL.md`; assign ADD, REVISIT, or REJECT while separating evidence from hypothesis.
4. **Sequencer** — use `.agents/skills/sequencer/SKILL.md`; place every provisional ADD or proposed repair.
5. **Auditor** — use `.agents/skills/auditor/SKILL.md`; approve, downgrade, reject, reposition, remove, replace, reorder, reclassify chapter roles, or open/resolve accepted-track reviews.
6. **Librarian** — use `.agents/skills/librarian/SKILL.md`; update persistent GitHub state only after audit.
7. **Publisher** — use `.agents/skills/publisher/SKILL.md`; report status from `spotify-status.json` after the GitHub Action publisher runs.

## Evidence model

Every material editorial statement must be classified internally as one of:

- **Measured evidence:** BPM, duration, exact identity, position, or later lawful audio measurements.
- **Craft convention:** a useful sequencing practice, not a universal law.
- **Listener report:** the user's direct experience; final authority for this playlist.
- **Editorial interpretation:** a proposed role such as re-entry, crest, summit, or dissolution.

Rules:

- BPM and other measurements screen and describe transitions; they do not prove that a transition works.
- Never infer busyness, stress, spaciousness, hypnosis, emotional effect, or attention demand from BPM, artist, genre, title, label, or reputation alone.
- Never claim to have listened to or waveform-analysed Spotify audio through the Spotify Web API.
- When direct listening or lawful audio evidence is unavailable, describe sonic claims as hypotheses.
- Use plain English in user-facing explanations. Explain specialist terms immediately when they are necessary.

## Selective focused-review gate

Do not analyse every stable track on every run.

A focused review is triggered only when:

- the user questions an accepted track;
- a REVISIT question concerns busyness, stress, monotony, atmosphere, attention, or emotional fit;
- a candidate is proposed for opener, re-entry, important crest, main summit, decompression pivot, or closer;
- measurements and listener reaction disagree.

Until a lawful audio-analysis pipeline exists, focused review means:

1. preserve the exact listener report when one exists;
2. explain the intended role in plain language;
3. compare the sequence with the track, without it, or in another position;
4. distinguish measured facts from predictions about listening;
5. default an unresolved critical-role candidate to REVISIT rather than pretending metadata proves the fit.

Future audio analysis may use only audio the user lawfully owns or has permission to process. Cache such analysis once by exact track/version identity and audio-file hash. Spotify streams must never be captured, transferred, or analysed.

## Accepted-track review protocol

`REVISIT` applies to candidates outside the ledger. `UNDER REVIEW` applies to tracks already in the ledger.

When a user questions an accepted track:

1. add it to `under-review.md` without immediately removing it;
2. preserve the user's exact words;
3. state why the track was originally admitted;
4. define one concrete listening question;
5. compare KEEP, MOVE, REPLACE, and REMOVE where relevant;
6. resolve only after listener evidence or an explicit user decision.

Feeling relieved because a track ends is strong negative evidence about the track or its placement, but it starts a discussion rather than forcing immediate deletion.

High-priority active reviews block unrelated expansion unless the user explicitly postpones them. When no new listener evidence exists, reuse existing review comparisons rather than spending a run on broad speculative discovery.

## Long-form storytelling architecture

The following is the chosen GROOVE OVER NOISE house style, not a universal law for techno:

`Arrival → Groove formation → Local crest → Partial release → Re-entry → Deeper crest → Partial release → Main summit → Long decompression → Dissolution`

Rules:
- Allow multiple local crests, but keep one main summit clearly dominant.
- Every later crest must reveal a different rhythmic, spatial, textural, or psychological quality.
- Partial releases reduce pressure without returning to the opening baseline.
- Re-entry begins from accumulated immersion and must not sound like a restart.
- The main summit is determined by total pressure, density, duration, attention demand, and listener experience, not BPM alone.
- Preserve the final decompression and dissolution as the ending.
- New waves should normally be inserted before the final descent, never appended after the established closer.
- Do not repeat the same build-drop pattern across consecutive chapters.
- Treat a current compact arc as a chapter that may be expanded or reclassified as duration grows.
- If the listener's actual experience contradicts the planned story, the planned story loses.

Duration guidance:
- Under 60 minutes: one complete wave may be sufficient.
- 60–120 minutes: normally require at least two waves.
- Two to three hours: normally require three or four chapters with local crests.
- Beyond three hours: use several chapters, one dominant summit, and a substantial final decompression.

## Transition and BPM rules

- Every ledger row must contain verified BPM when reliable metadata is available.
- Target adjacent BPM difference: **0–4 BPM**.
- **5–7 BPM** requires explicit pulse-continuity evidence and Auditor approval.
- Above **7 BPM** is prohibited unless a documented half-time/double-time relationship or intentional reset makes the perceived pulse continuous.
- The first three tracks may not exceed **4 BPM** between neighbours without direct listening evidence.
- A decompression may descend in BPM, but it must descend progressively rather than collapse abruptly.
- Avoid accidental tempo sawtoothing. Deliberate wave motion is valid only when the chapter and pressure narrative supports it.
- Spotify Mix, crossfade, and automatic transition processing cannot validate or excuse a defective transition.
- If the user still hears a jump with Spotify Mix enabled, record the transition as defective.
- Numeric compliance is necessary for ordinary transitions under this doctrine, but never sufficient for approval.

## Repair-first policy

- Known transition, attention, or storytelling defects take priority over new playlist growth.
- Active high-priority entries in `under-review.md` take priority over unrelated additions.
- When a defect exists, candidates must repair it through a bridge, replacement, removal, reorder, or chapter redesign.
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

Optimize for a curated listening journey, not a live DJ set. Beatmatching is not required, but bodily pulse and attention continuity are. Mention Spotify Mix only when directly relevant.
