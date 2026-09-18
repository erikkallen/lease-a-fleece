import Image from 'next/image'
import type { Metadata } from 'next'
import { UnitCard } from '@/components/unit-card'
import { FLEET, KORG } from '@/lib/fleet'
import { formatEur } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Fleet & availability — Lease-a-Fleece',
  description: 'Current fleet size, utilisation and unit specifications.',
}

export default function FleetPage() {
  const total = FLEET.reduce((sum, u) => sum + u.totalUnits, 0)
  const available = FLEET.reduce((sum, u) => sum + u.availableUnits, 0)
  const utilisation = Math.round(((total - available) / total) * 100)

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl tracking-tight">Fleet &amp; availability</h1>
      <p className="mt-4 max-w-xl text-stone">
        Every unit in our fleet is tracked individually. Availability below is live.
      </p>

      <dl className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
        {[
          ['Fleet size', `${total} units`],
          ['Available now', `${available} units`],
          ['Current utilisation', `${utilisation}%`],
        ].map(([label, value]) => (
          <div key={label} className="bg-paper px-6 py-5">
            <dt className="register">{label}</dt>
            <dd className="mt-1 font-display text-2xl">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {FLEET.map((unit) => (
          <UnitCard key={unit.slug} unit={unit} />
        ))}
      </div>

      <section className="mt-20 grid items-center gap-10 rounded-lg border border-line bg-paper p-8 lg:grid-cols-2">
        <div className="relative aspect-4/3 overflow-hidden rounded bg-olive-soft">
          <Image
            src={KORG.image}
            alt="The KORG carrier: a white perforated basket with bentwood handles"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-10"
          />
        </div>
        <div>
          <p className="register">Not for lease</p>
          <h2 className="mt-3 font-display text-3xl">
            {KORG.name} <span className="text-stone">— {KORG.subtitle}</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-stone">{KORG.description}</p>
          <p className="register mt-6">{KORG.assetCode}</p>
          <p className="mt-2 font-display text-3xl">{formatEur(KORG.oneTimeCents)}</p>
          <p className="text-xs text-stone">
            One-time. {KORG.unitsEverAvailable} available, ever. Add it to a contract.
          </p>
        </div>
      </section>
    </div>
  )
}
