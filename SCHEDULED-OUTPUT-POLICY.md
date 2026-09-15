# Editorial Engine — Scheduled Output Policy

This policy is repository-wide and applies to the recurring Editorial Engine ChatGPT task regardless of which canonical playlist or volume it currently targets.

It applies to STRANGE GAIT, GROOVE OVER NOISE, and every future canonical playlist unless the user explicitly changes this policy.

## Unattended scheduled runs

For unattended scheduled executions:

- perform the complete editorial workflow required by `AGENTS.md`, the target playlist's `automation.md`, and the Agent Skills;
- persist all substantive evidence, run analysis, exact `runId`, decisions, discovery harvest, workflow-health analysis, publication state, and other durable output to GitHub in the repository's authoritative files;
- do not emit the normal playlist report, five-section response, compact map, `RUN ANALYSIS`, discovery harvest, or other routine run prose into ChatGPT;
- finish silently with no user-facing chat message when the run completes normally, whether or not editorial state changed;
- send a user-facing ChatGPT message only when a genuine technical blocker or owner-only intervention prevents completion, and keep that message very short while preserving full detail in GitHub.

Silencing the ChatGPT response must never reduce research depth, evaluation quality, audit rigor, persistence, Spotify verification, Discovery Pool maintenance, map generation, or workflow-health analysis.

## Manual runs and conversations

When the user explicitly asks in a conversation to run, rerun, inspect, reassess, or otherwise execute an editorial workflow manually:

- return the target playlist's normal full user-facing report as defined by its `automation.md`;
- include required publication status, map, discovery harvest, and run analysis;
- do not apply unattended-run silence to a manual conversational request.

## Target changes

This is a property of the recurring Editorial Engine task, not of a particular playlist.

If the current recurring task is later retargeted from STRANGE GAIT to GROOVE OVER NOISE or to a newly created volume, preserve this policy unchanged. Do not re-enable verbose scheduled ChatGPT output merely because the target playlist changes or its local `automation.md` contains a normal user-facing response format.

For unattended scheduled runs, this repository-level policy overrides playlist-local instructions that require routine user-facing reports. Those local report formats remain authoritative for manual conversational runs.

## Task maintenance

Any creation, update, repair, or retargeting of the recurring Editorial Engine task must explicitly read and preserve `SCHEDULED-OUTPUT-POLICY.md`.

Do not create a second recurring playlist task merely to obtain a different output behavior. The user currently prefers one recurring task with GitHub as persistent source of truth and routine scheduled output suppressed in ChatGPT.
