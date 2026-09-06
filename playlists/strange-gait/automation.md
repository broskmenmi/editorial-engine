# STRANGE GAIT — Automation Orchestrator

GitHub is the persistent source of truth. Target directory: `playlists/strange-gait/`.

Read repository-level `AGENTS.md`, this file, `feedback-protocol.md`, and all seven skills under `.agents/skills/` before every editorial run. Also read:

1. `constitution.md`
2. `audio-evidence.md`
3. `audio-evidence.json`
4. `live-mixing.md`
5. `ledger.md`
6. `journey-annotations.json`
7. `journey-map-spec.md`
8. `discoveries.md`
9. `discovery-pool.md`
10. `set-ideas.md`
11. `rejected.md`
12. `revisit.md`
13. `under-review.md`
14. `notes.md`
15. `spotify.json`
16. `spotify-status.json`
17. `journey-map.json` when present

`feedback-protocol.md` overrides conflicting complaint-handling rules.

## Governing priority

STRANGE GAIT is **vibe-first**.

Apply these priorities in order:

1. preserve one coherent vibe / energy / pressure / atmosphere envelope;
2. preserve bodily continuity;
3. evolve the rhythmic gait gradually inside that envelope;
4. value novelty or role diversity only after the first three gates pass.

A candidate that looks structurally clever, has compatible BPM, or introduces a new rhythmic mechanism is not an ADD if it makes the playlist feel like disconnected favourite tracks.

Listener reports about vibe and energy continuity outrank an elegant paper sequence.

## Two outputs from discovery

Every successful discovery run may create value in **two independent layers**:

1. **Canonical editorial layer** — the strict STRANGE GAIT ledger and Spotify sequence.
2. **Inspiration layer** — `discovery-pool.md` and `set-ideas.md`.

The inspiration layer exists so the user can discover music and set directions even when no track clears the much stricter canonical ADD gate.

A failed ADD is not automatically a failed discovery.

### Discovery pool

`discovery-pool.md` is non-canonical and may retain:

- an exact resolved track worth knowing about;
- a track rejected only for a specific current placement;
- a parked canonical REVISIT that remains musically interesting;
- a source-backed research lead whose exact Spotify identity or tempo is incomplete;
- a release/label watch worth checking later.

Pool membership never changes Spotify, never overrides `rejected.md` or `revisit.md`, and never proves mixability or neighbour compatibility.

Use the pool's existing classes exactly:

- `EXACT TRACK`
- `RESEARCH LEAD`
- `RELEASE WATCH`

Do not invent a Spotify link for unresolved leads.

### Set ideas

`set-ideas.md` is also non-canonical. It stores small creative crates/directions that can be useful for DJ/set thinking even when the canonical playlist stays unchanged.

A set idea must contain:

- **Direction**
- **Ingredients**
- **Why it is interesting**
- **Unknown / risk**

A set idea is not a proven sequence and not a live-mixing edge. Never claim A → B mixes well, matches key, matches phrase, or preserves energy unless actual evidence supports that claim.

Prefer a few strong evolving directions over a long brainstorm dump. Merge overlapping ideas instead of creating near-duplicates.

## Operating lanes

### REPAIR
Choose REPAIR only for an actionable objective defect, a triggered STRANGE GAIT REVISIT, a clarified and authorized listener repair, or materially new lawful evidence that makes a specific repair/revisit actionable.

An `AWAITING CLARIFICATION` region is frozen and non-actionable. It does not block work elsewhere.

An explicitly approved exact removal, move, reorder, or replacement using already resolved identities may proceed directly to Sequencer and audit without Scout.

### EXPLORE
When no actionable repair exists, perform a genuinely fresh outward scan during this run. Search:

- current releases;
- adjacent or emerging artists and labels;
- overlooked catalogue material.

Begin with **playlist belonging and vibe continuity**, not with a missing chapter role.

Search for tracks that plausibly inhabit the current room before asking how their rhythm differs. Rhythmic behaviours central to STRANGE GAIT remain useful — displacement, asymmetry, swing, polymeter, syncopation, elastic low end, organic/mechanical percussion, half-time illusion, phase-like drift, negative space and controlled fracture — but they are secondary to atmosphere/energy continuity.

Do not search only for genre tags. Do not recycle old leads without materially new evidence. Record a fresh UTC receipt with source URLs or bounded query windows, approximate inspected scope, exclusions, and ranked leads.

During the same scan, also notice useful music that fails the canonical candidate floor for reasons such as incomplete tempo/identity evidence, wrong current slot, pre-release status, or unresolved vibe continuity. Preserve only genuinely interesting findings in the inspiration layer; do not pad it.

## Inspiration-harvest rules

At the end of every completed EXPLORE run, independently ask:

1. **Did we find music worth knowing even if it should not be ADDed?**
2. **Did the scan reveal a useful artist/label/release corridor?**
3. **Did the material suggest a genuinely new set direction?**

If yes, update `discovery-pool.md` and/or `set-ideas.md` in the audited durable-state commit.

A meaningful inspiration update is durable state and may justify a repository commit even when the canonical ledger is unchanged. This is **not** permission for telemetry-only commits:

- a scan count is not durable value;
- a repeated observation is not durable value;
- a duplicate pool entry is not durable value;
- a reworded existing set idea is not durable value.

If nothing genuinely new was found, write nothing.

A canonical `REJECT` may still be pooled when the rejection is placement-specific and the track remains useful music to know. Preserve the rejection scope visibly.

A canonical `REVISIT` may still be pooled, but pool membership does not trigger reconsideration.

A research lead or pre-release watch may enter the pool without resolver execution only when the source is concrete and the missing evidence is explicitly stated. It remains inspiration only.

## Volume boundary

GROOVE OVER NOISE is context, not this playlist's state. Do not mutate it, copy its ledger, or mechanically migrate its rejected/revisit queues.

## Bootstrap and opening handling

When the ledger has fewer than three tracks, follow `constitution.md`'s vibe-first bootstrap rule.

- Track 1 establishes the room.
- Track 2 remains Ground and must prove continuation of the same vibe/energy envelope.
- Track 3 remains Ground by default and must prove a three-track vibe; it does not need to prove Tilt.
- Until three canonical tracks exist, approve at most **one ADD per run**.
- Do not manufacture chapter progression merely because another track was added.

After three tracks, chapter changes still span multiple tracks by default. Do not map successive tracks mechanically to Ground → Tilt → Lock → Fracture.

## Scout and resolver lifecycle

When one or more honest leads meet the non-identity floor:

1. Read the current repository SHA immediately before writing.
2. Write `scout-request.json` exactly once with `schemaVersion: 2`, a new immutable `runId`, that SHA as `sourceCommit`, mode, target, EXPLORE receipt when applicable, and one to nine ranked entries under `leads`.
3. Never write request-side `candidates`, reuse a runId, or combine the request commit with ledger/rejected/revisit/discoveries changes.
4. Require the repository resolver's matching terminal `scout-data.json` with the same runId and canonical request fingerprint.
5. Only the strongest one to three unique exact identities in `scout-data.json.candidates` continue to canonical evaluation.
6. Preserve every warning, unresolved/duplicate lead and exact error, plus resolved-but-unselected alternates.

`COMPLETE` means every lead resolved. `PARTIAL` may proceed with selected candidates. `NONE` is valid only when every lookup completed normally. Credentials, authentication, network, rate limits, Spotify 5xx, stale inputs, malformed/conflicting state, or a missing terminal snapshot are `*_NOT_COMPLETED`, never NONE.

A resolver-only recovery follows repository-level recovery rules and never satisfies a later run's fresh-scan requirement.

If no lead clears the canonical resolver floor, create no padded request or snapshot. The run may still harvest inspiration-layer findings when they meet the rules above.

## Evaluation — three canonical gates

For every selected canonical candidate evaluate separately:

1. **Playlist belonging** — does it belong in STRANGE GAIT?
2. **Vibe / energy continuity** — does this exact placement preserve the existing room, pressure, atmosphere and attention envelope?
3. **Exact-neighbour compatibility** — does it work rhythmically and structurally with the concrete neighbours?

An ADD requires every applicable gate. Passing BPM or rhythmic compatibility never rescues a vibe-continuity failure.

Keep measured evidence, attributed descriptions, listener evidence, lawful audio evidence, craft convention, editorial interpretation and unknown properties visibly separate.

Never infer perceived energy, pressure, density, space, swing, hypnosis, emotional temperature or attention demand from BPM, artist, genre, title, label or Spotify metadata alone.

When no lawful audio or listener evidence exists, vibe continuity is provisional. For the opening and chapter boundaries, material uncertainty about the shared vibe envelope should normally produce REVISIT rather than a forced ADD.

STRANGE GAIT-specific scrutiny:

- Does the candidate sound-on-paper like a new room rather than the same room bending?
- Is the admission argument mostly “different rhythmic mechanism”? If so, that is insufficient.
- Does asymmetry strengthen bodily pull or merely display complexity?
- Does the transition preserve vibe and bodily thread before introducing rhythmic change?
- Is the candidate becoming IDM spectacle, industrial impact, hardgroove cliché or ornamental tribalism?
- Does a half/double-time relation have evidence, or is it being invented from numbers?

Novelty, popularity, BPM, key, complexity, extra length, artist reputation, or a tool score never justifies canonical admission.

## Sequencing

Preferred long-form story remains:

`Ground → Tilt → Lock → Fracture → Deep Lock → Escape`

But these are **multi-track zones**.

- Protect the room before advancing the story.
- Keep several tracks inside one chapter when that strengthens vibe continuity.
- Do not introduce a new chapter simply to give a candidate a distinct role.
- A transition may be perceptible rhythmically; an unplanned perceived-energy reset is a defect.
- First meaningful Tilt should normally come only after a coherent multi-track Ground exists.
- Default adjacent BPM target remains 0–5. Differences of 6–9 require concrete continuity evidence. Above 9 normally requires documented half/double-time equivalence or an audited intentional reset.
- BPM compliance is never proof of vibe or neighbour continuity.

Preserve protected and frozen regions. Live-mixing alternatives remain separate from canonical order. Set ideas remain separate from both canonical sequencing and live-mixing evidence.

## Listener-feedback repair

When the user reports that the sequence lacks taste, vibe, energy continuity, or sounds like disconnected favourite tracks:

- treat that as high-value listener evidence about the sequence, not a minor metadata mismatch;
- do not defend the chapter map merely because BPM transitions are valid;
- if the user approves a multi-track repair scope, prefer the smallest reset that restores one coherent room;
- removed tracks may be rejected for the current opening/journey without making a global sonic-incompatibility claim;
- invalidate revisit triggers that depended on structural chapters removed by the repair.

A removed or rejected track may remain in the discovery pool when it is still useful music to know. That does not weaken the canonical repair.

## Audit and persistence

Auditor validates lane selection, listener-feedback scope, vibe-first hierarchy, resolver integrity when used, bootstrap/chapter pacing, tempo reasoning, protected/frozen state, unsupported sonic claims, and inspiration/canonical separation.

After approval, Librarian persists one logical durable-state commit when something genuinely changed. Durable state may include:

- canonical ledger / rejected / revisit / review / notes / annotations changes;
- lawful audio or live-mixing evidence;
- a materially new discovery-pool entry;
- a materially new or substantively evolved set idea.

Update `journey-annotations.json` with every canonical track/chapter/status change. Do not touch journey annotations for inspiration-only changes.

Do not create telemetry-only, duplicate-pool, or wording-only commits.

The diagnostic scout request/snapshot lifecycle may commit before verdict; it carries no editorial decision.

## Spotify publication

GitHub Actions publish only the canonical target ledger through `apps/spotify-publisher/` and write `spotify-status.json` after exact read-back verification.

Neither `discovery-pool.md` nor `set-ideas.md` is a Spotify publication input.

Never use the ChatGPT Spotify connector for canonical search, publication, or verification.

`COMPLETE` may be reported only from a matching `spotify-status.json` record.

## Journey-map model

Story height means **ordinal rhythmic displacement / narrative tension**, not measured energy, loudness, mood, density or waveform intensity.

Generated files are `journey-map.json` and `journey-map.svg`. Do not hand-edit them.

If the ledger is empty, the map may legitimately be absent. Once a map exists, treat it as current only when its ordered URI list exactly equals the ledger.

Inspiration-only changes do not alter the journey map.

## Exact user-facing response

Use exactly five numbered sections for every editorial run:

1. `TODAY'S DECISION` or `TODAY'S DECISIONS`
2. `LEDGER CHANGE`
3. `SPOTIFY STATUS`
4. `DETAILED MAP`
5. `EDITORIAL NOTE`

For evaluated canonical candidates, section 1 includes every selected candidate: Verdict, Track — Artist, Position, Purpose, and one-sentence Reason. Preserve unresolved errors for PARTIAL/NONE without linking unresolved identities.

For zero-lead EXPLORE: `EXPLORATION COMPLETE — NO QUALIFIED CANONICAL CANDIDATES` plus a short evidence-based scan summary. This wording does **not** imply that no interesting music was discovered; inspiration harvest is reported separately in RUN ANALYSIS.

For blocked discovery/resolution: `EXPLORATION NOT COMPLETED` or `REPAIR SEARCH NOT COMPLETED` plus the exact technical reason and affected leads. Never use stale scout data.

Section 2 contains only audited canonical additions/removals/replacements/reordering; otherwise `None.` Inspiration-pool changes do not belong in LEDGER CHANGE.

Section 3 uses only `spotify-status.json`.

Section 4:
- if `journey-map.json` declares a published detailed site, link its exact URL;
- otherwise write `Not published yet — detailed map will activate after the journey has canonical material.`

Section 5 is one sentence.

When the compact map is current append:

```markdown
![STRANGE GAIT journey map](https://raw.githubusercontent.com/broskmenmi/editorial-engine/main/playlists/strange-gait/journey-map.svg)
```

If absent because the ledger is empty, write `Journey map not yet generated`. If stale/pending, write `Journey map updating`.

Then always append the unnumbered `## RUN ANALYSIS` required below.

Purpose: maximum eight words. Reason: maximum ten words. Do not print the full ledger unless asked.

## RUN ANALYSIS

Every scheduled/requested editorial run must end with critical analysis grounded in the Auditor evidence packet and persisted final state.

It must:

1. identify exact run timestamp and candidate runId when present;
2. reconstruct the real canonical funnel;
3. give at least two run-specific observations from distinct completed phases, or identify the last completed phase and blocker;
4. challenge the strongest conclusion with a plausible alternative explanation or contract issue;
5. state what the result proves and does not prove;
6. apply outcome-specific scrutiny;
7. compare recent runs only when genuinely comparable;
8. recommend a next action only when an evidenced defect/opportunity justifies one;
9. mark audio-evidence and live-mixing capabilities `NOT TESTED` unless actually exercised.

Then include a concise `### Discovery harvest` subsection whenever the run found inspiration-layer value.

The harvest should contain at most:

- **5 unique music discoveries** worth knowing about, with Spotify links only for exact resolved tracks;
- **3 artist/label/release watches** when useful;
- **3 set directions** from `set-ideas.md` when the run materially created or strengthened them.

For each discovery, say why it is interesting in one short sentence and clearly distinguish canonical status (`ADD`, `REVISIT`, `REJECT current role`, `POOL ONLY`, `RESEARCH LEAD`, `RELEASE WATCH`).

For batch requests such as “run five more,” the final response should roll up **unique discoveries and the strongest set ideas across the batch**, not repeat the same harvest five times.

Do not turn the harvest into listening homework. The user is discovering music, not operating the system.

For listener repairs, explicitly distinguish what the listener report proves about the **current sequence** from what it does not prove about each removed track globally.

The analysis may not rerun Scout, mutate frozen request/snapshot data, revise audited decisions, or create an analysis-only commit.
