# Print artwork

## Sewable patch — 150 × 200 mm

Two patches, one per unit: `fjord` (olive) and `aurora` (ivory).

## Print these

| File | Use |
|---|---|
| `a4-fjord.pdf` / `a4-aurora.pdf` | **Print these.** A4 page, patch centred at true size, crop marks, instructions in the margin. |
| `patch-fjord.pdf` / `patch-aurora.pdf` | Exact 150 × 200 mm page. For a print shop that wants trim size only. |
| `patch-*.svg` | Editable source. |
| `gen.py` | Regenerates everything. `python3 gen.py "NAME"`. |

**Print at 100%.** In the print dialog choose *Actual size* / *100%*, never
"Fit to page" or "Shrink to printable area" — those silently scale the artwork
and the patch comes out undersized.

Text is converted to outlines, so no fonts need to be installed anywhere.

## Cutting and sewing

- **Solid rounded border** — the cut line.
- **Dashed inner line** — the sewing line, 7 mm inside the edge. That margin is
  what your stitches pass through.

## The QR code

44 mm, error-correction level Q (25% of the code can be damaged or obscured and
it still resolves). **Each patch carries its own code**, pointing at that unit's
title record:

| Patch | Resolves to |
|---|---|
| `fjord` | `lease-a-fleece.com/verify/LAF-U-001` |
| `aurora` | `lease-a-fleece.com/verify/LAF-U-002` |

So "SCAN TO VERIFY TITLE" on the patch does what it says — it produces a record
naming the lessor, the lessee and the disposition of the asset.

The URL is encoded in uppercase deliberately: that puts the QR into alphanumeric
mode, which needs fewer modules, so each module is physically larger and
survives printing on fabric. URL schemes and domains are case-insensitive, so it
opens normally.

Verified to decode from the PDF at 300 dpi and 150 dpi, and from simulated
photos of fabric with blur, noise and tilt up to 10°.

## Transfer medium

Mirroring is handled by the printer software, so these files read normally — do
not mirror them yourself.

Test on paper first and measure the patch with a ruler: it should be exactly
150 × 200 mm. If it isn't, the print dialog scaled it.


---

## Wrapper band — 115 × 297 mm

A belly band for a rolled unit, replacing the retail packaging. Generic: no
lessee name, no unit code, so one design serves both blankets and needs no
reprint if it moves between them.

| File | Use |
|---|---|
| `wrapper-a4.pdf` | **Print this.** A4 portrait, strip centred, crop marks, instructions in the margin. |
| `wrapper.pdf` | Exact 115 × 297 mm trim. For a print shop. |
| `wrapper-flat.pdf` | The same artwork unrotated, 297 × 115 mm — for looking at, not for printing. |
| `wrapper.py` | Regenerates all three. |

### How it wraps

The **297 mm runs around** the roll and the **115 mm is the band width**, so the
artwork is rotated 90° on the printed strip. Wrapped, the wordmark reads
horizontally along a horizontally-held roll — the way the original packaging did.

### The one real constraint

The strip is exactly A4 height, and home printers cannot print to the paper
edge — expect 5–15 mm of unprintable margin at each end.

- **Borderless printing**, if your printer has it, gives the full 297 mm.
- **Otherwise** you lose a few mm at each end. No artwork is lost: all content
  sits between 20 mm and 290 mm, and the two horizontal rules are meant to run
  off the ends. But the band comes out correspondingly shorter, so check it
  still closes around the roll before trimming the second one.
- If it will not close, print on A3 and trim, or join with a short taped overlap
  at the back where it will not be seen.

The QR resolves to the homepage — deliberately not a title record, since this
band is not tied to a specific unit.


---

## Care label — 40 × 50 mm

Sewn into a seam. Generic: no lessee name, so one design serves both units.

| File | Use |
|---|---|
| `label-a4.pdf` | **Print this.** 20 labels per A4 sheet with cut guides. |
| `label.pdf` | A single label at exact 40 × 50 mm trim. |
| `label.py` / `symbols.py` | Regenerate. Care symbols are drawn as paths in `symbols.py`. |

### The symbols

Standard ISO 3758 / GINETEX marks, drawn as vector paths rather than a font, so
nothing needs installing:

| Symbol | Meaning |
|---|---|
| Washtub, 40 | Machine wash at 40 °C |
| Triangle, crossed | Do not bleach |
| Square with circle, crossed | Do not tumble dry |
| Iron, crossed | Do not iron |
| Circle, crossed | Do not dry clean |

These are the genuinely correct instructions for 100% polyester fleece — it is
heat-sensitive, so the iron and tumble-dry prohibitions are real advice, not
part of the joke. 40 °C happens to be both the right wash temperature and the
lessee's age, which the label notes without comment:

> UNIT AND LESSEE
> BOTH RATED TO 40°

### Legibility

Verified at true print size with blur and noise applied to simulate inkjet
spread on fabric: all five symbols and every text line remain readable. The
smallest type is 2.0 mm, which is normal for a care label but does need a
300 dpi print — draft mode will mush it.

Leave a few millimetres of seam allowance when sewing; the artwork has a 0.5 mm
border inset so trimming slightly inside the line costs nothing.
