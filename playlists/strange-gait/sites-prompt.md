# Unified Journey Site Subsection Brief — STRANGE GAIT

STRANGE GAIT is a read-only subsection of the single published editorial journey site:

`https://broskmenmi.github.io/editorial-engine/`

Do not create or maintain a separate playlist-specific website or hostname.

## Source of truth

Render from generated `playlists/strange-gait/journey-map.json`.

GitHub remains authoritative. The site must never edit the ledger, make editorial decisions, or publish Spotify.

## Shared-site behaviour

- One global site shell and one canonical root URL.
- STRANGE GAIT appears as its own named subsection alongside GROOVE OVER NOISE.
- Playlist navigation stays inside the shared page; ordinary in-page anchors are fine.
- Each playlist subsection loads its own JSON independently.
- A load failure in another playlist must not suppress STRANGE GAIT.

## Experience

The STRANGE GAIT subsection shows the full journey across actual elapsed time with independent toggles for:

- rhythmic story/displacement curve;
- measured BPM;
- chapter bands;
- protected, provisional and frozen states.

Track interaction shows position, artist/track, Spotify link, BPM, duration, chapter, structural role, evidence status, and transition deltas to existing neighbours.

The track list should be collapsible on mobile so the shared site remains compact even as multiple playlists grow.

## Story model

The visualization may use the STRANGE GAIT story vocabulary:

`Ground → Tilt → Lock → Fracture → Deep Lock → Escape`

This is an editorial visualization vocabulary, not a required mechanical progression for playlist sequencing.

## Evidence labels

- BPM and duration: measured metadata.
- Story height, tilt, lock, fracture and escape: editorial interpretation.
- Listener wording: attributed listener evidence.
- Never claim waveform, energy, loudness, mood or microtiming analysis unless lawful sourced audio evidence is actually present.

## Visual identity

Within the shared site shell: graphite-black field, off-grid architectural lines, bone/steel type, bruised-violet displacement accents, sparse oxidized-copper fracture markers. Mobile-first. No neon, equalizer graphics, literal feet or generic SaaS dashboard styling.

The subsection should remain visually related to GROOVE OVER NOISE so the overall experience feels like one editorial system, not separate microsites.
