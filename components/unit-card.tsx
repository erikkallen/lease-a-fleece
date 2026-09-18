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
