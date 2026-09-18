# Lease-a-Fleece — brand assets

## The mark

A folded fleece whose curled corner also reads as a contract page. The dotted
inset hem is the blanket-stitch edging on the real units. Textile and contract
in one form.

| File | Use |
|---|---|
| `logo-horizontal.svg` | Primary lockup. Default choice. |
| `logo-stacked.svg` | Where width is tight — avatars, square placements. |
| `mark.svg` | Mark alone. Favicon, app icon, anywhere the name is already present. |
| `seal-40.svg` | **Anniversary only.** Secondary mark, retires after 2026. |

Wordmark text in the lockups is outlined, so they need no fonts installed.
`mark.svg` uses `currentColor` in-app (`components/mark.tsx`); the standalone
file is fixed ink.

## Rules

- Clear space around the lockup: at least the height of the mark.
- Minimum sizes: mark 20px, horizontal lockup 180px wide.
- Never stretch, recolour to anything outside the palette, or add effects.
- The seal is not the logo. It marks forty years and then it stops.

## Palette

| Token | Hex | Role |
|---|---|---|
| Ink | `#171a14` | Type and marks |
| Bone | `#f4f1ea` | Page ground |
| Paper | `#fbfaf6` | Raised panels |
| Stone | `#6e6e62` | Secondary type |
| Line | `#dcd7ca` | Hairline rules |
| Olive | `#4a5233` | Accent, sampled from the Fjord unit |

## Type

- **Fraunces** — display (`SOFT 40`, `WONK 1`)
- **Karla** — body
- **IBM Plex Mono** — the register layer: asset codes, dimensions, availability
