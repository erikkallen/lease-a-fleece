'use client'

import { EXTRAS, KORG, getUnit } from '@/lib/fleet'
import { formatEur } from '@/lib/format'
import { priceLease, type LeaseConfig } from '@/lib/pricing'

export function SummaryPanel({ config }: { config: LeaseConfig }) {
  const unit = getUnit(config.unitSlug)
  if (!unit) return null

  const { monthlyTotalCents, oneTimeTotalCents } = priceLease(config)
  const selectedExtras = EXTRAS.filter((e) => config.extras.includes(e.id))

  return (
    <aside className="rounded-lg border border-line bg-paper p-6 lg:sticky lg:top-8">
      <h2 className="register">Contract summary</h2>

      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-stone">Unit</dt>
          <dd>
            {unit.name} &times; {config.quantity}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-stone">Term</dt>
          <dd>{config.termMonths} months</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-stone">Base rate</dt>
          <dd>{formatEur(unit.monthlyRates[config.termMonths])} / unit / month</dd>
        </div>
        {selectedExtras.map((extra) => (
          <div key={extra.id} className="flex justify-between gap-4">
            <dt className="text-stone">{extra.name}</dt>
            <dd>{formatEur(extra.monthlyCents)} / unit / month</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 border-t border-line pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-stone">Monthly total</span>
          <span className="font-display text-3xl">{formatEur(monthlyTotalCents)}</span>
        </div>

        {oneTimeTotalCents > 0 && (
          <div className="mt-3 flex items-baseline justify-between gap-4">
            <span className="text-sm text-stone">{KORG.name}, one-time</span>
            <span className="font-display text-xl">{formatEur(oneTimeTotalCents)}</span>
          </div>
        )}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-stone">
        Figures are indicative until the contract is counter-signed. Laundering, exchanges and
        return collection are included in the monthly rate.
      </p>
    </aside>
  )
}
