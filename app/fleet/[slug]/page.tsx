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
