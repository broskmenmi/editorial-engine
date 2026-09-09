# Editorial Engine — Felt Visualization & Techno Learning Doctrine

This is the **default visualization and learning contract for every canonical playlist volume** in the editorial engine.

The purpose is not to turn taste into fake measurements. The purpose is to make the musical journey easier to perceive, discuss, and learn from.

## Core principle

**Visualize what happens to the listener, and explain the musical mechanism that may be causing it.**

A playlist graph that merely plots chapter labels or one scalar "energy" value is not enough. Techno can become less dense while more tense, less regular while more propulsive, quieter while more psychologically pressurized, or slower in BPM while feeling faster in the body.

Therefore there is no universal energy axis.

## Default view — Felt map

Every canonical volume uses a **felt map** as its default visualization. Playlist-specific story/chapter models remain available as secondary structure lenses.

The felt map should answer, at a glance:

- What kind of bodily or attentional state are we in?
- What changes as we cross this track or transition?
- Where does the pulse stabilize, bend, disappear, return, or mutate?
- Where does pressure accumulate or release?
- Where does the music open space or compress attention?
- What does this moment do to the whole journey?

The primary visual language is **direction and state change across time**, not a high-is-good graph.

## Three musical layers plus tempo

### 1. Felt state

Use only when evidence supports the description:

- **pressure** — compressed / held / released / unknown;
- **propulsion** — pulls forward / suspends / recedes / unknown;
- **openness** — opens / holds / narrows / unknown;
- **tension** — accumulates / holds / resolves / unknown;
- **temperature** — colder / warmer / mixed / unknown.

These are qualitative listener-facing dimensions, not scientific measurements.

### 2. Groove mechanics

Explain the bodily mechanism beneath the feeling when evidence supports it:

- **pulse clarity** — obvious, obscured, displaced, re-established;
- **swing** — straight, swung, staggered, unknown;
- **rhythmic stability** — stable, mutating, fractured, re-centered;
- **density** — sparse, layered, crowded, unknown;
- **weight distribution** — kick-led, percussion-led, bass-led, diffuse, unknown.

Never derive these from BPM, genre tags, artist reputation, or Spotify metadata alone.

### 3. Structure

Describe how the track changes over time or what it does in sequence:

- **continuity**;
- **mutation**;
- **interruption**;
- **arrival**;
- **release**.

Playlist-specific chapters, roles and story vocabularies belong here. They are secondary explanatory lenses, not mandatory sequencing templates.

### 4. Tempo metadata

BPM and duration remain measured metadata on their own layer. They must never be merged into felt state, groove, pressure, or energy.

## Transitions are vectors, not lines

A transition should communicate **what changes**, not merely that Track A connects to Track B.

Useful vector language includes:

- pulse clarifies;
- groove bends;
- pressure accumulates;
- space opens;
- rhythm fragments;
- body re-centers;
- tension remains while the production world changes;
- a stable grammar is deliberately interrupted.

A hard left turn may be a strong vector. A smooth blend may be a weak one.

## Five-track window and whole-journey context

When a canonical ADD occurs, the primary musical reading must inspect:

`two tracks before → new track → two tracks after`

At playlist boundaries, use the available neighbours.

The visualization and report should explain:

1. the new track's own musical direction;
2. the immediate incoming and outgoing change;
3. what the surrounding three-to-five-track run does to body and attention;
4. what the insertion changes in the complete playlist.

The goal is not merely to justify admission. It is to teach the user how to hear the sequencing decision.

## Techno learning objective

Every editorial-run report begins with an unnumbered **MUSICAL READING** before workflow statistics.

When there is an ADD, MUSICAL READING starts with the added track and its five-track window. When there is no ADD, it starts with the strongest musical question exposed by the run or the current journey state.

Teach one or more concrete techno concepts when relevant, for example:

- why equal BPM does not mean equal perceived speed;
- how subdivision changes propulsion;
- how swing changes bodily placement of the beat;
- how kick removal can increase tension;
- how repetition becomes functional rather than static;
- how broken rhythm can preserve forward motion;
- how density and pressure differ;
- how a reset can strengthen a later return;
- how structural mutation changes the meaning of a transition;
- why contrast can create stronger continuity than sonic sameness.

Do not turn reports into music-history lectures unless history is directly useful to the musical point.

## Evidence boundary

Every felt or mechanical statement needs provenance. Supported evidence classes are:

1. `LISTENER_REPORT` — volunteered listener experience of the actual music or sequence;
2. `MEASURED_AUDIO` — lawful audio-derived evidence with tool/version/provenance;
3. `ATTRIBUTED_SOURCE_DESCRIPTION` — artist, label, reviewer or release description;
4. `EDITORIAL_INTERPRETATION` — an explicitly identified hypothesis from sequencing evidence;
5. `UNKNOWN` — no lawful support.

`EDITORIAL_INTERPRETATION` may be useful and visible, but it must not masquerade as listening, measurement, or fact.

**UNKNOWN is a real visual state.** Blank/unknown dimensions are preferable to invented precision.

## No fake scalar scores

Do not create arbitrary 1–10 energy, darkness, hypnosis, density, warmth, or mixability scores merely to make a chart look complete.

A numeric value is allowed only when the number itself is lawful evidence with defined provenance and semantics. Qualitative directional language is the default.

## Canonical annotation shape

Playlist `journey-annotations.json` may add a `felt` object to any canonical track. Missing `felt` data is valid.

Recommended shape:

```json
{
  "felt": {
    "summary": "Short evidence-bound description of what changes here.",
    "direction": "stagger → reset",
    "dimensions": {
      "pressure": { "value": "holds", "evidenceClass": "EDITORIAL_INTERPRETATION" },
      "pulseClarity": { "value": "displaced", "evidenceClass": "ATTRIBUTED_SOURCE_DESCRIPTION" }
    },
    "evidence": {
      "class": "EDITORIAL_INTERPRETATION",
      "note": "Exact reason and provenance."
    }
  }
}
```

Do not populate unsupported dimensions just because the schema exists.

When no explicit `felt.direction` exists, visualization tooling may present an existing editorial role/label as a fallback **editorial direction phrase**, but it must identify the provenance as editorial and must not silently promote that phrase into a felt measurement.

## Compact map

`journey-map.svg` is a compact **direction ribbon** by default:

- horizontal time remains real elapsed time where available;
- track order is exact;
- track blocks show concise evidence-bound direction language;
- protected/frozen/provisional states remain visible;
- playlist-specific structure is secondary;
- BPM remains a separate measured lane;
- no vertical coordinate may imply energy unless a future explicit evidence contract defines it.

## Detailed site

The single read-only site remains:

`https://broskmenmi.github.io/editorial-engine/`

Each playlist subsection loads its own `journey-map.json`. Default interaction is the felt map with switchable **Feeling**, **Groove**, **Structure**, and **Tempo** views.

Selecting a track should expose the five-track context, whole-journey position, evidence provenance, and a concise techno-learning explanation.

The site remains derivative and read-only. GitHub canonical state remains authoritative.

## Future volumes

This doctrine is inherited automatically by every future canonical playlist volume unless the user explicitly requests a different visualization form.

A volume may choose its own visual identity and vocabulary, but it does not revert to a generic scalar energy graph by default.
