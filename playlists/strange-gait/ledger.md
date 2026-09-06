# STRANGE GAIT — Canonical Ledger

> This ordered ledger is the source of truth for STRANGE GAIT.

| # | Artist | Track | Spotify URI | BPM | Decision | Structural role | Added |
|---:|---|---|---|---:|---|---|---|
| 1 | Inigo Kennedy | Marauder | spotify:track:4YhLd9gtkp0vLWu4RNJ716 | 136 | ADD | Ground — provisional opening anchor | 2026-09-05 |
| 2 | Inigo Kennedy | The Witching Hour | spotify:track:6zBPgkGHHiZfxg5eSjSCRd | 136 | ADD | Ground — provisional controlled continuation | 2026-09-06 |
| 3 | Rene Wise | Cave | spotify:track:2Z0j3jb573fveL4Pf3NkP1 | 134 | ADD | Ground — provisional widening move | 2026-09-06 |
| 4 | Sciahri | Too Much Time | spotify:track:7db90RzgCxJSu9XzKJhxKO | 140 | ADD | Ground — provisional physical widening | 2026-09-06 |
| 5 | Sciahri | Moonwake | spotify:track:3Hyop0Bj9V3eCSFT6Hbe6j | 140 | ADD | Ground — provisional intensification | 2026-09-06 |
| 6 | Nørbak | Capa | spotify:track:5np6Qsak6d5kIdkktjblRB | 137 | ADD | Tilt — provisional rhythmic redirection | 2026-09-06 |
| 7 | Jayson Wynters | Tehutis Law | spotify:track:79yeMWxkbiNZ4su5UuhS6z | 139 | ADD | Tilt — provisional funk re-grounding | 2026-09-06 |
| 8 | CHANCEKNOT | Fragments | spotify:track:3wsskKLpimIuiDDCb6eHVv | 140 | ADD | Tilt — provisional driving re-escalation | 2026-09-06 |
| 9 | Inspired Groove | Truth in Noise | spotify:track:12xuyGHICBNwJnQYqBlKcY | 138 | ADD | Tilt — provisional groove consolidation | 2026-09-06 |
| 10 | Linear System | Transparency | spotify:track:6vBGCwTYRiKYCDD52zXZtf | 143 | ADD | Tilt — provisional listener-block opener | 2026-09-06 |
| 11 | Ignez | When We Froze | spotify:track:1POzqasdMpIDgI4gQSdPrV | 140 | ADD | Tilt — listener-confirmed internal continuation | 2026-09-06 |
| 12 | Len Faki | Stardancer | spotify:track:6i3HRqnSMoSohzwSgq035u | 137 | ADD | Tilt — listener-confirmed block close | 2026-09-06 |

## Current state

**ACTIVE EXPANSION — 12 canonical tracks.**

Run `2026-09-06T19:12:00Z-repair-listener-trio-30` resolved the intentional Spotify/ledger divergence created by the listener-added trio Linear System — Transparency → Ignez — When We Froze → Len Faki — Stardancer. All three exact Spotify identities resolved and are KEPT in the listener's existing end-of-playlist order.

The user directly reports that the three tracks come in "perfect harmony" in this exact order when using Spotify Mix. That report earns protection for the two internal handoffs `Transparency → When We Froze` and `When We Froze → Stardancer`. It does not establish `Truth in Noise → Transparency`, so that entry remains provisional and unprotected.

All twelve tracks remain provisional as individual tracks. The two listener-confirmed internal handoffs are protected; no ending is protected.

Transparency uses 143 BPM as the working canonical tempo because independent SongData/DJ-pool metadata report 143 BPM, while Beatport reports a conflicting 107 BPM. The conflict remains explicitly documented; tempo does not supply the placement rationale.

## Next structural need

No actionable REPAIR remains. Fresh EXPLORE should preserve the protected three-track internal order and test what follows Stardancer. The trio may move as an intact block later if stronger long-form placement evidence emerges, but its internal order should not be broken without new listener evidence or explicit user instruction.

## Current measured / working tempo trajectory

`136 → 136 → 134 → 140 → 140 → 137 → 139 → 140 → 138 → 143* → 140 → 137 BPM`

`* Transparency tempo conflict preserved: independent sources 143 BPM; Beatport 107 BPM.`
