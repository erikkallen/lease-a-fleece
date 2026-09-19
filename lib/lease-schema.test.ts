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
    city: 'Groningen',
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
