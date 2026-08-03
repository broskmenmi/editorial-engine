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
playlists/<playlist-slug>/*.json
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

- `constitution.md` — editorial identity, evidence rules, and acceptance criteria.
- `feedback-protocol.md` — clarification and scope rules for listener complaints.
- `ledger.md` — canonical ordered track list with exact Spotify URIs.
- `discoveries.md` — run history.
- `rejected.md` — rejected candidates and reasons.
- `revisit.md` — unresolved candidates outside the ledger.
- `under-review.md` — collaborative listener-feedback discussions.
- `notes.md` — current structural diagnosis, evidence status, and scouting priority.
- `automation.md` — playlist-specific orchestration.
- `spotify.json` — canonical Spotify playlist identity.
- `spotify-status.json` — latest exact publication verification.
- `journey-annotations.json` — editorial chapters, story bands, protected states, and frozen regions.
- `journey-map-spec.md` — compact-map and detailed-Site specification.
- `sites-prompt.md` — future ChatGPT Sites build prompt.

Generated files:

- `journey-map.json` — detailed Sites-ready data model.
- `journey-map.svg` — compact visualization for editorial-run responses.

`playlists/groove-over-noise/` is the included reference implementation.

## 4. Phone-only Spotify authorization

No computer, terminal, npm, localhost callback, or Spotify Client Secret is required.

1. Create or open a Spotify Developer application from a phone browser.
2. In its settings, add this exact redirect URI:

```text
https://broskmenmi.github.io/editorial-engine/spotify-auth/
```

3. In GitHub repository settings, open **Pages** and select **GitHub Actions** as the source if Pages is not already enabled.
4. Wait for the `Deploy Spotify authorization page` workflow to finish.
5. Open:

```text
https://broskmenmi.github.io/editorial-engine/spotify-auth/
```

6. Paste the Spotify Client ID and tap **Connect Spotify**.
7. Approve the requested permissions.
8. Copy the Client ID and refresh token displayed by the page.
9. In GitHub repository settings, open **Secrets and variables → Actions**.
10. Create exactly these repository secrets:

```text
SPOTIFY_CLIENT_ID
SPOTIFY_REFRESH_TOKEN
```

Do not paste the refresh token into ChatGPT, issues, commits, or Markdown files.

The authorization page uses Authorization Code with PKCE and does not require a Client Secret.

## 5. Spotify publication

`.github/workflows/publish-spotify.yml` runs the exact Spotify Web API publisher.

The publisher:

1. reads the ordered URI list from `ledger.md`;
2. uses the persisted playlist ID in `spotify.json`;
3. creates one empty playlist only if the stored playlist is absent or was deleted;
4. replaces the complete playlist item list;
5. updates configured metadata and cover art;
6. reads the playlist back;
7. writes `spotify-status.json`;
8. reports COMPLETE only when the configured state matches.

It never searches Spotify by playlist name and never invokes generative playlist creation.

Spotify access does not provide raw audio or lawful waveform analysis to this repository. Any future audio-analysis feature must use audio the user lawfully owns or has permission to process; it must never capture or transfer Spotify streams.

## 6. Journey-map generation

`.github/workflows/build-journey-map.yml` generates the compact and Sites-ready map.

It:

1. reads `ledger.md` and `journey-annotations.json`;
2. obtains track durations from Spotify metadata when credentials are available;
3. falls back safely when duration metadata is unavailable;
4. keeps editorial story height separate from measured BPM;
5. writes `journey-map.json` and `journey-map.svg`;
6. commits only generated outputs.

The compact SVG is appended after `EDITORIAL NOTE` in each editorial-run response. It does not create a sixth numbered section.

The detailed interactive map is intentionally not deployed to a temporary replacement site. `sites-prompt.md` is ready for ChatGPT Sites when Sites is available to the user's region and creation surface.

## 7. Create the recurring ChatGPT task

The task is account-specific. In a ChatGPT conversation with GitHub connected, ask:

```text
Use the scheduler skill in .agents/skills/scheduler/SKILL.md to create a daily recurring task for playlists/groove-over-noise/ at 08:00 in my timezone.
```

Use one orchestrator task, not separate tasks for individual skills.

The task must:

- read repository-level `AGENTS.md`;
- read `automation.md` and `feedback-protocol.md`;
- load skills from `.agents/skills/*/SKILL.md`;
- treat GitHub as the source of truth;
- clarify listener complaints before changing the affected region;
- distinguish measured evidence, craft convention, listener report, and editorial interpretation;
- update `journey-annotations.json` with approved journey changes;
- update persistent state only after audit approval;
- never use ChatGPT's Spotify connector for publication;
- read `spotify-status.json` for publication status;
- append the current `journey-map.svg` after the fifth section.

## 8. First production run

After both GitHub Actions secrets exist:

1. open the repository's **Actions** tab;
2. choose **Publish Spotify playlist** and run it;
3. choose **Build GROOVE OVER NOISE journey map** and run it if no map exists yet;
4. verify that `spotify-status.json` becomes `COMPLETE`;
5. verify that `journey-map.json` and `journey-map.svg` exist;
6. open only the canonical playlist URL recorded in the status file.

## Portability boundary

The repository preserves skills, playlist constitutions, ledgers, history, listener-feedback state, visualization annotations, Sites prompt, orchestration instructions, publisher code, and playlist identity.

It does not preserve another user's ChatGPT task, connector authorization, Spotify refresh token, timezone, notification preferences, or ChatGPT Sites availability.
