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
