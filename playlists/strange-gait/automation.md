# STRANGE GAIT — Automation Orchestrator

> Working title only. The public name is under reconsideration.

GitHub is the persistent source of truth. Target directory: `playlists/strange-gait/`.

## Current schedule
Run the existing STRANGE GAIT task **hourly for now** until the user requests a change. Preserve its live start time, exact scheduling mode and task ID `6a9bffba03cc819192efd0b728c0bd56`. Do not create a duplicate or revert to daily cadence.

## Required reading
Before every run read:
- repository-level `AGENTS.md`;
- repository-level `LONG-FORM-DJ-DOCTRINE.md`;
- this file and `feedback-protocol.md`;
- all seven Agent Skills under `.agents/skills/`;
- `constitution.md`, `ledger.md`, `notes.md`, `discoveries.md`, `discovery-pool.md`, `set-ideas.md`, `rejected.md`, `revisit.md`, `under-review.md`;
- `audio-evidence.md`, `audio-evidence.json`, `live-mixing.md`;
- `journey-annotations.json`, `journey-map-spec.md`, `journey-map.json` when present;
- `spotify.json`, `spotify-status.json`;
- global utility contract `playlists/discovery-pool/automation.md`.

`feedback-protocol.md` controls complaints. `LONG-FORM-DJ-DOCTRINE.md` controls journey craft. `constitution.md` controls the selection lens.

## Governing model
This volume is interested in techno that resists one fixed correct form, especially rhythmic and structural freedom. That is a **selection lens**, not a weirdness quota, genre-purity test or sequencing template.

Global rule: **The music may change character. The flow must not feel accidental.**

Different vibes, energy levels, grooves, production worlds and conspicuous left turns are allowed when they make sense at transition, local-run and long-form scale. Do not require one sonic room, a new groove/function per track, fixed chapters/waves, one summit, invisible transitions, artist/texture quotas or universal BPM cutoffs.

## Pre-audit and operating lanes
Pre-audit the live queue/history first.

### REPAIR
Use REPAIR only for:
- actionable objective defect;
- triggered REVISIT;
- clarified/authorized listener repair;
- materially new lawful evidence making a specific repair actionable; or
- an Auditor-confirmed **workflow/process defect** such as sustained Scout over-filtering, repeated epistemic veto, or repetitive placement search.

A no-ADD streak by itself is not a musical defect. It becomes a process-repair input only when the evidence shows the workflow is systematically filtering or parking credible contenders for the same non-musical reason.

`AWAITING CLARIFICATION` stays frozen.

### EXPLORE
When no actionable repair exists, perform a genuinely fresh outward scan across:
- current releases;
- adjacent/emerging artists and labels;
- overlooked catalogue material.

Explore both **outside-in** and **inside-out**:
- outside-in: find music that plausibly belongs, then test where it could help;
- inside-out: inspect the current canonical journey and search for music that could deepen, sharpen, release, redirect or extend an existing passage without inventing a rigid role taxonomy.

Record fresh UTC receipt, source windows, approximate inspected scope, concrete exclusions, ranked leads and inspection-to-lead conversion.

## Scout lead floor
Scout should find **credible contenders**, not prove the final placement before resolution.

A lead needs:
- a concrete source;
- no canonical/rejection/revisit/protection conflict;
- a credible constitution-relevant belonging hypothesis beyond novelty/popularity/prestige/BPM;
- at least one lawful placement hypothesis for later testing.

It does **not** need direct proof that the neighbour handoff works. Direct exact-track rhythmic prose is helpful but not mandatory when reliable context is sufficient to justify serious evaluation. Generic metadata alone is insufficient.

Never pad weak leads. But do not stop at three merely because the resolver later selects at most three candidates. Use more of the allowed **1–9 leads** when several credible contenders exist.

### Low-conversion diagnostics
No quota is imposed, but possible over-filtering must be visible:
- if `inspected >= 20` and `leads <= 3`, mark `LOW_LEAD_CONVERSION` and explain the dominant exclusions;
- if `inspected >= 30` and `leads < 4`, Auditor must explicitly test whether Scout used evaluation-level proof as a lead prerequisite.

These thresholds diagnose the funnel; they never authorize padding or forced ADDs.

## Canonical candidate flow
When honest leads exist:
1. Read current main SHA immediately before writing.
2. Derive every proposed-placement `precedingUri` and `followingUri` directly from the current canonical ledger. Before writing, validate that each prose-named neighbour matches its URI and that the pair is adjacent in current ledger order. A mismatch blocks the request as `REQUEST_NOT_COMPLETED`; never commit stale URIs, resolve the request anyway, or silently fall back to prose after resolution.
3. Write one immutable schemaVersion 2 `scout-request.json` with a new runId, current `sourceCommit`, mode, target, EXPLORE receipt and 1–9 ranked `leads`.
4. Never reuse runId, write request-side candidates, mutate request content or combine diagnostic request writes with editorial state.
5. Require the matching terminal `scout-data.json` with valid fingerprint.
6. Evaluate only its selected one-to-three exact candidates.
7. Preserve every warning, unresolved/duplicate outcome, resolved alternate and exact resolver error.

Technical resolver failures are `*_NOT_COMPLETED`, never musical zero. Never reuse stale scout data.

## Candidate-slot strategy
The resolver selects at most three candidates. Rank top leads for **canonical potential and journey usefulness**, not for easiest-to-describe weirdness.

When supported by the scan, let the top candidates represent materially different plausible ways to improve the journey — for example continuation/deepening, deliberate redirection, or an adjacent-world move. These are examples, not quotas.

## Canonical evaluation
For every exact candidate separately assess:
1. **Volume fit**;
2. **Immediate transition**;
3. **Surrounding three-to-five-track run**;
4. **Long-form journey effect**.

A smooth transition may fail. A hard turn may pass. BPM is evidence, not energy or flow.

Never infer energy, density, space, hypnosis, emotion, phrase structure, perceived pulse or mixability from metadata alone.

### UNKNOWN is not FAIL
Missing direct audio/phrase/mix evidence remains **UNKNOWN**. It is not an automatic PARK condition.

A provisional ADD may pass when the best available evidence supports a deliberate placement at all three sequencing scales and no known evidence contradicts it, even though direct transition audio is unavailable.

Use PARK/REVISIT only when a **specific decision-critical uncertainty** prevents a responsible placement. Do not mechanically turn `transition UNKNOWN` into `local run NOT PROVEN` → `long form NOT PROVEN` → `PARKED`.

Before parking, Evaluator and Auditor must answer:
- What exactly is the decision-critical unknown?
- Why can the best available evidence not choose responsibly despite it?
- Was another reasonable planned placement tested?
- Is the evidence bar stricter than the one historically used for existing provisional ADDs?

Novelty, role diversity, artist diversity, genre orthodoxy and technical cleverness never justify admission.

## Workflow-health / stagnation audit
Every run's analysis must expose:
- approximate inspected count;
- lead count and inspection→lead conversion;
- exact-resolution count and lead→resolution conversion;
- evaluated-candidate count;
- ADD count and candidate→ADD conversion;
- consecutive completed runs since previous canonical ADD;
- exact genuinely-interesting tracks retained since previous ADD when reconstructable.

When a no-ADD streak coexists with growing retained-interest inventory, diagnose which explanation fits:
1. playlist maturity;
2. weak candidate scans;
3. resolver/identity loss;
4. Scout over-filtering;
5. Evaluator epistemic veto;
6. repetitive placement hypotheses.

If evidence supports 4–6, Auditor must emit an actionable workflow REPAIR before another ordinary EXPLORE. Do **not** force an ADD to improve metrics.

The Run 55–85 drought is historical evidence of this failure mode and must remain visible in comparative analysis rather than being forgotten after one successful ADD.

## Inspiration layer
A completed discovery run may create value independently of canonical decisions.

### `discovery-pool.md`
May retain exact interesting tracks, placement-specific rejects that remain interesting, parked revisits, source-backed research leads and release/label watches. It is not a Spotify publication input.

### `set-ideas.md`
Stores a few non-canonical creative directions with Direction / Ingredients / Why interesting / Unknown-risk. Set ideas are not proven sequences or live-mixing edges.

After Auditor approval, every exact Spotify track explicitly retained as genuinely interesting enters the separate global utility ledger `playlists/discovery-pool/ledger.md` when absent, regardless of ADD/PARKED/placement-specific REJECT. Never add unresolved leads, watches, duplicates, resolver errors or merely inspected tracks.

Never apply sequencing, chapter, BPM-flow or journey-map semantics to the global utility ledger.

## Sequencing and protected state
Use global Sequencer and Auditor skills. Preserve feedback boundaries, rejected/revisit state, live/canonical separation and frozen regions.

Preserve **Linear System — Transparency → Ignez — When We Froze → Len Faki — Stardancer** in that exact internal order. Only `Transparency → When We Froze` and `When We Froze → Stardancer` are listener-protected. `Truth in Noise → Transparency` is not protected by implication.

If an actionable REPAIR recommendation emerges, execute it as the very next ad-hoc run using the same orchestrator task before returning to EXPLORE.

## Persistence
After Auditor approval persist durable state only when something genuinely changed.

Canonical changes update `ledger.md` and `journey-annotations.json` together. Record substantive evaluated results atomically in `discoveries.md` with exact runId/evidence. Do not use pending-discovery files or telemetry-only commits.

Inspiration-only changes do not touch journey annotations or STRANGE GAIT Spotify inputs.

## Spotify and map
Read root `publication.json` and honor `automaticPublishingEnabled`. Never change it without explicit user instruction.

When true, GitHub Actions automatically publish only affected playlist inputs and regenerate the target map. When false, preserve manual-only state.

Report COMPLETE only from exact matching `spotify-status.json` read-back. On no-change runs, distinguish last verified receipt from new verification.

If the global Discovery Pool ledger changes, explicitly report **EDITORIAL ENGINE — DISCOVERY POOL**, its Spotify URL, before→after count, exact status and exact `verifiedAt` after bounded finalization.

Single detailed site: https://broskmenmi.github.io/editorial-engine/ . STRANGE GAIT uses its own `journey-map.json` subsection. Never create a separate site.

Never use the ChatGPT Spotify connector for canonical search, publication or verification. Never mutate GROOVE OVER NOISE in this workflow.

## User-facing response
Use exactly five numbered sections:
1. `TODAY'S DECISION` / `TODAY'S DECISIONS`
2. `LEDGER CHANGE`
3. `SPOTIFY STATUS`
4. `DETAILED MAP`
5. `EDITORIAL NOTE`

Then append the compact journey map or `Journey map updating`, followed by unnumbered `## RUN ANALYSIS`.

`RUN ANALYSIS` must reconstruct the real funnel, include the workflow-health metrics above, challenge the strongest conclusion, compare with genuinely comparable recent runs, state what the run proves/does not prove, identify any stagnation signal and mark audio/live capabilities `NOT TESTED` unless exercised.

When inspiration value appeared include concise `### Discovery harvest` with at most five music discoveries, three watches and three set directions.

Never turn discovery into listening homework.
