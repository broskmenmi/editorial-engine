# Unified Journey Site Subsection Brief — GROOVE OVER NOISE

GROOVE OVER NOISE is a read-only subsection of the single published editorial journey site:

`https://broskmenmi.github.io/editorial-engine/`

Do not create or maintain a separate playlist-specific website or hostname.

## Source of truth

Read these public GitHub files from repository `broskmenmi/editorial-engine`:

- `playlists/groove-over-noise/journey-map.json`
- `playlists/groove-over-noise/journey-map-spec.md`

The generated `journey-map.json` is the runtime data source for this subsection. Do not invent tracks, roles, chapters, durations, evidence, listener feedback, or Spotify links. Do not modify GitHub or Spotify.

## Purpose

Visualize the playlist as two distinct layers:

1. **Editorial story landscape** — arrival, builds, local crests, releases, re-entry, main summit, decompression, and dissolution.
2. **Measured BPM trajectory** — shown separately and clearly labeled as metadata.

Never present story height as measured audio energy, mood, loudness, waveform analysis, or scientific fact.

## Shared-site behaviour

- The site has one global shell and one canonical URL.
- GROOVE OVER NOISE appears as its own clearly named subsection alongside other playlists.
- Playlist navigation must not navigate to a separately hosted site.
- Deep links may use ordinary in-page anchors, but the canonical site remains the root URL.
- Each playlist subsection fetches and renders its own `journey-map.json` independently.
- Failure to load one playlist must not suppress other playlist subsections.

## Visual direction

Within the shared shell, preserve GROOVE OVER NOISE's identity:

- black and charcoal background;
- graphite / subtle concrete feel;
- steel-grey typography;
- restrained deep-blue protected elements;
- amber only for frozen listener-discussion regions;
- architectural, bodily, precise, spacious;
- no factory imagery;
- no cyberpunk neon;
- no generic business-dashboard styling.

The global site should remain visually coherent with STRANGE GAIT rather than feeling like two unrelated microsites pasted together.

## Subsection contents

Show:

- playlist title and short description;
- track count, mapped duration, BPM range and update timestamp;
- time-scaled journey map;
- independently toggleable editorial story and BPM layers;
- chapter bands;
- protected, accepted, provisional and frozen states;
- ordered canonical track list;
- track details on interaction;
- a persistent evidence-boundary note.

## Phone-first interaction

- mobile-first layout;
- horizontal pan for the map rather than forcing the entire journey into phone width;
- tap targets of at least 44 px;
- no hover-only information;
- thumb-friendly layer controls;
- collapsible track list to avoid an unnecessarily huge default page;
- sticky or easily reachable playlist navigation.

## Track detail

On track interaction show only data present in JSON:

- position;
- track and artist;
- Spotify link;
- BPM;
- duration;
- structural role;
- chapter;
- story band/state;
- labels;
- transition BPM deltas;
- protected/frozen status where present.

## Accessibility

- WCAG AA contrast;
- keyboard-operable interactive chart points;
- reduced reliance on color alone for state;
- clear text track list in canonical order;
- no essential hover interactions.

## Technical behaviour

- fetch GitHub JSON on load;
- preserve canonical order exactly;
- show a clear load-error state per subsection;
- never expose credentials;
- require no backend;
- use exact Spotify links already present in JSON;
- remain read-only.

## Final result

The site should feel like one editorial system containing multiple distinct playlist journeys. GROOVE OVER NOISE keeps its own story and visual accent, but not its own website.
