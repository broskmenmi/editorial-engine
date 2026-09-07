# DISCOVERY POOL — Automation Contract

This is a global utility playlist and has no standalone recurring task.

## Harvest rule

After an editorial run is audited, if an exact Spotify track is explicitly retained as genuinely interesting, add it to `playlists/discovery-pool/ledger.md` when absent. This applies across all canonical volumes and regardless of canonical ADD / REVISIT / placement-specific REJECT outcome.

Do not harvest unresolved research leads, release watches, duplicate identities, resolver errors, or tracks that were merely inspected and discarded.

## Publication

`playlists/discovery-pool/ledger.md`, `spotify.json`, and `cover.jpg.base64` are publication inputs. Repository-root `publication.json` controls automatic publication exactly as for other Spotify targets.

The utility ledger is unordered by design. Its row sequence is append history only and must never trigger Sequencer or journey-map logic.

The publisher must verify exact membership against the utility ledger. Spotify UI sorting remains user-controlled presentation and does not change repository state.
