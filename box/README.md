# Delivery box

## Letter — `letter.pdf`

One A4 page. Letterhead, the three assets in a table, terms, care, and a signed
close from Underwriting. Print on the heaviest paper your printer takes; it is
the first thing he reads and it carries the whole conceit.

It states the facts straight: both units on perpetual lease, KORG sold outright,
the Five-Kilometre Concession applied in full, and 40 °C noted without comment.

Signed by all four directors of the family firm — Erik (Managing Director),
Talisa (Director of Underwriting), Ailynn (Registrar of the Fleet) and Quinn
(Inspector of Warmth) — because Article 12 requires every serving director to
counter-sign a lease granted in perpetuity, and nobody has proposed amending it.
That is the excuse the letter gives for four signatures; the real reason is that
four people are giving the present.

## Box panels — `puns.pdf`

16 sheets, A4 landscape, one line each in Fraunces. Print the ones you want and
trim. A suggested arrangement, printed faintly in the corner of each sheet:

| Panel | Line | Why there |
|---|---|---|
| Top | FLEECE TO MEET YOU | First thing he sees |
| Opening flap | RELEASE THE FLEECE | Reads as an instruction |
| Long side | A NEW FLEECE ON LIFE | Puns on *lease* and *fleece* at once |
| Long side | LEASE IS MORE | The company motto it never had |
| Short side | OUR FLEECE RESISTANCE | |
| Short side | HANDLE WITH FLEECE | Shipping-label parody |
| Bottom | FLEECE AND THANK YOU | Read last, once the box is empty |

Spares: GIVE FLEECE A CHANCE · FLEECE OF MIND · KEEP THE WARM FUZZIES ·
RENT THE FLEECE · MASTERFLEECE · FLEECE AND QUIET · AT LONG LAST FLEECE ·
LEASE EXPECTATIONS · FOR FLEECE SAKE

The ordering matters more than the individual jokes: the box opens with a
greeting, instructs him to open it, and thanks him once it is empty.

## Regenerating

`python3 letter.py` and `python3 make.py` write the HTML; render with:

```
chromium --headless --no-pdf-header-footer --print-to-pdf=letter.pdf \
  --virtual-time-budget=9000 "file://$PWD/letter.html"
```

Fonts are pulled from Google Fonts at render time, so keep the machine online.
