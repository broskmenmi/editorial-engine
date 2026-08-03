# GROOVE OVER NOISE — Journey Map Specification

## Purpose

The journey map makes the playlist's long-form structure visible without pretending that editorial interpretation is measured audio analysis.

It has two layers:

1. **Story landscape** — an ordinal editorial interpretation of arrival, builds, crests, releases, the main summit, decompression, and dissolution.
2. **Measured BPM line** — the actual tempo trajectory shown separately beneath the story landscape.

The two lines must never be merged into one “energy score.”

## Compact map

The compact map is generated as:

```text
playlists/groove-over-noise/journey-map.svg
```

It is intended for the end of every editorial-run response.

### Compact-map contents

- time-scaled horizontal axis using Spotify track durations when available;
- chapter bands;
- editorial story curve;
- measured BPM curve;
- numbered track markers;
- labels for opener, important crests, main summit, closer, and latest additions;
- protected anchors and handoffs;
- provisional roles;
- frozen listener-discussion regions;
- a clear note that story height is editorial, not measured audio energy.

### Status language

- **Protected:** directly supported by positive listener evidence or explicit protection.
- **Accepted:** current canonical placement.
- **Provisional:** current placement with an editorial interpretation that may be reopened naturally.
- **Frozen:** part of an unresolved listener-feedback discussion; no changes allowed without clarification and approval.

## Detailed Sites experience

The detailed interactive map will be built with ChatGPT Sites when Sites becomes available for the user's region and creation surface.

Until then, GitHub holds the complete Sites-ready source:

```text
playlists/groove-over-noise/journey-map.json
playlists/groove-over-noise/journey-annotations.json
playlists/groove-over-noise/sites-prompt.md
```

The detailed Site must not become a second source of truth. It reads the generated JSON; GitHub's ledger and annotations remain authoritative.

## Detailed interaction model

### Default view

- full journey landscape across actual elapsed time;
- chapter bands and labels;
- story curve and BPM curve independently switchable;
- protected, provisional, frozen, and recently changed states;
- current duration, track count, and BPM range.

### Track interaction

Tapping a track opens a drawer with:

- position;
- track and artist;
- Spotify link;
- BPM;
- duration;
- elapsed start and end time;
- structural role;
- chapter;
- evidence status;
- protected or provisional state;
- related listener feedback when present;
- transition into and out of the track;
- BPM deltas to both neighbours.

### Chapter interaction

Tapping a chapter zooms to that region and lists:

- chapter purpose;
- local crest or release points;
- duration;
- tracks in order;
- current uncertainties;
- any frozen region.

### Discussion interaction

Frozen regions appear with restrained amber outlines. They show:

- exact listener wording;
- current published sequence;
- external candidate tracks under discussion;
- status such as `AWAITING CLARIFICATION`;
- no edit controls.

The Site visualizes state; it does not make editorial decisions or modify Spotify.

## Visual identity

Match the canonical cover:

- black and charcoal base;
- graphite texture;
- steel-grey contour lines;
- restrained deep-blue protected elements;
- amber only for unresolved discussion regions;
- minimal labels and generous negative space;
- architectural and topographic rather than factory-industrial;
- no neon cyberpunk styling;
- no generic analytics-dashboard appearance.

## Responsive behaviour

### Phone

- horizontal pan and pinch zoom;
- sticky chapter mini-map;
- tap targets at least 44 px;
- track details in a bottom sheet;
- story and BPM toggles above the map;
- no hover-only information.

### Desktop

- full-width landscape;
- hover preview plus click drawer;
- optional chapter overview rail;
- keyboard navigation between tracks.

## Evidence boundary

The Site must label data accurately:

- BPM and duration are measured metadata.
- Story height, crest, summit, release, and chapter are editorial interpretations.
- Listener wording is attributed as listener evidence.
- The Site must never claim waveform, loudness, mood, or energy analysis unless a lawful future audio-analysis source is explicitly present in the JSON.

## Update lifecycle

1. Librarian updates `ledger.md` and `journey-annotations.json` in the approved editorial change set.
2. GitHub Action runs `apps/journey-map/src/index.js`.
3. The app reads the ledger, annotations, and Spotify duration metadata.
4. The app writes `journey-map.json` and `journey-map.svg`.
5. The compact SVG appears at the end of editorial-run responses.
6. The future Site reads `journey-map.json` and updates without becoming authoritative.

## Scaling

The compact map keeps all tracks as numbered points but labels only key tracks.

The detailed Site must remain usable beyond 100 tracks through:

- time-based zoom;
- chapter filtering;
- label collision avoidance;
- virtualized track lists;
- overview and detail modes;
- preserved full-journey context while zoomed.
