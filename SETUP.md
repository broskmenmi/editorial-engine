# Setup

This repository contains editorial state and Codex/ChatGPT Agent Skills. Cloning or forking it does **not** automatically create a recurring ChatGPT task or authorize Spotify. Each user must perform the setup below in their own accounts.

## 1. Fork or clone the repository

Use a repository to which the user and the ChatGPT GitHub connector have read/write access.

If the repository name changes, replace every reference to `broskmenmi/editorial-engine` in the task prompt with the new `owner/repository` value.

## 2. Connect GitHub in ChatGPT

Required:
- **GitHub** — read/write access to the repository.

The ChatGPT Spotify connector is optional for candidate discovery only. It must not be used for canonical playlist publication.

Verify GitHub access by asking ChatGPT to read `AGENTS.md` from the selected repository.

## 3. Configure Spotify Web API publication

Create a Spotify Developer application and add this redirect URI:

```text
http://127.0.0.1:4387/callback
```

Development Mode applications require the app owner to have Spotify Premium.

From `apps/spotify-publisher/`, use the authorization helper described in its README to obtain a refresh token. Add these GitHub Actions secrets:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

The required OAuth scopes are:

- `playlist-read-private`
- `playlist-modify-private`
- `playlist-modify-public`

Never commit credentials or tokens.

## 4. Choose or create a playlist definition

Each playlist lives at:

```text
playlists/<playlist-slug>/
```

Required files:
- `constitution.md` — editorial identity and acceptance criteria.
- `ledger.md` — canonical ordered track list with exact Spotify URIs.
- `discoveries.md` — append-only run history.
- `rejected.md` — rejected candidates and reasons.
- `revisit.md` — unresolved candidates.
- `notes.md` — current structural diagnosis and scouting priority.
- `automation.md` — playlist-specific orchestration.
- `spotify.json` — canonical Spotify playlist identity.
- `spotify-status.json` — latest exact publication verification.

`playlists/groove-over-noise/` is the included reference implementation.

## 5. Create the recurring ChatGPT task

The task is account-specific and cannot be installed merely by downloading the repository. In a ChatGPT conversation with GitHub connected, ask:

```text
Use the scheduler skill in .agents/skills/scheduler/SKILL.md to create a daily recurring task for playlists/groove-over-noise/ at 08:00 in my timezone.
```

The scheduler skill contains the canonical task-prompt template and verification checklist.

The recurring task must be a **single orchestrator task**. Do not create separate recurring tasks for Scout, Evaluator, Sequencer, Auditor, Librarian, and Publisher.

## 6. Verify the task

Confirm that the task:
- is enabled;
- uses the intended schedule and timezone;
- references the correct GitHub repository;
- reads `AGENTS.md` and the target playlist's `automation.md`;
- loads Agent Skills from `.agents/skills/*/SKILL.md`;
- treats GitHub as the source of truth;
- requires exact Spotify track URIs;
- never publishes through the ChatGPT Spotify connector;
- reads publication status only from `spotify-status.json`.

## 7. Verify API publication

A canonical ledger commit triggers `.github/workflows/publish-spotify.yml`.

The workflow:
1. validates the ledger;
2. creates one empty playlist only when `spotify.json.playlistId` is null or deleted;
3. replaces the complete playlist contents from ledger URI order;
4. reads all playlist items back;
5. writes `COMPLETE` only when every URI and position matches;
6. persists the playlist ID and verification status to GitHub.

Use `workflow_dispatch` to rerun publication without editing the ledger.

## Portability boundary

The repository preserves:
- skills and their normal discovery paths;
- playlist constitutions;
- canonical ledgers;
- editorial history;
- orchestration instructions;
- publisher source code and workflow configuration.

The repository does **not** preserve:
- another user's ChatGPT recurring task;
- Spotify OAuth credentials;
- GitHub Actions secrets;
- timezone or notification preferences.

Those account-specific elements must be configured once by each user.
