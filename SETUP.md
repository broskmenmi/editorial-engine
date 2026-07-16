# Setup

This repository contains editorial state and Codex/ChatGPT Agent Skills. Cloning or forking it does **not** automatically create a recurring ChatGPT task or authorize GitHub or Spotify.

## 1. Repository access

Use a repository to which both the user and the ChatGPT GitHub connector have read/write access.

The standard instruction paths are stable and must remain available:

```text
AGENTS.md
.agents/skills/<skill-name>/SKILL.md
playlists/<playlist-slug>/automation.md
playlists/<playlist-slug>/*.md
```

## 2. Connect GitHub in ChatGPT

GitHub access is required for reading instructions and maintaining the editorial source of truth.

Verify access by asking ChatGPT to read `AGENTS.md` from the repository.

The ChatGPT Spotify connector is optional for track discovery only. It must not create, edit, search for, or verify the canonical playlist.

## 3. Playlist definition

Each playlist lives at:

```text
playlists/<playlist-slug>/
```

Required files:

- `constitution.md` — editorial identity and acceptance criteria.
- `ledger.md` — canonical ordered track list with exact Spotify URIs.
- `discoveries.md` — newest-first run history (each run is prepended).
- `rejected.md` — rejected candidates and reasons.
- `revisit.md` — unresolved candidates.
- `notes.md` — current structural diagnosis and scouting priority.
- `automation.md` — playlist-specific orchestration.
- `spotify.json` — canonical Spotify playlist identity.
- `spotify-status.json` — latest exact publication verification.

`playlists/groove-over-noise/` is the included reference implementation.

## 4. Phone-only Spotify authorization

No computer, terminal, npm, localhost callback, or Spotify Client Secret is required.

1. Create or open a Spotify Developer application from a phone browser.
2. In its settings, add the repository's exact GitHub Pages redirect URI:

```text
https://<your-github-username>.github.io/<repository-name>/spotify-auth/
```

For this repository, that is:

```text
https://broskmenmi.github.io/editorial-engine/spotify-auth/
```

3. In GitHub repository settings, open **Pages** and select **GitHub Actions** as the source if Pages is not already enabled.
4. Wait for the `Deploy Spotify authorization page` workflow to finish.
5. Open the same redirect URI in the phone browser.

6. Paste the Spotify Client ID and tap **Connect Spotify**.
7. Approve the requested playlist permissions.
8. Copy the Client ID and refresh token displayed by the page.
9. In GitHub repository settings, open **Secrets and variables → Actions**.
10. Create exactly these repository secrets:

```text
SPOTIFY_CLIENT_ID
SPOTIFY_REFRESH_TOKEN
```

Do not paste the refresh token into ChatGPT, issues, commits, or Markdown files.

The authorization page uses Authorization Code with PKCE and does not require a Client Secret.

### Fork playlist identity

When forking, clear the `playlistId` and `ownerUserId` values in `playlists/<slug>/spotify.json` (set them to empty strings). The publisher then creates a fresh playlist under the fork owner's account on the first run. Leaving the original values in place makes the ownership check hard-fail against the original owner's playlist.

## 5. Spotify publication

`.github/workflows/publish-spotify.yml` runs the exact Spotify Web API publisher for every playlist directory under `playlists/` that contains both `ledger.md` and `spotify.json`, not only the reference playlist.

For each such playlist, the publisher:

1. reads the ordered URI list from `ledger.md`;
2. uses the persisted playlist ID in `spotify.json`;
3. creates one empty playlist only if the stored playlist is absent or was deleted;
4. replaces the complete playlist item list;
5. reads the playlist back;
6. writes `spotify-status.json`;
7. reports COMPLETE only when every URI and position match.

It never searches Spotify by playlist name and never invokes generative playlist creation.

## 6. Create the recurring ChatGPT task

The task is account-specific. In a ChatGPT conversation with GitHub connected, ask:

```text
Use the scheduler skill in .agents/skills/scheduler/SKILL.md to create a daily recurring task for playlists/groove-over-noise/ at 08:00 in my timezone.
```

Use one orchestrator task, not separate tasks for individual skills.

The task must:

- read repository-level `AGENTS.md`;
- read the target playlist's `automation.md`;
- load skills from `.agents/skills/*/SKILL.md`;
- treat GitHub as the source of truth;
- update persistent state only after audit approval;
- never use ChatGPT's Spotify connector for publication;
- read `spotify-status.json` for publication status.

## 7. First production run

After both GitHub Actions secrets exist:

1. open the repository's **Actions** tab;
2. choose **Publish Spotify playlist**;
3. select **Run workflow**;
4. verify that `spotify-status.json` becomes `COMPLETE`;
5. open only the canonical playlist URL recorded in that status file.

## Portability boundary

The repository preserves skills, playlist constitutions, ledgers, history, orchestration instructions, publisher code, and playlist identity.

It does not preserve another user's ChatGPT task, connector authorization, Spotify refresh token, timezone, or notification preferences.
