# ChatGPT Sites Build Prompt — GROOVE OVER NOISE Journey Map

Use this prompt with `@Sites` when ChatGPT Sites becomes available for this account and region.

---

Build a responsive interactive website called **GROOVE OVER NOISE — Journey Map**.

## Source of truth

Read these public GitHub files from repository `broskmenmi/editorial-engine`:

- `playlists/groove-over-noise/journey-map.json`
- `playlists/groove-over-noise/journey-map-spec.md`

The generated `journey-map.json` is the only runtime data source for the Site. Do not invent tracks, roles, chapters, durations, evidence, listener feedback, or Spotify links. Do not modify GitHub or Spotify.

## Purpose

Visualize a long-form techno playlist as two distinct layers:

1. **Editorial story landscape** — arrival, builds, local crests, releases, re-entry, main summit, decompression, and dissolution.
2. **Measured BPM trajectory** — shown separately and clearly labeled as metadata.

Never present story height as measured audio energy, mood, loudness, waveform analysis, or scientific fact.

## Visual direction

Match the GROOVE OVER NOISE cover identity:

- square-cover visual language expanded into a landscape;
- black and charcoal background;
- graphite and subtle concrete texture;
- layered topographic contour lines;
- steel-grey typography;
- restrained deep-blue protected elements;
- amber only for frozen listener-discussion regions;
- architectural, bodily, precise, spacious;
- no factory imagery;
- no cyberpunk neon;
- no generic business-dashboard styling.

## Main screen

Create a full-width time-scaled journey map.

Show:

- chapter bands;
- smooth editorial story curve;
- separately toggleable BPM curve;
- track markers positioned by actual elapsed time;
- protected, accepted, provisional, and frozen states;
- opener, local crests, main summit, closer, and latest additions;
- total duration, track count, and BPM range;
- a persistent note: **Story height is editorial, not measured audio energy.**

## Phone-first interaction

The primary user uses a Samsung Galaxy phone.

- support horizontal pan and pinch zoom;
- use a sticky mini-map or overview rail;
- use tap targets of at least 44 px;
- open track details in a bottom sheet;
- never rely on hover;
- keep chapter and curve toggles thumb-friendly;
- maintain excellent performance with 100+ tracks.

## Track detail sheet

On track tap, show only data present in JSON:

- position;
- track and artist;
- Spotify link;
- BPM;
- duration;
- elapsed start and end time;
- structural role;
- chapter;
- story band;
- accepted/provisional/protected/frozen state;
- labels;
- transition BPM deltas to neighbours;
- relevant discussion status when present.

## Chapter view

Allow chapter selection and zoom.

Show:

- chapter label and duration;
- ordered tracks;
- crest, release, re-entry, summit, or dissolution points;
- protected and frozen elements;
- a button to return to the full journey.

## Discussion regions

Render `discussions` as restrained amber overlays.

Show:

- status;
- label;
- frozen canonical tracks;
- external candidates;
- no edit or approval controls.

The Site visualizes the discussion state; the conversation and GitHub workflow govern decisions.

## Accessibility

- WCAG AA contrast;
- keyboard navigation on desktop;
- reduced-motion mode;
- text alternatives for the map;
- screen-reader track list in canonical order;
- do not communicate state by color alone.

## Technical behaviour

- fetch the GitHub JSON on load;
- show a clear stale-data or load-error state;
- cache carefully but support refresh;
- never expose credentials;
- do not require a backend;
- do not use Spotify embeds for the full map;
- use the exact Spotify links already present in JSON;
- preserve canonical order exactly.

## Pages

Create:

1. **Journey** — the full interactive map.
2. **Tracks** — searchable canonical track list with filters for chapter and state.
3. **Doctrine** — a short plain-English explanation of measured evidence versus editorial interpretation, sourced from the JSON and map specification.
4. **About the map** — legend, evidence boundaries, and update timestamp.

## Final result

The Site should feel like an interactive extension of the GROOVE OVER NOISE cover: elegant enough to explore for pleasure, precise enough to understand the playlist architecture, and honest about which parts are measured and which parts are editorial interpretation.

---
