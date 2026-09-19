# Sewable patch — 150 × 200 mm

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

40 mm, error-correction level Q (25% of the code can be damaged or obscured and
it still resolves). Encodes `HTTPS://LEASE-A-FLEECE.COM` in uppercase — that is
deliberate: uppercase puts the QR into alphanumeric mode, which needs fewer
modules, so each module is physically larger and survives printing on fabric.
Domains and URL schemes are case-insensitive, so it opens normally.

Verified to decode from the PDF at 300 dpi and 150 dpi, and from a simulated
photo of fabric with blur, noise and a 7° tilt.

## Transfer medium

Mirroring is handled by the printer software, so these files read normally — do
not mirror them yourself.

Test on paper first and measure the patch with a ruler: it should be exactly
150 × 200 mm. If it isn't, the print dialog scaled it.
