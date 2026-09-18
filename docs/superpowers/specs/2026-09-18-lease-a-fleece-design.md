# Lease-a-Fleece — Design

**Date:** 2026-09-18
**Status:** Approved

## Purpose

A marketing and lease-application site for Lease-a-Fleece, a fictional firm that
leases fleece blankets. The site is a joke, but it is presented entirely
straight: premium Scandinavian direct-to-consumer styling, deadpan B2B leasing
copy, and no visible acknowledgement that the premise is absurd. The humour
comes from the gap between the corporate presentation and a fleet of two
blankets.

It exists as a birthday gift, built around two real blankets (one green, one
white) and one real basket.

## Success criteria

- A visitor can browse the fleet, read a unit's specifications, and submit a
  lease application.
- Submitted applications persist to Vercel Blob as JSON and are retrievable
  later. Nothing else is done with them: no email, no CRM, no processing.
- The site is deployed to Erik's **personal** Vercel scope, not the EVAbits team.
- Stock imagery is used now and can be replaced with real photographs by
  overwriting files at fixed paths.

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16, App Router, TypeScript |
| Styling | Tailwind CSS v4 |
| Components | None — native HTML controls styled with Tailwind |
| Validation | Zod |
| Persistence | `@vercel/blob` |
| Tests | Vitest |
| Node | 24 (pinned via `.nvmrc`) |

Three runtime dependencies: `zod`, `@vercel/blob`, `tailwindcss`. shadcn/ui is
vendored source rather than a dependency.

Next.js was chosen over Astro because every primitive the brief needs — form
handling, server-side validation, persistence, image optimisation — is
first-class in the App Router on Vercel. Server Actions remove the need for a
hand-written API route.

## Content model

The entire catalogue lives in one typed const array, `lib/fleet.ts`. There is no
CMS and no database for content.

> A data file, not a CMS. Introduce a CMS when someone other than the author
> needs to edit content.

### Fleet units

Exactly two units exist. Each is a physical blanket, tracked individually the way
a leasing firm tracks vehicles.

| Field | Fjord | Aurora |
|---|---|---|
| `slug` | `fjord` | `aurora` |
| `name` | Fjord | Aurora |
| `colourway` | Olive | Snow white |
| `totalUnits` | 1 | 1 |
| `availableUnits` | 1 | 1 |

Each unit also carries: `tagline`, `description`, `dimensionsCm`, `gsm`,
`composition`, `image`, and `monthlyRates` — a record keyed by term length.

### Lease terms

Three terms: 12, 24 and 36 months. The monthly rate decreases as the term
lengthens, as it does in real leasing. Rates are stored per unit per term in
`monthlyRates`, in integer cents:

| Unit | 12 months | 24 months | 36 months |
|---|---|---|---|
| Fjord | EUR 12.50 | EUR 9.75 | EUR 7.50 |
| Aurora | EUR 14.00 | EUR 10.95 | EUR 8.50 |

KORG is a one-time EUR 35.00. Extras are flat monthly surcharges: monogram
embroidery EUR 2.50, seasonal colour rotation EUR 3.00, express delivery
EUR 1.50.

### KORG — Fleece Containment Unit

The basket: a white perforated carrier with bentwood carry handles, sized to one
folded unit. Presented as a one-time acquisition rather than a lease, and framed
as the only item on the site a customer may own outright. Exactly one exists,
ever. Modelled as a separate const in `lib/fleet.ts` with `oneTimeCents` rather
than `monthlyRates`, and rendered in the lease configuration fieldset as an
optional one-time line item.

### Extras

Three optional add-ons, each a flat monthly surcharge, priced in the table
above: monogram embroidery, seasonal colour rotation, express delivery.

## Routes

| Route | Rendering | Contents |
|---|---|---|
| `/` | Static | Hero, three value propositions, featured fleet, how-leasing-works, CTA to `/lease`, footer |
| `/fleet` | Static | Fleet availability view: fleet size, utilisation, both units with specs and rates |
| `/fleet/[slug]` | Static via `generateStaticParams` | Unit detail: photography, full spec table, rate table by term, "Lease this unit" CTA linking to `/lease?unit=<slug>` |
| `/lease` | Static shell, client form island | The lease application form |
| `/lease/submitted` | Dynamic | Reference number, what happens next |

The three value propositions on `/` are: quarterly laundering included, swap
units at any time, and delivery within three working days. The how-it-works
section has three steps: select a unit, choose a term, receive it.

## The lease application form

A single page with three labelled fieldsets plus a consent checkbox.

**Lessee details** — full name (required), email (required), phone (required),
company (optional).

**Delivery address** — street, house number, postcode, city, country. Country
defaults to Netherlands.

**Lease configuration** — unit (select; prefilled from the `?unit=` query
parameter when present), term (radio: 12 / 24 / 36 months), quantity (1–10),
extras (checkbox group), and the KORG one-time acquisition (single checkbox).

**Consent** — a required checkbox: "I accept the General Terms of Warmth."

A hidden honeypot field is included for bot filtering.

> Honeypot now. Add Vercel BotID if the form is actually spammed.

### Summary panel

A sticky panel recalculates on the client as the configuration changes, showing
two figures: a **monthly total** (unit rate at the chosen term × quantity, plus
extras) and a **one-time total** (KORG, when selected). It reads from the same
`lib/fleet.ts` data and the same pricing function the server uses, so client and
server cannot disagree.

### Pricing function

`lib/pricing.ts` exports a single pure function taking a lease configuration and
returning `{ monthlyTotalCents, oneTimeTotalCents }`. All money is handled in
integer cents. It is imported by both the summary panel and the Server Action.

## Data flow

1. The form submits to a Server Action, `submitLease`.
2. The action parses the payload with a Zod schema, `lib/lease-schema.ts`.
3. On validation failure it returns field-level errors, surfaced through
   `useActionState` and rendered inline beside each input.
4. On success it generates a reference of the form `LAF-XXXXXX` (six uppercase
   alphanumerics), recomputes pricing server-side from the validated input, and
   writes the record.
5. It writes to Vercel Blob at `leases/<ref>.json` with `access: 'private'` and
   `addRandomSuffix: false`.
6. It redirects to `/lease/submitted?ref=<ref>`.

Pricing is always recomputed on the server from validated input. The client's
displayed totals are never trusted or persisted.

### Stored record shape

```json
{
  "ref": "LAF-4KQ2M9",
  "submittedAt": "2026-09-18T12:00:00.000Z",
  "lessee": { "fullName": "", "email": "", "phone": "", "company": null },
  "delivery": {
    "street": "", "houseNumber": "", "postcode": "",
    "city": "", "country": "NL"
  },
  "lease": {
    "unitSlug": "fjord",
    "termMonths": 24,
    "quantity": 1,
    "extras": ["monogram"],
    "korg": true
  },
  "pricing": {
    "monthlyTotalCents": 1250,
    "oneTimeTotalCents": 3500,
    "currency": "EUR"
  }
}
```

Nothing reads these records. There is no admin view, no notification, and no
export. Records are inspected through the Vercel Blob dashboard or an ad-hoc
script when needed.

## Error handling

- **Validation errors** render inline beside the offending field, associated via
  `aria-describedby`, with the first invalid field focused on return.
- **Blob write failure** returns a form-level error — "We could not file your
  contract. Please try again." — and logs the underlying error. The submission is
  never silently discarded; the user always learns whether it was filed.
- **Honeypot filled** returns the success path without writing anything.
- **Unknown `?unit=` slug** falls back to no preselection rather than erroring.

## Imagery

Erik supplies photographs of the actual products as transparent-background AVIF
cutouts. No stock photography is used anywhere on the site.

| Path | Subject | Status |
|---|---|---|
| `public/fleet/fjord.avif` | Olive fleece, rolled and banded | Supplied |
| `public/fleet/aurora.avif` | White fleece, rolled and banded | Awaiting supply |
| `public/korg.avif` | White perforated carrier, bentwood handles | Supplied |

Because the cutouts have no background, every product image is rendered
`object-contain` with padding on a tinted panel rather than `object-cover`. This
is what gives the site its catalogue feel, and it removes the need for a stock
hero photograph: the home page hero is the olive unit itself, set large on the
bone background.

Until the white fleece photograph arrives, `aurora.avif` is generated by
desaturating and lightening `fjord.avif` so the layout is complete and the
substitution is obvious. All images are rendered through `next/image`.

## Tone

Premium Scandinavian direct-to-consumer, organised as an asset register: the
site borrows the visual grammar of an equipment-leasing prospectus — monospace
unit codes, ruled data tables, fleet utilisation as a percentage — and executes
it with editorial restraint. Warm bone ground, olive sampled from the real
blanket as the single accent, Fraunces for display, Karla for body, IBM Plex
Mono for the register layer. Copy is straight-faced throughout; the joke is
carried by the information design, not by the words.

The wink is rationed to roughly half a dozen deadpan moments across the whole
site, never signposted. Examples: "residual thermal value" as a line in the spec
table; the consent checkbox reading "General Terms of Warmth"; a footer notice
that fleece remains the property of the lessor at all times. Genuine-sounding
features — quarterly laundering included, swap units at any time, delivery within
three working days — are presented entirely seriously.

No puns in headings. No illustrated jokes. Nothing acknowledges the premise.

## Testing

One Vitest file covering the two pieces of non-trivial logic:

- **Pricing** — rate selection by term, quantity multiplication, extras, KORG as
  one-time rather than monthly, and the monthly/one-time split.
- **Schema** — accepts a valid payload; rejects missing required fields, a bad
  email, an out-of-range term, a quantity outside 1–10, and unchecked consent.

No component tests and no end-to-end tests. For a five-route marketing site they
would cost more to maintain than the confidence they buy.

## Deployment

1. Install the Vercel CLI (`npm i -g vercel`).
2. `vercel link --scope erik-kallen`, targeting Erik's **personal** scope
   (`vercel.com/erik-kallen`) rather than the EVAbits team. The Vercel MCP
   surfaces only EVAbits because a personal account is not a team.
3. Create a Blob store on the project and pull `BLOB_READ_WRITE_TOKEN` with
   `vercel env pull`.
4. Deploy a preview, then promote to production.

`.nvmrc` pins Node 24. The shell default on this machine is Node 19, which
Next.js 16 does not support.

## Out of scope

Deliberately excluded, with the trigger that would justify revisiting:

- **Authentication and an admin view** — nothing reads the submissions. Add when
  someone needs to review applications in the browser.
- **Payments** — no money changes hands.
- **Email notification** — add when a missed submission would actually matter.
- **A CMS** — add when a non-developer edits content.
- **Internationalisation** — English only.
- **Analytics** — add Vercel Analytics if traffic is ever worth measuring.
