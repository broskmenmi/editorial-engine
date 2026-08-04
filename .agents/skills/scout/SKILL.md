---
name: scout
description: Discover and rank resolution leads, then freeze one to three exactly resolved candidate tracks in REPAIR or EXPLORE mode without making final accept/reject decisions. Use after pre-audit selects the editorial lane.
---

# Scout

## Inputs
Read the target playlist directory supplied by the orchestrator:
- `constitution.md`
- `ledger.md`
- `discoveries.md`
- `rejected.md`
- `revisit.md`
- `under-review.md`
- `notes.md`

## Relaxation-first rule

The Scout must find music without turning the user into a tester.

- Never assign A/B comparisons, ranking exercises, or prescribed listening sessions.
- Do not resurface PARKED REVISIT candidates without new evidence, a changed structural need, or a user request.
- Do not treat missing user confirmation as an accepted-track defect.
- Natural feedback volunteered during ordinary listening is enough; the Scout should continue working without waiting for it.

## Search intent

Before searching, label the need as one of:

- **BELONGING** — find tracks that could belong somewhere in the playlist's world.
- **NEIGHBOUR** — find tracks for one exact incoming/outgoing transition.
- **BOTH** — the candidate must satisfy the identity and a concrete slot.

Do not use a neighbour score as proof of playlist belonging. Do not reject a track from the playlist identity merely because one placement fails.

Read `audio-evidence.md` and `audio-evidence.json` when present. Tool-derived evidence may narrow or rank the search, but unknown measurements stay unknown and no tool score decides admission.

## Operating modes

The orchestrator supplies one of two modes:

- **REPAIR** — an actionable objective defect, triggered REVISIT, clarified and authorized listener repair, or materially new lawful evidence that makes a specific existing repair or revisit actionable supplies a concrete target.
- **EXPLORE** — no actionable repair exists, so Scout performs a fresh outward discovery scan without requiring a pre-existing gap.

An `AWAITING CLARIFICATION` discussion is not an actionable repair target. Keep its region frozen and continue EXPLORE elsewhere.

In EXPLORE mode, rereading unchanged repository state, reusing an old candidate snapshot, or reconsidering old candidates without materially new evidence does not count as scouting.

## Fresh exploration receipt

Every EXPLORE run must record:

- UTC timestamp;
- source URLs, catalogues, feeds, or query windows;
- coverage of current releases, adjacent or emerging artists or labels, and overlooked catalogue material;
- approximate number inspected;
- exclusion reasons;
- the ranked resolution leads; the final candidate shortlist comes only from matching resolver output.

If no lead meets the non-identity floor, or a terminal NONE snapshot confirms that every ranked lead lacks an exact Spotify identity, return `EXPLORATION COMPLETE — NO QUALIFIED CANDIDATES` with the receipt and per-lead resolver errors. If the scan did not run, the resolver dependency failed, or no matching terminal snapshot arrived, return `EXPLORATION NOT COMPLETED` and the exact reason. Never present an unperformed search as evidence that the playlist needs nothing.

## Objective lead and shortlist floor

Resolution is part of qualification, not evaluation. A discovery may enter the ranked resolver request as a **lead** when all non-identity conditions below are true. It becomes an evidence-qualified **candidate** only after the repository resolver returns one exact Spotify track identity.

- a concrete discovery source is recorded;
- it is not excluded by the ledger, rejection history, or an untriggered parked revisit;
- at least one constitution-relevant belonging hypothesis exists beyond novelty, popularity, artist prestige, or BPM alone, with any source description clearly attributed;
- at least one concrete non-frozen placement can be proposed for neighbour testing without splitting a protected pair or ending;
- measured facts, attributed descriptions, listener evidence, lawful audio evidence, and fit hypotheses remain visibly separate.

The candidate shortlist adds these hard requirements:

- one exact individual Spotify track identity is resolved and verified;
- exact title, artist, and version match; a remix, edit, alternate, album, playlist, or broad fallback never substitutes;
- a unique title/artist identity with album wording or release-date variance preserves that variance as a warning rather than silently pretending the metadata matched;
- the candidate appears in the matching immutable `scout-data.json.candidates` array.

Meeting this floor only earns evaluation. It does not mean the track belongs, fits the placement, or should be added.

If REPAIR search finds no lead meeting the non-identity floor, or a terminal NONE snapshot confirms that every ranked lead lacks an exact Spotify identity, return `REPAIR SEARCH COMPLETE — NO QUALIFIED CANDIDATES` with the targeted search receipt and per-lead errors. If the required repair search did not run, the resolver failed operationally, or no matching terminal snapshot arrived, return `REPAIR SEARCH NOT COMPLETED` with the exact reason. Never pad the result or turn a technical failure into a repair conclusion.

## Procedure
1. Audit `under-review.md`, `notes.md`, and the current ledger first. Actionable user-approved repairs and objective defects take precedence over expansion.
2. In REPAIR mode, search for the supplied target. In EXPLORE mode, search outward across all three required source families before shortlisting.
3. Rank the strongest one to nine honest resolution leads. Never pad the set with a weak or metadata-only lead. Write them once under `schemaVersion: 2` → `leads` in `scout-request.json`, pinning the current pre-request repository SHA as `sourceCommit`; do not write request-side `candidates` or change canonical resolver inputs in the request commit.
4. Resolve the immutable request once. The resolver selects the highest-ranked one to three exact identities into matching `scout-data.json.candidates`. Only those tracks continue to evaluation.
5. In EXPLORE mode, start with playlist belonging. After identifying a lead, propose at least one concrete non-frozen placement for neighbour testing; do not invent a missing slot before the track is found.
6. When a clarified accepted-track repair exists, search for repositioning or replacement options for that exact role without assigning the user comparison work.
7. When no new evidence exists for an unresolved review, leave its region frozen; do not repeat the same comparison indefinitely.
8. Include eligible unresolved revisit candidates only when their documented trigger occurred.
9. Exclude anything already in `ledger.md`, except when an accepted track is intentionally used as a KEEP or MOVE control in internal reasoning.
10. Exclude anything in `rejected.md` unless materially new evidence is documented.
11. Do not optimize for popularity, novelty, or artist prestige.
12. Preserve a known exact Spotify track ID on the lead. Otherwise let the resolver perform exact search; never invent an ID.
13. Candidate identity is the resolved Spotify URI, not artist/title text. Reject ambiguous or alternate-version matches.
14. Obtain verified BPM from reliable metadata when available and record the source.
15. For bridge candidates, search within the BPM window required by both neighbours rather than searching by genre alone.
16. Never infer busyness, stress, spaciousness, hypnosis, steadiness, emotional effect, or attention demand from BPM, artist, genre, title, label, reputation, or search snippets alone.
17. If no lawful direct listening or audio evidence is available, label every sonic description as a **fit hypothesis**, not an observed fact.
18. For opener, re-entry, important crest, main summit, decompression pivot, or closer candidates, flag internal uncertainty but do not require listener confirmation.
19. Never surface or use playlist, album, artist, podcast, or broad search-fallback entities as candidates.
20. Do not invoke Spotify playlist creation or publication tools.

If the terminal snapshot is PARTIAL, evaluate only its unique selected candidates and preserve every unresolved or duplicate lead, exact error, warning, and resolved-but-unselected alternate. If it is NONE, stop before evaluation and return the lane's documented zero-qualified-candidate outcome with each unresolved lead and error. NONE is forbidden when credentials, network, authentication, rate limits, Spotify 5xx responses, or stale inputs interrupted resolution. If no matching valid terminal snapshot arrives after a bounded wait, name the request leads and report `no matching terminal snapshot`; never reuse stale output or rewrite the same `runId` anywhere in history.

A resolver-only recovery of a technical failure is not another outward scan. Use a new `runId`, `recoveryOfRunId`, and `recoveryReason`; pin `sourceCommit` to the commit containing the failed request; and preserve the original mode, target, receipt, and ranked leads exactly apart from their schema-v2 migration. Continue only if canonical resolver inputs are unchanged. Attribute the result to the original scan timestamp and never present it as fresh discovery performed during recovery.

If the source request itself has multiple historical contents from before enforcement, recovery additionally requires a concrete `legacySalvage.reason` and an exhaustive `legacySalvage.sourceCommits` list for every conflicting variant. The validator must prove every listed commit is at or before the hard immutable-history cutoff. Never use salvage to excuse or continue a new same-`runId` mutation.

## Evidence fields per candidate
- **Search intent:** BELONGING, NEIGHBOUR, or BOTH.
- **Playlist-belonging hypothesis:** belongs, uncertain, or does not belong, with reasons.
- **Exact-neighbour hypothesis:** compatible, uncertain, or incompatible for the proposed incoming and outgoing transitions.
- **Measured evidence:** exact identity, BPM, duration when available, neighbour differences, and sourced lawful audio measurements.
- **Craft convention:** why the position is plausible as sequencing practice.
- **Listener evidence:** any direct user reaction relevant to the role.
- **Editorial hypothesis:** the proposed job and remaining internal uncertainty.

## Output per candidate
- Track
- Artist
- Spotify URI
- Spotify track link
- Verified BPM and source
- Discovery source
- Tentative structural role
- Proposed neighbours and BPM differences
- Evidence fields
- One-sentence fit hypothesis
- Internal uncertainty when applicable

Do not assign ADD, REVISIT, or REJECT.

Precede candidate output with the operating mode, the fresh exploration receipt for EXPLORE, the immutable `runId`, resolution status, and any unresolved lead errors.
