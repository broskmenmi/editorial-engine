# GROOVE OVER NOISE — Listener Feedback Protocol

This file governs what happens when the user comments negatively on a track or transition. It overrides any conflicting instruction elsewhere in the repository.

## Core distinction

A **complaint is evidence, not an action command**.

Examples that open a discussion but do not authorize a playlist change:

- “I don't like this track.”
- “This feels noisy.”
- “The transition feels abrupt.”
- “It feels too slow / too house / too busy.”
- “I often or always skip it.”
- “Could this track work somewhere else?”

Examples that authorize direct action:

- “Remove it.”
- “Delete this track from the playlist.”
- “Take it out now.”
- “Replace it with the option we already agreed on.”

When intent is unclear, treat it as discussion, not authorization.

An exact action command bypasses the clarification and `DIAGNOSIS AGREED` steps for exactly the named scope. Before persistence, record the matching `APPROVED — MOVE`, `APPROVED — REPLACE`, `APPROVED — REMOVE`, or other exact approved state. It does not authorize changing neighbours, adding a bridge, searching for an unspecified replacement, or widening the reorder; those effects still require named scope and explicit approval.

## Clarification gate

Unless the user explicitly orders removal, replacement, movement, or another exact change:

1. **Freeze the affected region.** Do not edit `ledger.md`, publish Spotify, reject the track, resolve the review, add a replacement, or change neighbouring tracks.
2. Record the user's exact words in `under-review.md` with status `AWAITING CLARIFICATION`.
3. Explain in plain language why the track was originally placed there.
4. Ask at most three short clarifying questions that can be answered from memory. Do not assign listening homework or A/B tests.
5. Work with the user to distinguish:
   - the track itself;
   - the transition into it;
   - the transition out of it;
   - its position or narrative role;
   - a broader stylistic mismatch.
6. Summarize the shared diagnosis before proposing KEEP, MOVE, REPLACE, or REMOVE.
7. If the proposed solution changes any track other than the complained-about track, list every affected track and ask for explicit approval before writing the ledger.

## Default clarifying questions

Choose only the questions needed; do not ask all of them mechanically.

- **Where is the problem?** The first seconds of the track, the whole track, or the transition from the previous track?
- **Once it settles, do you like the track itself?**
- **What changes too suddenly?** Speed, heaviness, rhythm, amount of sound, mood, or the feeling that a different scene starts?
- **Would you like us to try moving it before considering removal?**
- **Is the transition out of the track also a problem, or only the way it enters?**

Use plain language and allow the user to answer approximately.

## Scope control

- A complaint about one track does not authorize changing several tracks.
- A repair involving a new bridge, replacement track, changed neighbour, or reordered chapter is a multi-track change even when it solves one complaint.
- Before a multi-track change, state the exact before-and-after sequence and ask the user to approve the scope.
- While clarification is pending, recurring editorial runs may continue elsewhere in the playlist but must not alter the frozen region.

## Behavioural evidence

Repeated skipping, relief when a track ends, and stress are strong evidence. They strengthen the case for change but do not bypass the clarification gate unless the user explicitly says to remove the track.

## Resolution states

- `AWAITING CLARIFICATION` — discussion opened; no playlist changes allowed.
- `DIAGNOSIS AGREED` — user and editor share an understanding of the problem; options may be proposed.
- `APPROVED — KEEP`
- `APPROVED — MOVE`
- `APPROVED — REPLACE`
- `APPROVED — REMOVE`

Only an `APPROVED` state may change the canonical ledger or Spotify publication.

## Session 4 correction

The complaint “Session 4 feels like it comes out abruptly after Alarico” described a transition problem. It did not explicitly authorize replacing Session 4. Replacing it with Vakat — Percussion Work before asking clarifying questions was premature. The current playlist state must remain frozen until the user and editor clarify what feels abrupt and agree on the intended repair scope.
