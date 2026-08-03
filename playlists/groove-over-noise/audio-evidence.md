# GROOVE OVER NOISE — Audio Evidence Contract

This file defines the evidence layer beneath the editorial doctrine. It does not authorize playlist changes.

## Authority

Audio analysis is evidence, not a verdict.

The authority order remains:

1. explicit user instructions and volunteered listener experience;
2. the GROOVE OVER NOISE constitution and approved editorial state;
3. sourced lawful audio measurements and model-derived analysis;
4. craft convention and editorial hypothesis.

DJOID, rekordbox, or another analyser may act as a sensor and candidate generator. No tool score may bypass evaluation, audit, the feedback protocol, or explicit approval.

## Lawful inputs

Accept only:

- audio files the user owns or is authorized to analyse;
- exports produced by the user's DJ software or analysis tools;
- measurements from a documented lawful source.

Spotify Web API metadata is not raw audio. Never claim that it exposes waveforms, phrase structure, density, mix points, emotion, or energy trajectory.

## Required provenance

Every stored field must include:

- exact Spotify track URI or another stable identity;
- source type;
- source name;
- tool and version when applicable;
- captured or analysed timestamp;
- evidence class: `measured` or `model-derived`;
- confidence or tool-reported reliability;
- units, scale, and range when numeric;
- optional method notes.

Unknown values remain absent. They are never written as zero, neutral, or inferred.

## Permitted track fields

Examples include:

- BPM and beat-grid confidence;
- key and mode;
- phrase and section boundaries;
- possible mix-in and mix-out regions;
- spectral density;
- rhythmic density;
- vocal presence;
- energy trajectory;
- embedding or fingerprint identifiers;
- model-derived danceability, emotion, genre, or similarity.

The last group must always remain explicitly model-derived.

## Permitted transition fields

A transition record may contain:

- source and destination track identities;
- harmonic relation;
- BPM relation and tempo adjustment;
- phrase alignment;
- overlap window;
- vocal collision risk;
- spectral or rhythmic collision risk;
- continuity or contrast scores;
- intended transition character;
- confidence and provenance.

Compatibility is directional: A → B is not assumed equal to B → A.

## Ingestion rule

Tool-assisted evidence ingestion is retained.

An import must preserve the tool's original vocabulary and scale. Do not translate “energy,” “emotion,” “danceability,” or “compatibility” into listener experience. Conflicting tools may coexist; do not average them unless the method is documented.

Importing evidence does not mutate `ledger.md`, `journey-annotations.json`, Spotify, `under-review.md`, or accepted/rejected state.

## Evaluation use

Audio evidence supports two distinct questions:

1. Does the track belong somewhere in GROOVE OVER NOISE?
2. Does it work between these exact neighbours?

It may narrow searches, expose risk, suggest a different placement, or populate a live-performance edge. The Evaluator and Auditor still decide how much weight it deserves.

## Registry

`audio-evidence.json` is the machine-readable registry. Its empty initial state is intentional: no audio-derived facts have yet been imported under this contract.
