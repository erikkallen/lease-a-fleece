# Lease-a-Fleece Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a marketing and lease-application site for Lease-a-Fleece — a deadpan blanket-leasing firm with a fleet of exactly two blankets and one basket — that persists lease applications to Vercel Blob.

**Architecture:** A Next.js 16 App Router site with five routes. All catalogue content is a typed const in `lib/fleet.ts`; there is no database or CMS. The lease form is a client island that submits to a Server Action, which validates with Zod, recomputes pricing server-side, writes one JSON file per application to Vercel Blob, and redirects to a confirmation page. The only unit-tested logic is the pure pricing function and the Zod schema.

**Tech Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Zod v4, `@vercel/blob`, Vitest, Node 24.

---

## Design language

The concept: **an asset register that happens to contain blankets.** The site borrows the visual grammar of an equipment-leasing prospectus — monospace unit codes, ruled data tables, live availability figures, fleet utilisation stated as a percentage — and executes it with Scandinavian editorial restraint. The joke is structural. It lives in the typography and the information design, not in the copy, which stays completely straight.

**Typefaces.** Three, each with a job:

| Role | Face | Why |
|---|---|---|
| Display | **Fraunces** | A warm, high-contrast serif with `SOFT` and `WONK` variable axes. Softened, it reads as textile rather than newspaper. |
| Body | **Karla** | A grotesque with enough quirk in the `a`, `g` and `t` to have a voice, without drawing attention. |
| Data | **IBM Plex Mono** | The institutional register layer: unit codes, dimensions, availability, reference numbers. This is what sells the premise. |

Not Inter, not Roboto, not a system stack.

**Palette.** Warm bone dominates; olive — sampled from the actual blanket — is the single accent and appears sparingly. No gradients, no purple, no shadows except the one described below.

**The two memorable details:**

1. **The register line.** Every unit carries a monospace asset code rendered as a ruled caption: `LAF-U-001 · OLIVE · 130×160`. It appears on cards, on detail pages, and in the summary panel. It is the thing that makes a blanket read as fleet equipment.
2. **The lift.** Product images are transparent cutouts, so on hover a card's blanket rises a few pixels while a soft elliptical ground-shadow fades in beneath it — as though it is being picked up off the shelf. This only works *because* the images have no background, and it is the one moment of motion on the site.

**Atmosphere.** A very fine paper grain sits over the whole page as an inline SVG turbulence filter — no image asset, no request. Section boundaries are hairline rules, never shadows or cards-on-cards.

**Motion.** One orchestrated page-load stagger on the hero, via `animation-delay`. Everything else is a 150–500ms colour or transform transition. All of it sits behind `prefers-reduced-motion`.

**Spec:** `docs/superpowers/specs/2026-09-18-lease-a-fleece-design.md`

---

## Deviation from the spec: no shadcn/ui

The spec's stack table lists shadcn/ui for form primitives. **This plan does not use it**, and Erik confirmed this after raising the question of visual quality.

The reasoning: shadcn would not make the site look better. Its default aesthetic is the widely-recognised one, and the design language above — Fraunces, a monospace register layer, warm bone, cutouts that lift off the shelf — is the opposite of a component-library default. Meanwhile every control the form needs (text input, select, radio, checkbox) is a native element that is already keyboard- and screen-reader-correct. Reaching the same place through shadcn costs Radix, `class-variance-authority`, `clsx`, `tailwind-merge` and `lucide-react`.

Runtime dependencies: two (`zod`, `@vercel/blob`) plus Tailwind, which does the styling work.

---

## File structure

**Configuration**

| File | Responsibility |
|---|---|
| `.nvmrc` | Pins Node 24 |
| `package.json` | Scripts and dependencies |
| `tsconfig.json` | TypeScript config with `@/*` path alias |
| `next.config.ts` | Next.js config (minimal) |
| `vitest.config.ts` | Vitest config for `lib/**/*.test.ts` |
| `.gitignore` | Already exists — verify it covers `.env*.local` and `.vercel` |

**Domain logic — pure, testable, no React**

| File | Responsibility |
|---|---|
| `lib/fleet.ts` | Fleet units, KORG, extras, terms. Types and const data. The single source of truth for catalogue content. |
| `lib/pricing.ts` | `priceLease(config)` — the only place money is computed |
| `lib/pricing.test.ts` | Pricing tests |
| `lib/lease-schema.ts` | Zod schema for a lease application |
| `lib/lease-schema.test.ts` | Schema tests |
| `lib/format.ts` | `formatEur(cents)` — cents to a display string |

**Server**

| File | Responsibility |
|---|---|
| `app/actions/submit-lease.ts` | The `submitLease` Server Action: parse, validate, price, persist, redirect |

**Shell and shared UI**

| File | Responsibility |
|---|---|
| `app/layout.tsx` | Root layout, fonts, header, footer |
| `app/globals.css` | Tailwind import and the design tokens |
| `components/site-header.tsx` | Navigation |
| `components/site-footer.tsx` | Footer and legal notice |
| `components/unit-card.tsx` | One fleet unit as a card — used on `/` and `/fleet` |

**Routes**

| File | Responsibility |
|---|---|
| `app/page.tsx` | Home |
| `app/fleet/page.tsx` | Fleet availability |
| `app/fleet/[slug]/page.tsx` | Unit detail |
| `app/lease/page.tsx` | Server shell for the lease page |
| `app/lease/lease-form.tsx` | Client: form state, fields, error rendering |
| `app/lease/summary-panel.tsx` | Client: presentational price summary |
| `app/lease/submitted/page.tsx` | Confirmation |

**Assets**

`public/fleet/fjord.avif`, `public/fleet/aurora.avif`, `public/korg.avif` — transparent-background product cutouts supplied by Erik

---

## Task 1: Scaffold the Next.js project

`create-next-app` refuses to run in a directory containing `docs/`, so scaffold into the scratchpad and copy the result in over the existing git repo.

**Files:**
- Create: everything `create-next-app` generates
- Create: `.nvmrc`

- [ ] **Step 1: Select Node 24**

```bash
source ~/.nvm/nvm.sh && nvm use 24
node -v
```

Expected: `v24.15.0`

- [ ] **Step 2: Scaffold into the scratchpad**

```bash
source ~/.nvm/nvm.sh && nvm use 24
cd /tmp/claude-1000/-home-erikkallen-Projects-erik-lease-a-fleece/5dbaab3e-e484-4a02-bb2c-66c4c73a23c7/scratchpad
rm -rf scaffold
npx --yes create-next-app@latest scaffold \
  --ts --tailwind --eslint --app --no-src-dir --turbopack \
  --import-alias "@/*" --use-npm --no-git --yes
```

Expected: completes with "Success! Created scaffold".

- [ ] **Step 3: Copy the scaffold into the project**

```bash
cd /home/erikkallen/Projects/erik/lease-a-fleece
S=/tmp/claude-1000/-home-erikkallen-Projects-erik-lease-a-fleece/5dbaab3e-e484-4a02-bb2c-66c4c73a23c7/scratchpad/scaffold
cp -r "$S"/app "$S"/public "$S"/*.ts "$S"/*.mjs "$S"/*.json "$S"/*.css . 2>/dev/null
cp "$S"/.gitignore .gitignore.next && cat .gitignore.next >> .gitignore && rm .gitignore.next
sort -u -o .gitignore .gitignore
ls
```

Expected: `app`, `public`, `package.json`, `tsconfig.json`, `next.config.ts`, `docs` all present.

- [ ] **Step 4: Pin Node 24**

```bash
echo "24" > .nvmrc
```

- [ ] **Step 5: Install and verify the build**

```bash
source ~/.nvm/nvm.sh && nvm use
npm install
npm run build
```

Expected: build succeeds and prints a route table including `/`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 16 app with Tailwind v4"
```

---

## Task 2: Set up Vitest

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (add the `test` script)

- [ ] **Step 1: Install Vitest**

```bash
source ~/.nvm/nvm.sh && nvm use
npm install -D vitest
```

- [ ] **Step 2: Create the config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['lib/**/*.test.ts'],
    environment: 'node',
  },
})
```

- [ ] **Step 3: Add the test script**

In `package.json`, inside `"scripts"`, add:

```json
"test": "vitest run"
```

- [ ] **Step 4: Verify Vitest runs**

```bash
npm test
```

Expected: exits 0 with "No test files found" — Vitest is wired up and there is nothing to run yet.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: add vitest"
```

---

## Task 3: The fleet data module

Pure data and types. No tests — it has no behaviour, and the pricing tests exercise it.

**Files:**
- Create: `lib/fleet.ts`

- [ ] **Step 1: Write the module**

Create `lib/fleet.ts`:

```ts
export const TERMS = [12, 24, 36] as const
export type TermMonths = (typeof TERMS)[number]

export const UNIT_SLUGS = ['fjord', 'aurora'] as const
export type UnitSlug = (typeof UNIT_SLUGS)[number]

export const EXTRA_IDS = ['monogram', 'rotation', 'express'] as const
export type ExtraId = (typeof EXTRA_IDS)[number]

export interface Extra {
  id: ExtraId
  name: string
  description: string
  monthlyCents: number
}

export interface FleetUnit {
  slug: UnitSlug
  assetCode: string
  name: string
  tagline: string
  description: string
  colourway: string
  dimensionsCm: string
  gsm: number
  composition: string
  residualThermalValue: string
  image: string
  totalUnits: number
  availableUnits: number
  monthlyRates: Record<TermMonths, number>
}

export const FLEET: FleetUnit[] = [
  {
    slug: 'fjord',
    assetCode: 'LAF-U-001',
    name: 'Fjord',
    tagline: 'The everyday unit.',
    description:
      'Our workhorse, specified in olive. Dense enough for a cold sitting room, light enough to carry between floors. Fjord is the unit we recommend to first-time lessees and the one we least often get back early.',
    colourway: 'Olive',
    dimensionsCm: '130 × 160',
    gsm: 260,
    composition: '100% polyester anti-pill fleece',
    residualThermalValue: '72% at end of term',
    image: '/fleet/fjord.avif',
    totalUnits: 1,
    availableUnits: 1,
    monthlyRates: { 12: 1250, 24: 975, 36: 750 },
  },
  {
    slug: 'aurora',
    assetCode: 'LAF-U-002',
    name: 'Aurora',
    tagline: 'The considered unit.',
    description:
      'Aurora is specified in snow white, which is a decision the lessee makes with their eyes open. Identical in construction to Fjord and priced fractionally higher to reflect the risk profile.',
    colourway: 'Snow white',
    dimensionsCm: '130 × 160',
    gsm: 260,
    composition: '100% polyester anti-pill fleece',
    residualThermalValue: '69% at end of term',
    image: '/fleet/aurora.avif',
    totalUnits: 1,
    availableUnits: 1,
    monthlyRates: { 12: 1400, 24: 1095, 36: 850 },
  },
]

export const EXTRAS: Extra[] = [
  {
    id: 'monogram',
    name: 'Monogram embroidery',
    description: 'Up to three initials, corner-set, thread matched to the unit.',
    monthlyCents: 250,
  },
  {
    id: 'rotation',
    name: 'Seasonal colour rotation',
    description: 'We exchange the unit for a seasonally appropriate colourway twice yearly.',
    monthlyCents: 300,
  },
  {
    id: 'express',
    name: 'Express delivery',
    description: 'Next working day, and priority handling on every subsequent exchange.',
    monthlyCents: 150,
  },
]

export const KORG = {
  name: 'KORG',
  subtitle: 'Fleece Containment Unit',
  description:
    'A perforated carrier in white, with bentwood handles, sized to one folded unit. Ventilated on all four faces, which matters more than you would think. KORG is not leased. It is sold outright, once, to one customer, and then it is gone. We do not expect to source another.',
  image: '/korg.avif',
  assetCode: 'LAF-A-001',
  oneTimeCents: 3500,
  unitsEverAvailable: 1,
} as const

export function getUnit(slug: string): FleetUnit | undefined {
  return FLEET.find((u) => u.slug === slug)
}

export function getExtra(id: string): Extra | undefined {
  return EXTRAS.find((e) => e.id === id)
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
source ~/.nvm/nvm.sh && nvm use
npx tsc --noEmit
```

Expected: no output, exit 0.

- [ ] **Step 3: Commit**

```bash
git add lib/fleet.ts
git commit -m "feat: add fleet catalogue data"
```

---

## Task 4: The pricing function

`monthlyTotalCents = (unit rate at term + sum of selected extras) × quantity`. KORG is one-time only and never multiplied by quantity — there is only one of it.

**Files:**
- Create: `lib/pricing.ts`
- Test: `lib/pricing.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `lib/pricing.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { priceLease } from './pricing'

describe('priceLease', () => {
  it('prices a single unit at the 12-month rate', () => {
    expect(
      priceLease({ unitSlug: 'fjord', termMonths: 12, quantity: 1, extras: [], korg: false }),
    ).toEqual({ monthlyTotalCents: 1250, oneTimeTotalCents: 0 })
  })

  it('uses the cheaper rate for a longer term', () => {
    const short = priceLease({ unitSlug: 'fjord', termMonths: 12, quantity: 1, extras: [], korg: false })
    const long = priceLease({ unitSlug: 'fjord', termMonths: 36, quantity: 1, extras: [], korg: false })
    expect(long.monthlyTotalCents).toBeLessThan(short.monthlyTotalCents)
    expect(long.monthlyTotalCents).toBe(750)
  })

  it('prices Aurora above Fjord at the same term', () => {
    const fjord = priceLease({ unitSlug: 'fjord', termMonths: 24, quantity: 1, extras: [], korg: false })
    const aurora = priceLease({ unitSlug: 'aurora', termMonths: 24, quantity: 1, extras: [], korg: false })
    expect(aurora.monthlyTotalCents).toBeGreaterThan(fjord.monthlyTotalCents)
  })

  it('multiplies the monthly total by quantity', () => {
    expect(
      priceLease({ unitSlug: 'fjord', termMonths: 24, quantity: 3, extras: [], korg: false })
        .monthlyTotalCents,
    ).toBe(975 * 3)
  })

  it('adds extras per unit before multiplying by quantity', () => {
    expect(
      priceLease({
        unitSlug: 'fjord',
        termMonths: 24,
        quantity: 2,
        extras: ['monogram'],
        korg: false,
      }).monthlyTotalCents,
    ).toBe((975 + 250) * 2)
  })

  it('sums multiple extras', () => {
    expect(
      priceLease({
        unitSlug: 'fjord',
        termMonths: 24,
        quantity: 1,
        extras: ['monogram', 'rotation', 'express'],
        korg: false,
      }).monthlyTotalCents,
    ).toBe(975 + 250 + 300 + 150)
  })

  it('charges KORG once and never monthly', () => {
    const result = priceLease({
      unitSlug: 'fjord',
      termMonths: 24,
      quantity: 4,
      extras: [],
      korg: true,
    })
    expect(result.oneTimeTotalCents).toBe(3500)
    expect(result.monthlyTotalCents).toBe(975 * 4)
  })

  it('throws on an unknown unit', () => {
    expect(() =>
      // @ts-expect-error deliberately invalid slug
      priceLease({ unitSlug: 'nope', termMonths: 12, quantity: 1, extras: [], korg: false }),
    ).toThrow(/unknown unit/i)
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
source ~/.nvm/nvm.sh && nvm use
npm test
```

Expected: FAIL — `Failed to resolve import "./pricing"`.

- [ ] **Step 3: Write the implementation**

Create `lib/pricing.ts`:

```ts
import { getExtra, getUnit, type ExtraId, type TermMonths, type UnitSlug } from './fleet'
import { KORG } from './fleet'

export interface LeaseConfig {
  unitSlug: UnitSlug
  termMonths: TermMonths
  quantity: number
  extras: ExtraId[]
  korg: boolean
}

export interface LeasePricing {
  monthlyTotalCents: number
  oneTimeTotalCents: number
}

export function priceLease(config: LeaseConfig): LeasePricing {
  const unit = getUnit(config.unitSlug)
  if (!unit) throw new Error(`Unknown unit: ${config.unitSlug}`)

  const extrasCents = config.extras.reduce((sum, id) => sum + (getExtra(id)?.monthlyCents ?? 0), 0)
  const perUnitCents = unit.monthlyRates[config.termMonths] + extrasCents

  return {
    monthlyTotalCents: perUnitCents * config.quantity,
    oneTimeTotalCents: config.korg ? KORG.oneTimeCents : 0,
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
npm test
```

Expected: PASS — 8 passed.

- [ ] **Step 5: Commit**

```bash
git add lib/pricing.ts lib/pricing.test.ts
git commit -m "feat: add lease pricing calculation"
```

---

## Task 5: The lease application schema

**Files:**
- Create: `lib/lease-schema.ts`
- Test: `lib/lease-schema.test.ts`

- [ ] **Step 1: Install Zod**

```bash
source ~/.nvm/nvm.sh && nvm use
npm install zod
node -p "require('./package.json').dependencies.zod"
```

Expected: a `^4.x` version. This plan uses Zod v4 idioms (`z.email()`, `{ error: '...' }`). If the installed version is v3, use `z.string().email()` and `{ message: '...' }` instead.

- [ ] **Step 2: Write the failing tests**

Create `lib/lease-schema.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { leaseSchema } from './lease-schema'

function valid(overrides: Record<string, unknown> = {}) {
  return {
    fullName: 'Erik Kallen',
    email: 'erik@example.com',
    phone: '+31 6 12345678',
    company: '',
    street: 'Keizersgracht',
    houseNumber: '104',
    postcode: '1015 CV',
    city: 'Amsterdam',
    country: 'NL',
    unitSlug: 'fjord',
    termMonths: '24',
    quantity: '1',
    extras: [],
    korg: false,
    consent: true,
    ...overrides,
  }
}

describe('leaseSchema', () => {
  it('accepts a valid application', () => {
    const result = leaseSchema.safeParse(valid())
    expect(result.success).toBe(true)
  })

  it('coerces termMonths and quantity from strings', () => {
    const result = leaseSchema.parse(valid({ termMonths: '36', quantity: '2' }))
    expect(result.termMonths).toBe(36)
    expect(result.quantity).toBe(2)
  })

  it('normalises an empty company to null', () => {
    expect(leaseSchema.parse(valid({ company: '' })).company).toBeNull()
  })

  it('rejects a missing name', () => {
    const result = leaseSchema.safeParse(valid({ fullName: '' }))
    expect(result.success).toBe(false)
  })

  it('rejects a malformed email', () => {
    const result = leaseSchema.safeParse(valid({ email: 'not-an-email' }))
    expect(result.success).toBe(false)
  })

  it('rejects an unknown unit', () => {
    const result = leaseSchema.safeParse(valid({ unitSlug: 'snuggie' }))
    expect(result.success).toBe(false)
  })

  it('rejects a term that is not 12, 24 or 36', () => {
    const result = leaseSchema.safeParse(valid({ termMonths: '18' }))
    expect(result.success).toBe(false)
  })

  it('rejects a quantity below 1', () => {
    expect(leaseSchema.safeParse(valid({ quantity: '0' })).success).toBe(false)
  })

  it('rejects a quantity above 10', () => {
    expect(leaseSchema.safeParse(valid({ quantity: '11' })).success).toBe(false)
  })

  it('rejects an unknown extra', () => {
    expect(leaseSchema.safeParse(valid({ extras: ['gold-trim'] })).success).toBe(false)
  })

  it('rejects unchecked consent', () => {
    const result = leaseSchema.safeParse(valid({ consent: false }))
    expect(result.success).toBe(false)
  })

  it('reports errors against the field that caused them', () => {
    const result = leaseSchema.safeParse(valid({ email: 'nope' }))
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === 'email')).toBe(true)
    }
  })
})
```

- [ ] **Step 3: Run the tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `Failed to resolve import "./lease-schema"`.

- [ ] **Step 4: Write the implementation**

Create `lib/lease-schema.ts`:

```ts
import { z } from 'zod'
import { EXTRA_IDS, UNIT_SLUGS } from './fleet'

export const leaseSchema = z.object({
  fullName: z.string().trim().min(2, { error: 'Please enter your full name.' }),
  email: z.email({ error: 'Please enter a valid email address.' }),
  phone: z.string().trim().min(6, { error: 'Please enter a contact number.' }),
  company: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),

  street: z.string().trim().min(2, { error: 'Please enter a street name.' }),
  houseNumber: z.string().trim().min(1, { error: 'Please enter a house number.' }),
  postcode: z.string().trim().min(4, { error: 'Please enter a postcode.' }),
  city: z.string().trim().min(2, { error: 'Please enter a city.' }),
  country: z.string().trim().min(2, { error: 'Please enter a country.' }),

  unitSlug: z.enum(UNIT_SLUGS, { error: 'Please select a unit.' }),
  termMonths: z.coerce
    .number()
    .refine((n) => n === 12 || n === 24 || n === 36, {
      error: 'Please select a lease term.',
    })
    .transform((n) => n as 12 | 24 | 36),
  quantity: z.coerce
    .number()
    .int({ error: 'Please enter a whole number of units.' })
    .min(1, { error: 'A contract covers at least one unit.' })
    .max(10, { error: 'A single contract covers at most ten units.' }),
  extras: z.array(z.enum(EXTRA_IDS)).default([]),
  korg: z.boolean().default(false),

  consent: z.literal(true, { error: 'You must accept the General Terms of Warmth.' }),
})

export type LeaseInput = z.infer<typeof leaseSchema>
```

- [ ] **Step 5: Run the tests to verify they pass**

```bash
npm test
```

Expected: PASS — 20 passed across both files.

- [ ] **Step 6: Commit**

```bash
git add lib/lease-schema.ts lib/lease-schema.test.ts package.json package-lock.json
git commit -m "feat: add lease application schema"
```

---

## Task 6: Currency formatting

**Files:**
- Create: `lib/format.ts`
- Test: append to `lib/pricing.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `lib/pricing.test.ts`:

```ts
import { formatEur } from './format'

describe('formatEur', () => {
  it('renders cents as euros', () => {
    expect(formatEur(1250)).toBe('€12.50')
  })

  it('renders a whole amount with trailing zeros', () => {
    expect(formatEur(3500)).toBe('€35.00')
  })

  it('renders zero', () => {
    expect(formatEur(0)).toBe('€0.00')
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `Failed to resolve import "./format"`.

- [ ] **Step 3: Write the implementation**

Create `lib/format.ts`:

```ts
const EUR = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
})

export function formatEur(cents: number): string {
  return EUR.format(cents / 100)
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
npm test
```

Expected: PASS — 23 passed.

If the euro sign is followed by a non-breaking space in this Node build, the assertion will fail on whitespace. In that case change `formatEur` to strip it: `return EUR.format(cents / 100).replace(/ /g, '')`.

- [ ] **Step 5: Commit**

```bash
git add lib/format.ts lib/pricing.test.ts
git commit -m "feat: add euro formatting helper"
```

---

## Task 7: Design system, grain and root layout

**Files:**
- Modify: `app/globals.css` (replace entirely)
- Modify: `app/layout.tsx` (replace entirely)
- Create: `components/grain.tsx`
- Create: `components/site-header.tsx`
- Create: `components/site-footer.tsx`

- [ ] **Step 1: Write the design tokens**

Replace the entire contents of `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-bone: #f4f1ea;
  --color-paper: #fbfaf6;
  --color-ink: #171a14;
  --color-stone: #6e6e62;
  --color-line: #dcd7ca;
  --color-olive: #4a5233;
  --color-olive-soft: #e9eae1;

  --font-display: var(--font-fraunces), Georgia, serif;
  --font-sans: var(--font-karla), ui-sans-serif, sans-serif;
  --font-mono: var(--font-plex-mono), ui-monospace, monospace;

  --ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);
}

body {
  background-color: var(--color-bone);
  color: var(--color-ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* Fraunces, softened and slightly wonky, reads as textile rather than newspaper. */
.font-display {
  font-variation-settings: "SOFT" 40, "WONK" 1;
  letter-spacing: -0.015em;
}

/* The register layer: unit codes, dimensions, availability. */
.register {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-stone);
}

::selection {
  background-color: var(--color-olive);
  color: var(--color-bone);
}

/* One orchestrated entrance on the hero. Nothing else animates on load. */
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.rise {
  animation: rise 0.7s var(--ease-out-soft) both;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Write the grain overlay**

Create `components/grain.tsx`. An inline SVG turbulence filter — no image asset and no network request, fixed over the viewport and inert to pointer events:

```tsx
export function Grain() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.035] mix-blend-multiply"
    >
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  )
}
```

- [ ] **Step 3: Write the header**

Create `components/site-header.tsx`:

```tsx
import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bone/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-xl">
          Lease&#8209;a&#8209;Fleece
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="/fleet" className="register transition-colors hover:text-ink">
            Fleet
          </Link>
          <Link
            href="/lease"
            className="rounded-full bg-ink px-5 py-2 text-sm text-paper transition-opacity hover:opacity-85"
          >
            Start a contract
          </Link>
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Write the footer**

Create `components/site-footer.tsx`:

```tsx
export function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <p className="font-display text-lg">Lease&#8209;a&#8209;Fleece B.V.</p>
            <p className="mt-3 text-sm leading-relaxed text-stone">
              Registered warmth provider. Amsterdam, the Netherlands.
            </p>
          </div>
          <div className="max-w-xs text-sm leading-relaxed text-stone">
            <p>
              All fleece remains the property of the lessor at all times. Units are inspected on
              return.
            </p>
          </div>
          <div className="register leading-loose">
            <p>Fleet size — 002</p>
            <p>Jurisdiction — NL</p>
            <p>Terms — 12 / 24 / 36</p>
          </div>
        </div>
        <p className="register mt-12 border-t border-line pt-6">
          &copy; {new Date().getFullYear()} Lease&#8209;a&#8209;Fleece B.V.
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: Write the root layout**

Replace the entire contents of `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Fraunces, IBM_Plex_Mono, Karla } from 'next/font/google'
import { Grain } from '@/components/grain'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['SOFT', 'WONK'],
  variable: '--font-fraunces',
})
const karla = Karla({ subsets: ['latin'], variable: '--font-karla' })
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
})

export const metadata: Metadata = {
  title: 'Lease-a-Fleece — Fleece blankets, leased',
  description:
    'Full-service fleece leasing. Quarterly laundering included, swap units at any time, delivery within three working days.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${karla.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <Grain />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
```

If the build rejects the `axes` option on Fraunces, drop that line — the font still loads as a variable weight range, and the `font-variation-settings` rule in `globals.css` simply has no effect.

- [ ] **Step 6: Verify the build**

```bash
source ~/.nvm/nvm.sh && nvm use
npm run build
```

Expected: build succeeds.

- [ ] **Step 7: Look at it**

Run `npm run dev` and open `http://localhost:3000`. The page is mostly empty at this stage, but confirm: the background is warm bone rather than white, the header wordmark renders in a serif, the footer register block renders in monospace small caps, and the grain is *just* perceptible — if it looks like visible noise, lower the opacity.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add design system, grain overlay, layout, header and footer"
```

---

## Task 8: Place the supplied product images

Erik supplied photographs of the real products as transparent-background AVIF cutouts: the olive fleece rolled and banded, and the white perforated KORG carrier with bentwood handles. No stock photography is used.

**Files:**
- Create: `public/fleet/fjord.avif`, `public/fleet/aurora.avif`, `public/korg.avif`
- Create: `public/CREDITS.md`

- [ ] **Step 1: Confirm the supplied files are on disk**

Erik saves the cutouts himself — they arrive in the conversation as images, not as files, so they cannot be written by a tool.

```bash
cd /home/erikkallen/Projects/erik/lease-a-fleece
magick identify -format "%f  %wx%h  alpha=%A\n" public/fleet/fjord.avif public/korg.avif
```

Expected: both 1080×1080 (or similar square), `alpha=Blend`. Then confirm the transparency is real rather than a flattened white box:

```bash
magick public/korg.avif -format "%[pixel:p{5,5}]\n" info:
magick public/fleet/fjord.avif -format "%[pixel:p{5,5}]\n" info:
```

Expected: `srgba(0,0,0,0)` for both. Anything opaque means the background was flattened on export and the `object-contain` treatment will show a white rectangle against the bone ground — stop and ask for a re-export.

Status at time of writing: `public/korg.avif` is present and verified (1080×1080, alpha Blend, transparent corner). `public/fleet/fjord.avif` has not arrived yet.

- [ ] **Step 2: Generate a temporary Aurora**

The white fleece has not been photographed yet. Derive a stand-in from the olive unit by desaturating and lightening it, so the layout is complete and the substitution is visibly temporary rather than subtly wrong:

```bash
cd /home/erikkallen/Projects/erik/lease-a-fleece
magick public/fleet/fjord.avif -modulate 118,8,100 -level 0%,62% public/fleet/aurora.avif
identify public/fleet/aurora.avif
```

Open `public/fleet/aurora.avif` and confirm it reads as a pale, near-white rolled blanket with the alpha channel intact. Adjust the `-level` upper bound if it is too grey or blown out.

When Erik supplies the real white fleece photograph, it replaces this file at the same path and nothing else changes.

- [ ] **Step 3: Record provenance**

Create `public/CREDITS.md`:

```markdown
# Product images

All images are photographs of the actual products. No stock photography.

| File | Subject | Source |
|---|---|---|
| `fleet/fjord.avif` | Olive fleece, 130 × 160 cm, rolled | Supplied by Erik |
| `fleet/aurora.avif` | White fleece | **Placeholder** — derived from `fjord.avif`, replace with the real photograph |
| `korg.avif` | White perforated carrier, bentwood handles | Supplied by Erik |

All are transparent-background cutouts and are rendered `object-contain` on a
tinted panel. A replacement must also have a transparent background.
```

- [ ] **Step 4: Commit**

```bash
git add public
git commit -m "feat: add product images"
```

---

## Task 9: The unit card component

Shared by the home page and `/fleet`.

**Files:**
- Create: `components/unit-card.tsx`

- [ ] **Step 1: Write the component**

Create `components/unit-card.tsx`:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { formatEur } from '@/lib/format'
import type { FleetUnit } from '@/lib/fleet'

export function UnitCard({ unit }: { unit: FleetUnit }) {
  return (
    <Link
      href={`/fleet/${unit.slug}`}
      className="group block overflow-hidden rounded-lg border border-line bg-paper transition-colors duration-300 hover:border-ink/30"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-olive-soft">
        {/* Ground shadow. Fades in under the unit as it lifts — only possible
            because the product images are transparent cutouts. */}
        <div
          aria-hidden="true"
          className="absolute bottom-[14%] left-1/2 h-4 w-1/2 -translate-x-1/2 rounded-[50%] bg-ink/20 opacity-0 blur-md transition-all duration-500 ease-[var(--ease-out-soft)] group-hover:bottom-[10%] group-hover:opacity-100"
        />
        <Image
          src={unit.image}
          alt={`${unit.name} in ${unit.colourway.toLowerCase()}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-10 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-2"
        />
      </div>
      <div className="p-6">
        <p className="register">
          {unit.assetCode} · {unit.colourway} · {unit.dimensionsCm}
        </p>
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-3xl">{unit.name}</h3>
          <span className="register">
            {unit.availableUnits} / {unit.totalUnits} avail.
          </span>
        </div>
        <p className="mt-2 text-sm text-stone">{unit.tagline}</p>
        <dl className="mt-6 flex items-end justify-between border-t border-line pt-4">
          <div>
            <dt className="register">From</dt>
            <dd className="mt-1 font-display text-2xl">
              {formatEur(unit.monthlyRates[36])}
              <span className="ml-1.5 font-sans text-xs text-stone">/ month</span>
            </dd>
          </div>
          <span className="register transition-colors group-hover:text-ink">Specification &rarr;</span>
        </dl>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
source ~/.nvm/nvm.sh && nvm use
npx tsc --noEmit
```

Expected: no output, exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/unit-card.tsx
git commit -m "feat: add unit card component"
```

---

## Task 10: The home page

**Files:**
- Modify: `app/page.tsx` (replace entirely)

- [ ] **Step 1: Write the page**

Replace the entire contents of `app/page.tsx`:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { UnitCard } from '@/components/unit-card'
import { FLEET } from '@/lib/fleet'

const PROPOSITIONS = [
  {
    title: 'Quarterly laundering included',
    body: 'Every unit is collected, professionally laundered and returned within 48 hours. Four times a year, on a schedule you never have to think about.',
  },
  {
    title: 'Swap units at any time',
    body: 'Specified Fjord and found yourself wanting Aurora? One request and we exchange it. No fee, no adjustment to your term.',
  },
  {
    title: 'Delivery within three working days',
    body: 'Contracts approved before 14:00 are dispatched the same day. Our fleet is small, so it is never far away.',
  },
]

const STEPS = [
  { n: '01', title: 'Select a unit', body: 'Two are available. Both are excellent.' },
  { n: '02', title: 'Choose a term', body: 'Twelve, twenty-four or thirty-six months. Longer terms carry a lower monthly rate.' },
  { n: '03', title: 'Receive it', body: 'We deliver, you use it, we launder it. At end of term you renew, swap, or return the unit.' },
]

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="register rise">Est. 2026 · Amsterdam · Fleet size 002</p>
            <h1
              className="rise mt-6 font-display text-6xl leading-[0.98] sm:text-7xl"
              style={{ animationDelay: '80ms' }}
            >
              Never own a<br />
              blanket again.
            </h1>
            <p
              className="rise mt-7 max-w-md text-lg leading-relaxed text-stone"
              style={{ animationDelay: '160ms' }}
            >
              Full-service fleece leasing for the domestic interior. You get the warmth. We keep the
              asset, the laundering schedule and the depreciation.
            </p>
            <div
              className="rise mt-10 flex flex-wrap items-center gap-6"
              style={{ animationDelay: '240ms' }}
            >
              <Link
                href="/lease"
                className="rounded-full bg-ink px-7 py-3 text-paper transition-opacity hover:opacity-85"
              >
                Start a contract
              </Link>
              <Link href="/fleet" className="register transition-colors hover:text-ink">
                View the fleet &rarr;
              </Link>
            </div>
          </div>
          <div
            className="rise relative aspect-square overflow-hidden rounded-lg bg-olive-soft"
            style={{ animationDelay: '320ms' }}
          >
            <div
              aria-hidden="true"
              className="absolute bottom-[16%] left-1/2 h-6 w-1/2 -translate-x-1/2 rounded-[50%] bg-ink/15 blur-lg"
            />
            <Image
              src={FLEET[0].image}
              alt={`${FLEET[0].name}, our olive unit, rolled and banded`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-12"
            />
            <p className="register absolute bottom-5 left-6">
              {FLEET[0].assetCode} · {FLEET[0].dimensionsCm}
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-3">
          {PROPOSITIONS.map((p) => (
            <div key={p.title}>
              <h2 className="font-display text-xl">{p.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-3xl">The fleet</h2>
          <Link href="/fleet" className="text-sm text-stone underline-offset-4 hover:underline">
            Availability &amp; specifications
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {FLEET.map((unit) => (
            <UnitCard key={unit.slug} unit={unit} />
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl">How leasing works</h2>
          <ol className="mt-10 grid gap-10 sm:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className="font-display text-sm text-stone">{s.n}</span>
                <h3 className="mt-2 font-display text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-14 border-t border-line pt-10">
            <Link
              href="/lease"
              className="inline-block rounded-full bg-ink px-7 py-3 text-paper transition-opacity hover:opacity-85"
            >
              Start a contract
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Verify it renders**

```bash
source ~/.nvm/nvm.sh && nvm use
npm run build
```

Expected: build succeeds; `/` is listed as a static route.

- [ ] **Step 3: Look at the page**

Run `npm run dev`, open `http://localhost:3000`, and confirm the hero image loads, the two unit cards appear with prices, and nothing overflows at a narrow window width.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add home page"
```

---

## Task 11: The fleet pages

**Files:**
- Create: `app/fleet/page.tsx`
- Create: `app/fleet/[slug]/page.tsx`

- [ ] **Step 1: Write the fleet availability page**

Create `app/fleet/page.tsx`:

```tsx
import Image from 'next/image'
import type { Metadata } from 'next'
import { UnitCard } from '@/components/unit-card'
import { FLEET, KORG } from '@/lib/fleet'
import { formatEur } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Fleet & availability — Lease-a-Fleece',
  description: 'Current fleet size, utilisation and unit specifications.',
}

export default function FleetPage() {
  const total = FLEET.reduce((sum, u) => sum + u.totalUnits, 0)
  const available = FLEET.reduce((sum, u) => sum + u.availableUnits, 0)
  const utilisation = Math.round(((total - available) / total) * 100)

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl tracking-tight">Fleet &amp; availability</h1>
      <p className="mt-4 max-w-xl text-stone">
        Every unit in our fleet is tracked individually. Availability below is live.
      </p>

      <dl className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
        {[
          ['Fleet size', `${total} units`],
          ['Available now', `${available} units`],
          ['Current utilisation', `${utilisation}%`],
        ].map(([label, value]) => (
          <div key={label} className="bg-paper px-6 py-5">
            <dt className="register">{label}</dt>
            <dd className="mt-1 font-display text-2xl">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {FLEET.map((unit) => (
          <UnitCard key={unit.slug} unit={unit} />
        ))}
      </div>

      <section className="mt-20 grid items-center gap-10 rounded-lg border border-line bg-paper p-8 lg:grid-cols-2">
        <div className="relative aspect-4/3 overflow-hidden rounded bg-olive-soft">
          <Image
            src={KORG.image}
            alt="The KORG carrier: a white perforated basket with bentwood handles"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-10"
          />
        </div>
        <div>
          <p className="register">Not for lease</p>
          <h2 className="mt-3 font-display text-3xl">
            {KORG.name} <span className="text-stone">— {KORG.subtitle}</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-stone">{KORG.description}</p>
          <p className="register mt-6">{KORG.assetCode}</p>
          <p className="mt-2 font-display text-3xl">{formatEur(KORG.oneTimeCents)}</p>
          <p className="text-xs text-stone">
            One-time. {KORG.unitsEverAvailable} available, ever. Add it to a contract.
          </p>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Write the unit detail page**

Create `app/fleet/[slug]/page.tsx`:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { FLEET, TERMS, getUnit } from '@/lib/fleet'
import { formatEur } from '@/lib/format'

export function generateStaticParams() {
  return FLEET.map((unit) => ({ slug: unit.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const unit = getUnit(slug)
  if (!unit) return {}
  return {
    title: `${unit.name} — Lease-a-Fleece`,
    description: unit.tagline,
  }
}

export default async function UnitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const unit = getUnit(slug)
  if (!unit) notFound()

  const specs: [string, string][] = [
    ['Asset code', unit.assetCode],
    ['Colourway', unit.colourway],
    ['Dimensions', `${unit.dimensionsCm} cm`],
    ['Weight', `${unit.gsm} gsm`],
    ['Composition', unit.composition],
    ['Residual thermal value', unit.residualThermalValue],
    ['Fleet availability', `${unit.availableUnits} of ${unit.totalUnits}`],
  ]

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/fleet" className="text-sm text-stone underline-offset-4 hover:underline">
        &larr; Fleet
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-olive-soft">
          <div
            aria-hidden="true"
            className="absolute bottom-[16%] left-1/2 h-6 w-1/2 -translate-x-1/2 rounded-[50%] bg-ink/15 blur-lg"
          />
          <Image
            src={unit.image}
            alt={`${unit.name} in ${unit.colourway.toLowerCase()}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-12"
          />
        </div>

        <div>
          <h1 className="font-display text-4xl tracking-tight">{unit.name}</h1>
          <p className="register mt-3">{unit.assetCode}</p>
          <p className="mt-3 text-stone">{unit.tagline}</p>
          <p className="mt-6 leading-relaxed text-stone">{unit.description}</p>

          <h2 className="register mt-10 block">Specification</h2>
          <dl className="mt-4 divide-y divide-line border-y border-line">
            {specs.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-6 py-3 text-sm">
                <dt className="text-stone">{label}</dt>
                <dd className="text-right">{value}</dd>
              </div>
            ))}
          </dl>

          <h2 className="register mt-10 block">Monthly rate</h2>
          <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded border border-line bg-line">
            {TERMS.map((term) => (
              <div key={term} className="bg-paper px-4 py-4 text-center">
                <dt className="text-xs text-stone">{term} months</dt>
                <dd className="mt-1 font-display text-xl">{formatEur(unit.monthlyRates[term])}</dd>
              </div>
            ))}
          </dl>

          <Link
            href={`/lease?unit=${unit.slug}`}
            className="mt-10 inline-block rounded-full bg-ink px-7 py-3 text-paper transition-opacity hover:opacity-85"
          >
            Lease this unit
          </Link>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify the build**

```bash
source ~/.nvm/nvm.sh && nvm use
npm run build
```

Expected: build succeeds and the route table lists `/fleet`, `/fleet/fjord` and `/fleet/aurora` as static.

- [ ] **Step 4: Commit**

```bash
git add app/fleet
git commit -m "feat: add fleet availability and unit detail pages"
```

---

## Task 12: The summary panel

Presentational only. It receives a configuration and renders the two totals. It computes nothing that `priceLease` does not.

**Files:**
- Create: `app/lease/summary-panel.tsx`

- [ ] **Step 1: Write the component**

Create `app/lease/summary-panel.tsx`:

```tsx
'use client'

import { EXTRAS, KORG, getUnit } from '@/lib/fleet'
import { formatEur } from '@/lib/format'
import { priceLease, type LeaseConfig } from '@/lib/pricing'

export function SummaryPanel({ config }: { config: LeaseConfig }) {
  const unit = getUnit(config.unitSlug)
  if (!unit) return null

  const { monthlyTotalCents, oneTimeTotalCents } = priceLease(config)
  const selectedExtras = EXTRAS.filter((e) => config.extras.includes(e.id))

  return (
    <aside className="rounded-lg border border-line bg-paper p-6 lg:sticky lg:top-8">
      <h2 className="register">Contract summary</h2>

      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-stone">Unit</dt>
          <dd>
            {unit.name} &times; {config.quantity}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-stone">Term</dt>
          <dd>{config.termMonths} months</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-stone">Base rate</dt>
          <dd>{formatEur(unit.monthlyRates[config.termMonths])} / unit / month</dd>
        </div>
        {selectedExtras.map((extra) => (
          <div key={extra.id} className="flex justify-between gap-4">
            <dt className="text-stone">{extra.name}</dt>
            <dd>{formatEur(extra.monthlyCents)} / unit / month</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 border-t border-line pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-stone">Monthly total</span>
          <span className="font-display text-3xl">{formatEur(monthlyTotalCents)}</span>
        </div>

        {oneTimeTotalCents > 0 && (
          <div className="mt-3 flex items-baseline justify-between gap-4">
            <span className="text-sm text-stone">{KORG.name}, one-time</span>
            <span className="font-display text-xl">{formatEur(oneTimeTotalCents)}</span>
          </div>
        )}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-stone">
        Figures are indicative until the contract is counter-signed. Laundering, exchanges and
        return collection are included in the monthly rate.
      </p>
    </aside>
  )
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
source ~/.nvm/nvm.sh && nvm use
npx tsc --noEmit
```

Expected: no output, exit 0.

- [ ] **Step 3: Commit**

```bash
git add app/lease/summary-panel.tsx
git commit -m "feat: add contract summary panel"
```

---

## Task 13: The Server Action

**Files:**
- Create: `app/actions/submit-lease.ts`

- [ ] **Step 1: Install the Blob SDK**

```bash
source ~/.nvm/nvm.sh && nvm use
npm install @vercel/blob
```

- [ ] **Step 2: Write the action**

Create `app/actions/submit-lease.ts`:

```ts
'use server'

import { put } from '@vercel/blob'
import { redirect } from 'next/navigation'
import { leaseSchema } from '@/lib/lease-schema'
import { priceLease } from '@/lib/pricing'

export interface LeaseFormState {
  fieldErrors?: Record<string, string>
  formError?: string
}

const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function makeReference(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  const body = Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join('')
  return `LAF-${body}`
}

export async function submitLease(
  _prev: LeaseFormState,
  formData: FormData,
): Promise<LeaseFormState> {
  // Honeypot: bots fill every field, humans never see this one.
  if (formData.get('website')) {
    redirect(`/lease/submitted?ref=${makeReference()}`)
  }

  const parsed = leaseSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    company: formData.get('company'),
    street: formData.get('street'),
    houseNumber: formData.get('houseNumber'),
    postcode: formData.get('postcode'),
    city: formData.get('city'),
    country: formData.get('country'),
    unitSlug: formData.get('unitSlug'),
    termMonths: formData.get('termMonths'),
    quantity: formData.get('quantity'),
    extras: formData.getAll('extras'),
    korg: formData.get('korg') === 'on',
    consent: formData.get('consent') === 'on',
  })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      fieldErrors[key] ??= issue.message
    }
    return { fieldErrors }
  }

  const d = parsed.data
  const pricing = priceLease({
    unitSlug: d.unitSlug,
    termMonths: d.termMonths,
    quantity: d.quantity,
    extras: d.extras,
    korg: d.korg,
  })

  const ref = makeReference()
  const record = {
    ref,
    submittedAt: new Date().toISOString(),
    lessee: {
      fullName: d.fullName,
      email: d.email,
      phone: d.phone,
      company: d.company,
    },
    delivery: {
      street: d.street,
      houseNumber: d.houseNumber,
      postcode: d.postcode,
      city: d.city,
      country: d.country,
    },
    lease: {
      unitSlug: d.unitSlug,
      termMonths: d.termMonths,
      quantity: d.quantity,
      extras: d.extras,
      korg: d.korg,
    },
    pricing: { ...pricing, currency: 'EUR' },
  }

  try {
    await put(`leases/${ref}.json`, JSON.stringify(record, null, 2), {
      access: 'private',
      addRandomSuffix: false,
      contentType: 'application/json',
    })
  } catch (error) {
    console.error('[lease] blob write failed', error)
    return { formError: 'We could not file your contract. Please try again.' }
  }

  redirect(`/lease/submitted?ref=${ref}`)
}
```

`redirect()` throws a control-flow signal, so both calls must stay outside the `try` block. Moving either one inside would turn a successful submission into the failure message.

- [ ] **Step 3: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no output, exit 0.

If `access: 'private'` is rejected by the installed SDK's types, the package predates private blobs — run `npm install @vercel/blob@latest` and re-check rather than downgrading to `'public'`.

- [ ] **Step 4: Commit**

```bash
git add app/actions package.json package-lock.json
git commit -m "feat: add lease submission server action"
```

---

## Task 14: The lease form

**Files:**
- Create: `app/lease/lease-form.tsx`
- Create: `app/lease/page.tsx`

- [ ] **Step 1: Write the client form**

Create `app/lease/lease-form.tsx`:

```tsx
'use client'

import { useActionState, useEffect, useState } from 'react'
import { submitLease, type LeaseFormState } from '@/app/actions/submit-lease'
import { EXTRAS, FLEET, KORG, TERMS, type ExtraId, type TermMonths, type UnitSlug } from '@/lib/fleet'
import { formatEur } from '@/lib/format'
import { SummaryPanel } from './summary-panel'

const FIELD =
  'mt-1 w-full rounded border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink'
const LABEL = 'block text-sm text-stone'

function Field({
  name,
  label,
  error,
  type = 'text',
  required = true,
  defaultValue,
  autoComplete,
}: {
  name: string
  label: string
  error?: string
  type?: string
  required?: boolean
  defaultValue?: string
  autoComplete?: string
}) {
  const errorId = `${name}-error`
  return (
    <div>
      <label className={LABEL} htmlFor={name}>
        {label}
        {!required && <span className="text-stone"> (optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${FIELD} ${error ? 'border-red-700' : ''}`}
      />
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

export function LeaseForm({ initialUnit }: { initialUnit: UnitSlug }) {
  const [state, formAction, pending] = useActionState<LeaseFormState, FormData>(submitLease, {})
  const [unitSlug, setUnitSlug] = useState<UnitSlug>(initialUnit)
  const [termMonths, setTermMonths] = useState<TermMonths>(24)
  const [quantity, setQuantity] = useState(1)
  const [extras, setExtras] = useState<ExtraId[]>([])
  const [korg, setKorg] = useState(false)

  const errors = state.fieldErrors ?? {}

  useEffect(() => {
    const first = Object.keys(errors)[0]
    if (first) document.getElementById(first)?.focus()
    // Re-run only when a new set of errors arrives.
  }, [state])

  function toggleExtra(id: ExtraId) {
    setExtras((current) =>
      current.includes(id) ? current.filter((e) => e !== id) : [...current, id],
    )
  }

  return (
    <form action={formAction} className="grid gap-12 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-12">
        {state.formError && (
          <p role="alert" className="rounded border border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800">
            {state.formError}
          </p>
        )}

        <fieldset>
          <legend className="font-display text-2xl">Lessee details</legend>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field name="fullName" label="Full name" error={errors.fullName} autoComplete="name" />
            <Field name="email" label="Email" type="email" error={errors.email} autoComplete="email" />
            <Field name="phone" label="Telephone" type="tel" error={errors.phone} autoComplete="tel" />
            <Field
              name="company"
              label="Company"
              required={false}
              error={errors.company}
              autoComplete="organization"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-2xl">Delivery address</legend>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field name="street" label="Street" error={errors.street} autoComplete="address-line1" />
            <Field name="houseNumber" label="House number" error={errors.houseNumber} />
            <Field name="postcode" label="Postcode" error={errors.postcode} autoComplete="postal-code" />
            <Field name="city" label="City" error={errors.city} autoComplete="address-level2" />
            <Field
              name="country"
              label="Country"
              defaultValue="NL"
              error={errors.country}
              autoComplete="country"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-2xl">Lease configuration</legend>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className={LABEL} htmlFor="unitSlug">
                Unit
              </label>
              <select
                id="unitSlug"
                name="unitSlug"
                value={unitSlug}
                onChange={(e) => setUnitSlug(e.target.value as UnitSlug)}
                className={FIELD}
              >
                {FLEET.map((unit) => (
                  <option key={unit.slug} value={unit.slug}>
                    {unit.name} — {unit.colourway}
                  </option>
                ))}
              </select>
              {errors.unitSlug && <p className="mt-1 text-xs text-red-700">{errors.unitSlug}</p>}
            </div>

            <div>
              <label className={LABEL} htmlFor="quantity">
                Quantity
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className={FIELD}
                aria-describedby={errors.quantity ? 'quantity-error' : undefined}
              />
              {errors.quantity && (
                <p id="quantity-error" className="mt-1 text-xs text-red-700">
                  {errors.quantity}
                </p>
              )}
            </div>
          </div>

          <fieldset className="mt-8">
            <legend className={LABEL}>Term</legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {TERMS.map((term) => (
                <label
                  key={term}
                  className={`cursor-pointer rounded border px-4 py-3 text-sm transition-colors ${
                    termMonths === term ? 'border-ink bg-olive-soft' : 'border-line bg-paper'
                  }`}
                >
                  <input
                    type="radio"
                    name="termMonths"
                    value={term}
                    checked={termMonths === term}
                    onChange={() => setTermMonths(term)}
                    className="sr-only"
                  />
                  <span className="block font-display text-lg">{term} months</span>
                  <span className="text-xs text-stone">
                    {formatEur(FLEET.find((u) => u.slug === unitSlug)!.monthlyRates[term])} / month
                  </span>
                </label>
              ))}
            </div>
            {errors.termMonths && <p className="mt-1 text-xs text-red-700">{errors.termMonths}</p>}
          </fieldset>

          <fieldset className="mt-8">
            <legend className={LABEL}>Extras</legend>
            <div className="mt-2 space-y-3">
              {EXTRAS.map((extra) => (
                <label
                  key={extra.id}
                  className="flex cursor-pointer gap-3 rounded border border-line bg-paper px-4 py-3"
                >
                  <input
                    type="checkbox"
                    name="extras"
                    value={extra.id}
                    checked={extras.includes(extra.id)}
                    onChange={() => toggleExtra(extra.id)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm">
                      {extra.name} — {formatEur(extra.monthlyCents)} / unit / month
                    </span>
                    <span className="block text-xs text-stone">{extra.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mt-8 flex cursor-pointer gap-3 rounded border border-line bg-paper px-4 py-3">
            <input
              type="checkbox"
              name="korg"
              checked={korg}
              onChange={(e) => setKorg(e.target.checked)}
              className="mt-1"
            />
            <span>
              <span className="block text-sm">
                Add {KORG.name} — {formatEur(KORG.oneTimeCents)}, one-time
              </span>
              <span className="block text-xs text-stone">
                {KORG.subtitle}. {KORG.unitsEverAvailable} available, ever. Sold outright, not
                leased.
              </span>
            </span>
          </label>
        </fieldset>

        <div>
          <label className="flex cursor-pointer gap-3 text-sm">
            <input type="checkbox" id="consent" name="consent" className="mt-1" />
            <span>I accept the General Terms of Warmth.</span>
          </label>
          {errors.consent && <p className="mt-1 text-xs text-red-700">{errors.consent}</p>}

          {/* Honeypot: hidden from users, irresistible to bots. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-px w-px opacity-0"
          />

          <button
            type="submit"
            disabled={pending}
            className="mt-8 rounded-full bg-ink px-8 py-3 text-paper transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {pending ? 'Filing…' : 'Submit contract'}
          </button>
        </div>
      </div>

      <SummaryPanel config={{ unitSlug, termMonths, quantity, extras, korg }} />
    </form>
  )
}
```

- [ ] **Step 2: Write the server shell**

Create `app/lease/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { UNIT_SLUGS, type UnitSlug } from '@/lib/fleet'
import { LeaseForm } from './lease-form'

export const metadata: Metadata = {
  title: 'Start a contract — Lease-a-Fleece',
  description: 'Configure and submit a fleece lease agreement.',
}

export default async function LeasePage({
  searchParams,
}: {
  searchParams: Promise<{ unit?: string }>
}) {
  const { unit } = await searchParams
  const initialUnit: UnitSlug = UNIT_SLUGS.includes(unit as UnitSlug)
    ? (unit as UnitSlug)
    : UNIT_SLUGS[0]

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl tracking-tight">Start a contract</h1>
      <p className="mt-4 max-w-xl text-stone">
        Applications are reviewed in the order received. Approved contracts are dispatched within
        three working days.
      </p>
      <div className="mt-12">
        <LeaseForm initialUnit={initialUnit} />
      </div>
    </div>
  )
}
```

An unknown `?unit=` value falls through to the first fleet unit rather than erroring, as the spec requires.

- [ ] **Step 3: Verify the build**

```bash
source ~/.nvm/nvm.sh && nvm use
npx tsc --noEmit && npm run build
```

Expected: both succeed.

- [ ] **Step 4: Exercise the form locally**

Run `npm run dev` and visit `http://localhost:3000/lease?unit=aurora`.

Confirm:
- Aurora is preselected.
- Changing term, quantity, extras and KORG updates the summary panel immediately.
- Submitting with an empty name and a bad email re-renders with inline errors beside those fields and moves focus to the name field.
- Submitting a complete form fails with "We could not file your contract" — there is no Blob token yet. This is the expected failure, and it proves the error path works.

- [ ] **Step 5: Commit**

```bash
git add app/lease
git commit -m "feat: add lease contract form"
```

---

## Task 15: The confirmation page

**Files:**
- Create: `app/lease/submitted/page.tsx`

- [ ] **Step 1: Write the page**

Create `app/lease/submitted/page.tsx`:

```tsx
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contract received — Lease-a-Fleece',
}

export default async function SubmittedPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const { ref } = await searchParams

  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <p className="register">Application received</p>
      <h1 className="mt-4 font-display text-4xl tracking-tight">Your contract is on file.</h1>

      {ref && (
        <div className="mt-8 rounded-lg border border-line bg-paper px-6 py-5">
          <p className="register">Reference</p>
          <p className="mt-2 font-mono text-3xl tracking-widest">{ref}</p>
        </div>
      )}

      <div className="mt-10 space-y-4 leading-relaxed text-stone">
        <p>
          Quote this reference in any correspondence. Our underwriting team reviews applications in
          the order received.
        </p>
        <p>
          If approved, your unit is dispatched within three working days and the first laundering
          collection is scheduled automatically.
        </p>
      </div>

      <Link
        href="/"
        className="mt-12 inline-block rounded-full bg-ink px-7 py-3 text-paper transition-opacity hover:opacity-85"
      >
        Return home
      </Link>
    </div>
  )
}
```

- [ ] **Step 2: Verify the build**

```bash
source ~/.nvm/nvm.sh && nvm use
npm run build
```

Expected: build succeeds; all five routes present.

- [ ] **Step 3: Commit**

```bash
git add app/lease/submitted
git commit -m "feat: add contract confirmation page"
```

---

## Task 16: Deploy to Erik's personal Vercel account

The target scope is `erik-kallen` (`https://vercel.com/erik-kallen`) — **not** the EVAbits team.

**Files:**
- Modify: `.gitignore` (confirm `.vercel` and `.env*.local` are ignored)

- [ ] **Step 1: Install the Vercel CLI**

```bash
source ~/.nvm/nvm.sh && nvm use
npm i -g vercel
vercel --version
```

- [ ] **Step 2: Confirm authentication**

```bash
vercel whoami
```

Expected: `erik-kallen`. If this errors, ask Erik to run `! vercel login` in the session — the login flow is interactive and cannot be driven from a tool call.

- [ ] **Step 3: Link to the personal scope**

```bash
cd /home/erikkallen/Projects/erik/lease-a-fleece
vercel link --scope erik-kallen --project lease-a-fleece --yes
cat .vercel/project.json
```

Expected: `project.json` exists. Its `orgId` must be a `user_*` identifier, not `team_fv4rDAawRICrAQf3N6cQ2twC` — the latter would mean it linked to EVAbits. If it did, delete `.vercel` and repeat with the explicit scope.

- [ ] **Step 4: Verify `.gitignore` covers Vercel artefacts**

```bash
grep -E '^\.vercel|^\.env\*\.local' .gitignore
```

Expected: both lines present. Add whichever is missing.

- [ ] **Step 5: Create the Blob store**

```bash
vercel blob store add lease-a-fleece-leases
```

If the CLI does not support store creation in the installed version, create the store from the Vercel dashboard under the project's Storage tab and connect it to the project. Either route must end with `BLOB_READ_WRITE_TOKEN` set on the project.

- [ ] **Step 6: Pull environment variables**

```bash
vercel env pull .env.local
grep -c BLOB_READ_WRITE_TOKEN .env.local
```

Expected: `1`.

- [ ] **Step 7: Verify persistence locally**

```bash
npm run dev
```

Submit a complete contract at `http://localhost:3000/lease`. Expect a redirect to `/lease/submitted?ref=LAF-…`. Then confirm the file landed:

```bash
vercel blob list --prefix leases/
```

Expected: a `leases/LAF-XXXXXX.json` entry. This is the single most important check in the plan — it is the one requirement the whole site exists to satisfy.

- [ ] **Step 8: Deploy a preview**

```bash
vercel deploy
```

Open the preview URL and submit one contract end to end. Confirm a second entry appears in `vercel blob list --prefix leases/`.

- [ ] **Step 9: Promote to production**

```bash
vercel deploy --prod
```

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: link project to personal Vercel scope"
```

---

## Task 17: Final review

- [ ] **Step 1: Run the full check**

```bash
source ~/.nvm/nvm.sh && nvm use
npm test && npx tsc --noEmit && npm run lint && npm run build
```

Expected: all four pass.

- [ ] **Step 2: Walk the site**

On the production URL, confirm every one of these:

- `/` — the olive unit sits centred on the hero panel with no visible image background, both unit cards show a price, both CTAs reach `/lease`
- `/fleet` — fleet size reads 2 units, utilisation reads 0%, the KORG carrier renders contained on its panel
- `/fleet/fjord` and `/fleet/aurora` — spec table complete, three-term rate table, "Lease this unit" carries the `?unit=` parameter through
- `/lease` — summary panel tracks every configuration change; validation errors render inline
- A submitted contract reaches `/lease/submitted` with a reference, and the JSON appears in Blob

- [ ] **Step 3: Check it at phone width**

Narrow the browser to 390px. Confirm no horizontal scrolling on any route and that the summary panel stacks below the form rather than beside it.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: address final review findings"
```
