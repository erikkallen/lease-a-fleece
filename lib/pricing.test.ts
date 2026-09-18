import { describe, expect, it } from 'vitest'
import { priceLease } from './pricing'
import { formatEur } from './format'

describe('priceLease', () => {
  it('prices a single unit at the 12-month rate', () => {
    expect(
      priceLease({ unitSlug: 'fjord', termMonths: 12, quantity: 1, extras: [], korg: false }),
    ).toEqual({ monthlyTotalCents: 1250, oneTimeTotalCents: 0, firstMonthCents: 1250 })
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

  it('waives the first month when the concession is claimed', () => {
    const result = priceLease({
      unitSlug: 'fjord',
      termMonths: 24,
      quantity: 2,
      extras: [],
      korg: false,
      fiveK: true,
    })
    expect(result.firstMonthCents).toBe(0)
    // Only month one is free: the ongoing rate is untouched.
    expect(result.monthlyTotalCents).toBe(975 * 2)
  })

  it('charges the first month normally without the concession', () => {
    const result = priceLease({
      unitSlug: 'fjord',
      termMonths: 24,
      quantity: 2,
      extras: [],
      korg: false,
    })
    expect(result.firstMonthCents).toBe(975 * 2)
  })

  it('still charges KORG when the first month is waived', () => {
    const result = priceLease({
      unitSlug: 'aurora',
      termMonths: 12,
      quantity: 1,
      extras: [],
      korg: true,
      fiveK: true,
    })
    expect(result.firstMonthCents).toBe(0)
    expect(result.oneTimeTotalCents).toBe(3500)
  })

  it('throws on an unknown unit', () => {
    expect(() =>
      // @ts-expect-error deliberately invalid slug
      priceLease({ unitSlug: 'nope', termMonths: 12, quantity: 1, extras: [], korg: false }),
    ).toThrow(/unknown unit/i)
  })
})

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
