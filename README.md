# Editorial Engine

A persistent, versioned editorial system for curated playlists.

The repository is the source of truth. Spotify is the publication target.

## Current playlist

- [`GROOVE OVER NOISE`](playlists/groove-over-noise/)

## Workflow

1. Read the playlist constitution.
2. Read the canonical ordered ledger.
3. Review prior discoveries, rejections, and editorial notes.
4. Curate new candidates.
5. Update the ledger and append the daily decision record.
6. Sync to Spotify when editing is available.

## Decision vocabulary

- **ADD** — belongs in the canonical playlist now.
- **REVISIT** — promising, but a specific uncertainty remains.
- **REJECT** — does not strengthen the playlist identity.

## Playback model

The ledger is sequenced as a long-form listening journey, not as a live DJ set. Beatmatching and harmonic mixing are not assumed. Spotify Mix may alter the intended sequence and should be used only when discovery is preferred over the curated journey.
