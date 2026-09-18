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
    composition: '100% polyester anti-pill fleece, blanket-stitch edging',
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
      'Aurora is specified in ivory, which is a decision the lessee makes with their eyes open. Identical in construction to Fjord and priced fractionally higher to reflect the risk profile.',
    colourway: 'Ivory',
    dimensionsCm: '130 × 160',
    gsm: 260,
    composition: '100% polyester anti-pill fleece, blanket-stitch edging',
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

/**
 * The Five-Kilometre Concession. Presented as a standing contractual clause
 * rather than a promotion, because a leasing firm would not call it a promotion.
 */
export const CONCESSION = {
  name: 'The Five-Kilometre Concession',
  short: 'Five-Kilometre Concession',
  clause:
    'Lessees who complete a supervised five-kilometre course are entitled to their first month at no charge. One claim per lessee. Distance is taken on trust; our fleet does not run.',
  checkboxLabel: 'I have completed a supervised five-kilometre course.',
} as const

/** The year the firm was founded. Forty years of continuous operation. */
export const FOUNDED = 1986
