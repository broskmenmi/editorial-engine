---
name: scout
description: Discover and rank credible resolution leads, then freeze one to three exactly resolved candidates in REPAIR or EXPLORE mode without making final verdicts.
---

# Scout

## Inputs
Read the target playlist's `constitution.md`, `ledger.md`, `discoveries.md`, `rejected.md`, `revisit.md`, `under-review.md`, `notes.md`, `audio-evidence.md` and `audio-evidence.json` when present.

## Core responsibility
Scout's job is to find **credible musical contenders for serious evaluation**. It is not Scout's job to prove the final canonical placement before resolution.

A discovery may deserve evaluation even when phrase structure, perceived pulse, exact handoff feel, energy, density, mixability or lawful audio measurements are unknown. Unknown evidence must remain unknown; it is not negative evidence.

## Relaxation-first rule
- Never assign A/B comparisons, rankings or prescribed listening sessions.
- Do not resurface PARKED candidates without materially new evidence, changed structural need or explicit user request.
- Do not treat missing listener confirmation as a defect.
- Natural volunteered feedback is enough; scouting continues without user QA.

## Search intent
Label the need as `BELONGING`, `NEIGHBOUR`, or `BOTH`.

`BELONGING` is allowed in ordinary EXPLORE. A lead does not need a pre-existing hole in the playlist. After finding it, propose at least one lawful non-frozen placement hypothesis for later testing.

Do not use a neighbour hypothesis as proof of belonging, and do not reject global belonging because one placement fails.

## Operating modes
- **REPAIR** — actionable objective defect, triggered REVISIT, clarified/authorized listener repair, materially new lawful evidence making a specific repair actionable, or an Auditor-confirmed workflow/process defect.
- **EXPLORE** — no actionable repair exists; perform fresh outward discovery.

An `AWAITING CLARIFICATION` region stays frozen and does not block exploration elsewhere.

## Fresh exploration receipt
Every EXPLORE run records:
- UTC timestamp;
- current-release source windows;
- adjacent/emerging artist or label windows;
- overlooked catalogue windows;
- approximate number of tracks/releases inspected;
- concrete exclusion reasons;
- ranked leads;
- inspection-to-lead conversion.

Rereading old state, reusing an old snapshot or reconsidering PARKED candidates without new evidence is not fresh exploration.

## Lead floor — intentionally permissive enough for evaluation
A discovery may enter the resolver request when all of these are true:

1. A concrete source or catalogue path is recorded.
2. It is not blocked by canonical duplication, active scoped rejection, protected/frozen state or an untriggered PARKED revisit.
3. There is a credible constitution-relevant belonging hypothesis beyond popularity, artist prestige, novelty or BPM alone.
4. At least one lawful non-frozen placement can be proposed as an **editorial hypothesis** for Evaluator testing. Scout does **not** need evidence that the handoff already works.
5. Evidence classes remain separate.

Direct exact-track prose about rhythmic mechanics is valuable but **not mandatory for lead admission**. Reliable release context, artist/label description, credible review context or catalogue evidence may be enough to justify resolution when it makes the track a serious contender. Generic genre tags, bare metadata or reputation alone are not enough.

Meeting the lead floor earns identity resolution only. It does not imply ADD, REVISIT or REJECT.

## Candidate floor
A candidate additionally requires:
- one exact individual Spotify track identity;
- exact artist/title/version match;
- preservation of album/date/relinking variance as warnings;
- inclusion in the matching immutable `scout-data.json.candidates` array.

## Funnel-health guardrails — diagnostics, never quotas
There is no required lead count and no ADD quota. However, Scout must expose possible over-filtering rather than silently normalizing it.

- If **20 or more** items are inspected and **3 or fewer** honest leads survive, mark `LOW_LEAD_CONVERSION` and explain the dominant exclusion reasons.
- If **30 or more** are inspected and fewer than **4** leads survive, explicitly challenge whether the lead floor is being used as a disguised final-evaluation gate.
- A low conversion warning does not authorize padding weak leads. It requires the Auditor to inspect the exclusions and determine whether the floor is too strict or the scan was genuinely weak.
- Prefer using more of the allowed 1–9 lead capacity when several genuinely credible contenders exist. Do not stop at three merely because the resolver later selects at most three candidates.

## Candidate-slot strategy
The resolver can select at most three exact candidates. Rank leads for **canonical potential and journey usefulness**, not for conspicuous weirdness or easiest-to-describe technique.

When the scan supports it, let the top candidates represent materially different plausible ways to improve the journey, for example:
- a subtle deepener/continuation;
- a purposeful redirection or contrast;
- an adjacent-world option with a credible route into the existing sequence.

These are not quotas or required roles.

## Procedure
1. Pre-audit `under-review.md`, `notes.md`, `revisit.md`, recent discoveries and the current ledger.
2. In REPAIR, search the concrete repair target. In EXPLORE, search all three source families freshly.
3. Inspect the current journey **inside-out** as well as the catalogue outside-in: ask where a new track could deepen, sharpen, release, redirect or extend the existing sequence, without inventing rigid chapter roles.
4. Rank one to nine honest leads. Do not pad weak or metadata-only entries.
5. Immediately before request write, read current repository SHA.
6. Write one immutable schemaVersion 2 `scout-request.json` with a new `runId`, `sourceCommit`, mode, target, receipt and ranked `leads`. Never write request-side candidates or mutate the same runId later.
7. Resolve once. Require the matching valid terminal `scout-data.json` and fingerprint.
8. Evaluate only its selected one-to-three unique exact candidates. Preserve all unresolved/duplicate outcomes, warnings and exact resolver errors.
9. Preserve known exact Spotify IDs when available; otherwise let the resolver perform exact search. Never invent IDs or substitute alternate versions.
10. Obtain reliable BPM when available, but never infer energy or flow from it.
11. Never infer busyness, stress, spaciousness, hypnosis, emotional effect, phrase structure, perceived pulse or mixability from artist/genre/title/label/BPM/search snippets.
12. Do not invoke Spotify publication tools.

## Resolver outcomes
- `COMPLETE`: every lead resolved.
- `PARTIAL`: evaluate only selected exact candidates and preserve every unresolved/duplicate/warning/alternate outcome.
- `NONE`: valid only when every lookup completed normally.
- Auth, credentials, network, rate limit, Spotify 5xx, stale inputs, malformed/conflicting snapshots or missing terminal snapshots are `*_NOT_COMPLETED`, never musical zero results.

If no honest lead clears the repaired lead floor, return the documented zero-qualified-candidate result with the exploration receipt. If search or resolution did not complete, report `*_NOT_COMPLETED` accurately.

Resolver-only recovery uses a new runId with `recoveryOfRunId` and `recoveryReason`, preserves the original frozen search semantics and does not count as a new outward scan.

## Evidence per candidate
Record:
- search intent;
- playlist-belonging hypothesis;
- proposed placement(s) as hypotheses;
- exact-neighbour hypothesis with unknowns explicit;
- measured evidence;
- attributed description;
- listener evidence;
- lawful audio evidence;
- craft convention;
- editorial interpretation.

## Output
For each selected candidate provide exact identity/link, verified BPM/source when available, discovery source, proposed placements, evidence classes and principal uncertainty. Do not assign ADD/REVISIT/REJECT.
