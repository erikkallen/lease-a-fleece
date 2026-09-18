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
