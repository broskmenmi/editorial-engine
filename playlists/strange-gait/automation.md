# STRANGE GAIT — Automation Orchestrator

> Working title only. The public name is under reconsideration.

GitHub is the persistent source of truth. Target directory: `playlists/strange-gait/`.

Before every run read:

- repository-level `AGENTS.md`;
- repository-level `LONG-FORM-DJ-DOCTRINE.md`;
- this file and `feedback-protocol.md`;
- all seven Agent Skills under `.agents/skills/`;
- `constitution.md`, `ledger.md`, `notes.md`, `discoveries.md`, `discovery-pool.md`, `set-ideas.md`, `rejected.md`, `revisit.md`, `under-review.md`;
- `audio-evidence.md`, `audio-evidence.json`, `live-mixing.md`;
- `journey-annotations.json`, `journey-map-spec.md`, `journey-map.json` when present;
- `spotify.json`, `spotify-status.json`.

`feedback-protocol.md` controls listener complaints. `LONG-FORM-DJ-DOCTRINE.md` controls sequencing craft. `constitution.md` controls this volume's selection lens.

## Governing model

This volume is interested in techno that resists one fixed correct form, especially rhythmic and structural freedom.

That is a **selection lens**, not a demand that every track be weird, not a purity test, and not a sequencing template.

The global journey rule is:

**The music may change character. The flow must not feel accidental.**

Different vibes, energy levels, grooves, production worlds, and conspicuous left turns are allowed when they make sense in the transition, local run, and long-form journey.

Do not require one sonic room. Do not require a new groove or function per track. Do not mechanically progress through `Ground → Tilt → Lock → Fracture → Deep Lock → Escape`.

## Operating lanes

### REPAIR
Use REPAIR only for an actionable objective defect, triggered REVISIT, clarified/authorized listener repair, or materially new lawful evidence that makes a specific repair actionable.

`AWAITING CLARIFICATION` regions stay frozen.

An explicitly approved exact move/remove/reorder/replace involving already-resolved identities may proceed directly to sequencing and audit.

### EXPLORE
When no actionable repair exists, perform a genuinely fresh outward scan covering:

- current releases;
- adjacent or emerging artists/labels;
- overlooked catalogue material.

Search broadly inside the volume's curiosity. Do not force discovery into a pre-declared groove type, chapter role, or "same room" requirement.

Record a fresh UTC receipt, source windows, approximate inspected scope, exclusions, and ranked leads.

## Canonical candidate flow

When one or more honest leads meet the resolver floor:

1. Read current main SHA immediately before writing.
2. Write one immutable `schemaVersion: 2` `scout-request.json` with a new `runId`, that SHA as `sourceCommit`, mode, target, EXPLORE receipt, and one to nine ranked `leads`.
3. Never reuse a runId, write request-side candidates, or combine diagnostic request writes with editorial state.
4. Require the matching terminal `scout-data.json` and valid fingerprint.
5. Evaluate only its selected one-to-three exact candidates.
6. Preserve every warning, unresolved/duplicate outcome and exact error.

Technical resolver failures are `*_NOT_COMPLETED`, never musical zero results. Never use stale scout data.

If no lead clears the canonical resolver floor, do not pad a request.

## Canonical evaluation

For every resolved candidate separate:

1. **Volume fit** — is it relevant enough to this volume's broad techno curiosity?
2. **Transition quality** — does the immediate move make sense?
3. **Local-run quality** — does the surrounding three-to-five-track run feel curated?
4. **Long-form effect** — does it improve or preserve the larger journey and open useful possibilities?

A smooth transition may fail. A hard left turn may pass.

BPM is evidence, not a proxy for energy or flow. There are no repository-wide hard BPM cutoffs; explicit volume-specific tempo rules may still be used as heuristics when useful.

Do not infer energy, density, space, hypnosis, emotional effect, phrase structure, or mixability from metadata alone.

Novelty, role diversity, artist diversity, genre orthodoxy, and technical cleverness never justify admission by themselves.

Until three canonical tracks exist, approve at most one ADD per run so the opening develops deliberately. This is a pacing safeguard only; Tracks 2 and 3 do not have to share one vibe or one chapter.

## Inspiration layer

Every completed discovery run may create value independently of canonical ADD decisions.

### `discovery-pool.md`
May retain:

- exact tracks worth knowing;
- placement-specific rejects that remain musically interesting;
- parked revisits;
- source-backed research leads;
- release/label watches.

Pool membership never overrides canonical REJECT/REVISIT state and never publishes to Spotify.

### `set-ideas.md`
Stores a few useful non-canonical DJ/set directions.

Each idea must state:

- Direction
- Ingredients
- Why it is interesting
- Unknown / risk

Set ideas are not proven sequences and do not create live-mixing edges.

A genuinely new discovery-pool entry or substantively new set direction is durable inspiration state. Duplicate entries, scan counts, repeated observations, and wording-only edits are not.

## Sequencing and audit

Use the global Sequencer and Auditor skills.

For every placement assess transition scale, local-run scale, and long-form scale.

Do not impose:

- one sonic room;
- invisible transitions;
- one dominant summit;
- fixed wave/chapter counts;
- a new function per track;
- universal BPM thresholds;
- techno-purity rules.

Preserve protected and frozen regions and listener-feedback scope.

## Persistence

After Auditor approval, persist one logical durable-state change when something genuinely changed.

Canonical changes update `ledger.md` and `journey-annotations.json` together.

Inspiration-only changes do not touch journey annotations or Spotify.

Do not create telemetry-only commits.

## Spotify and map

GitHub Actions publish only the canonical ledger and generate the canonical journey map.

`discovery-pool.md` and `set-ideas.md` are never publication inputs.

Report Spotify COMPLETE only from exact `spotify-status.json` read-back.

Never use the ChatGPT Spotify connector for canonical search, publication, or verification.

## User-facing response

Use exactly five numbered sections:

1. `TODAY'S DECISION` / `TODAY'S DECISIONS`
2. `LEDGER CHANGE`
3. `SPOTIFY STATUS`
4. `DETAILED MAP`
5. `EDITORIAL NOTE`

Then append the current compact journey map or `Journey map updating`, followed by unnumbered `## RUN ANALYSIS`.

For zero canonical leads say `EXPLORATION COMPLETE — NO QUALIFIED CANONICAL CANDIDATES`; this does not mean no interesting music was discovered.

`RUN ANALYSIS` must reconstruct the real funnel, challenge the strongest conclusion, state what the run proves/does not prove, and mark audio/live capabilities `NOT TESTED` unless exercised.

When inspiration value appeared, include `### Discovery harvest` with at most:

- 5 unique music discoveries;
- 3 artist/label/release watches;
- 3 set directions.

Spotify links only for exact resolved tracks. Clearly label canonical status.

For batch requests, roll up unique discoveries and strongest set directions across the batch instead of repeating each run.

Never turn discovery into listening homework. The user is here to discover music and set ideas, not operate the system.
