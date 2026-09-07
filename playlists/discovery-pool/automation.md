# DISCOVERY POOL — Automation Contract

This is a global utility playlist and has no standalone recurring task.

## Harvest rule

After an editorial run is audited, if an exact Spotify track is explicitly retained as genuinely interesting, add it to `playlists/discovery-pool/ledger.md` when absent. This applies across all canonical volumes and regardless of canonical ADD / REVISIT / placement-specific REJECT outcome.

Do not harvest unresolved research leads, release watches, duplicate identities, resolver errors, or tracks that were merely inspected and discarded.

## Publication

`playlists/discovery-pool/ledger.md`, `spotify.json`, and `cover.jpg.base64` are publication inputs. Repository-root `publication.json` controls automatic publication exactly as for other Spotify targets.

The utility ledger is unordered by design. Its row sequence is append history only and must never trigger Sequencer or journey-map logic.

The publisher must verify exact membership against the utility ledger. Spotify UI sorting remains user-controlled presentation and does not change repository state.

## Run reporting

When a canonical editorial run changes this global ledger, the same user-facing run report must make the utility change visible rather than saying it was merely handled separately.

Report:

- the public name `EDITORIAL ENGINE — DISCOVERY POOL`;
- its Spotify URL from `spotify-status.json` or `spotify.json` playlist identity;
- the before → after utility track count;
- exact publication status and `verifiedAt` from `playlists/discovery-pool/spotify-status.json` after the normal bounded finalization wait.

If verification is still pending or failed, report that accurately. Never claim a new live verification from an unchanged status file. This reporting requirement does not add a sixth numbered section to a volume workflow; place it inside that workflow's existing Spotify-status or discovery-harvest reporting surface.
