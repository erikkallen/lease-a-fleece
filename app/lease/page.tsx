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
