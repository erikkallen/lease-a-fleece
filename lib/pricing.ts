import { KORG, getExtra, getUnit, type ExtraId, type TermMonths, type UnitSlug } from './fleet'

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
