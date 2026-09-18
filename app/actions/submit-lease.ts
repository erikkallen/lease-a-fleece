'use server'

import { put } from '@vercel/blob'
import { redirect } from 'next/navigation'
import { leaseSchema } from '@/lib/lease-schema'
import { priceLease } from '@/lib/pricing'

export interface LeaseFormState {
  fieldErrors?: Record<string, string>
  formError?: string
  /** Raw text values echoed back so a rejected form does not lose what was typed. */
  values?: Record<string, string>
}

/** The text inputs, in the order they appear in the form. */
const TEXT_FIELDS = [
  'fullName',
  'email',
  'phone',
  'company',
  'street',
  'houseNumber',
  'postcode',
  'city',
  'country',
] as const

function submittedValues(formData: FormData): Record<string, string> {
  return Object.fromEntries(
    TEXT_FIELDS.map((name) => [name, String(formData.get(name) ?? '')]),
  )
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
    fiveK: formData.get('fiveK') === 'on',
    consent: formData.get('consent') === 'on',
  })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      fieldErrors[key] ??= issue.message
    }
    return { fieldErrors, values: submittedValues(formData) }
  }

  const d = parsed.data
  const pricing = priceLease({
    unitSlug: d.unitSlug,
    termMonths: d.termMonths,
    quantity: d.quantity,
    extras: d.extras,
    korg: d.korg,
    fiveK: d.fiveK,
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
      fiveK: d.fiveK,
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
    return {
      formError: 'We could not file your contract. Please try again.',
      values: submittedValues(formData),
    }
  }

  redirect(`/lease/submitted?ref=${ref}`)
}
