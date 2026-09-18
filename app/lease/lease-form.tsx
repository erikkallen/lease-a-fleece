'use client'

import { useActionState, useEffect, useState } from 'react'
import { submitLease, type LeaseFormState } from '@/app/actions/submit-lease'
import { EXTRAS, FLEET, KORG, TERMS, type ExtraId, type TermMonths, type UnitSlug } from '@/lib/fleet'
import { formatEur } from '@/lib/format'
import { SummaryPanel } from './summary-panel'

const FIELD =
  'mt-1 w-full rounded border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink'
const LABEL = 'block text-sm text-stone'

function Field({
  name,
  label,
  error,
  type = 'text',
  required = true,
  defaultValue,
  autoComplete,
}: {
  name: string
  label: string
  error?: string
  type?: string
  required?: boolean
  defaultValue?: string
  autoComplete?: string
}) {
  const errorId = `${name}-error`
  return (
    <div>
      <label className={LABEL} htmlFor={name}>
        {label}
        {!required && <span className="text-stone"> (optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${FIELD} ${error ? 'border-red-700' : ''}`}
      />
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

export function LeaseForm({ initialUnit }: { initialUnit: UnitSlug }) {
  const [state, formAction, pending] = useActionState<LeaseFormState, FormData>(submitLease, {})
  const [unitSlug, setUnitSlug] = useState<UnitSlug>(initialUnit)
  const [termMonths, setTermMonths] = useState<TermMonths>(24)
  const [quantity, setQuantity] = useState(1)
  const [extras, setExtras] = useState<ExtraId[]>([])
  const [korg, setKorg] = useState(false)

  const errors = state.fieldErrors ?? {}

  useEffect(() => {
    const first = Object.keys(errors)[0]
    if (first) document.getElementById(first)?.focus()
    // Re-run only when a new set of errors arrives.
  }, [state])

  function toggleExtra(id: ExtraId) {
    setExtras((current) =>
      current.includes(id) ? current.filter((e) => e !== id) : [...current, id],
    )
  }

  return (
    <form action={formAction} className="grid gap-12 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-12">
        {state.formError && (
          <p role="alert" className="rounded border border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800">
            {state.formError}
          </p>
        )}

        <fieldset>
          <legend className="font-display text-2xl">Lessee details</legend>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field name="fullName" label="Full name" error={errors.fullName} autoComplete="name" />
            <Field name="email" label="Email" type="email" error={errors.email} autoComplete="email" />
            <Field name="phone" label="Telephone" type="tel" error={errors.phone} autoComplete="tel" />
            <Field
              name="company"
              label="Company"
              required={false}
              error={errors.company}
              autoComplete="organization"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-2xl">Delivery address</legend>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field name="street" label="Street" error={errors.street} autoComplete="address-line1" />
            <Field name="houseNumber" label="House number" error={errors.houseNumber} />
            <Field name="postcode" label="Postcode" error={errors.postcode} autoComplete="postal-code" />
            <Field name="city" label="City" error={errors.city} autoComplete="address-level2" />
            <Field
              name="country"
              label="Country"
              defaultValue="NL"
              error={errors.country}
              autoComplete="country"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-2xl">Lease configuration</legend>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className={LABEL} htmlFor="unitSlug">
                Unit
              </label>
              <select
                id="unitSlug"
                name="unitSlug"
                value={unitSlug}
                onChange={(e) => setUnitSlug(e.target.value as UnitSlug)}
                className={FIELD}
              >
                {FLEET.map((unit) => (
                  <option key={unit.slug} value={unit.slug}>
                    {unit.name} — {unit.colourway}
                  </option>
                ))}
              </select>
              {errors.unitSlug && <p className="mt-1 text-xs text-red-700">{errors.unitSlug}</p>}
            </div>

            <div>
              <label className={LABEL} htmlFor="quantity">
                Quantity
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className={FIELD}
                aria-describedby={errors.quantity ? 'quantity-error' : undefined}
              />
              {errors.quantity && (
                <p id="quantity-error" className="mt-1 text-xs text-red-700">
                  {errors.quantity}
                </p>
              )}
            </div>
          </div>

          <fieldset className="mt-8">
            <legend className={LABEL}>Term</legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {TERMS.map((term) => (
                <label
                  key={term}
                  className={`cursor-pointer rounded border px-4 py-3 text-sm transition-colors ${
                    termMonths === term ? 'border-ink bg-olive-soft' : 'border-line bg-paper'
                  }`}
                >
                  <input
                    type="radio"
                    name="termMonths"
                    value={term}
                    checked={termMonths === term}
                    onChange={() => setTermMonths(term)}
                    className="sr-only"
                  />
                  <span className="block font-display text-lg">{term} months</span>
                  <span className="text-xs text-stone">
                    {formatEur(FLEET.find((u) => u.slug === unitSlug)!.monthlyRates[term])} / month
                  </span>
                </label>
              ))}
            </div>
            {errors.termMonths && <p className="mt-1 text-xs text-red-700">{errors.termMonths}</p>}
          </fieldset>

          <fieldset className="mt-8">
            <legend className={LABEL}>Extras</legend>
            <div className="mt-2 space-y-3">
              {EXTRAS.map((extra) => (
                <label
                  key={extra.id}
                  className="flex cursor-pointer gap-3 rounded border border-line bg-paper px-4 py-3"
                >
                  <input
                    type="checkbox"
                    name="extras"
                    value={extra.id}
                    checked={extras.includes(extra.id)}
                    onChange={() => toggleExtra(extra.id)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm">
                      {extra.name} — {formatEur(extra.monthlyCents)} / unit / month
                    </span>
                    <span className="block text-xs text-stone">{extra.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mt-8 flex cursor-pointer gap-3 rounded border border-line bg-paper px-4 py-3">
            <input
              type="checkbox"
              name="korg"
              checked={korg}
              onChange={(e) => setKorg(e.target.checked)}
              className="mt-1"
            />
            <span>
              <span className="block text-sm">
                Add {KORG.name} — {formatEur(KORG.oneTimeCents)}, one-time
              </span>
              <span className="block text-xs text-stone">
                {KORG.subtitle}. {KORG.unitsEverAvailable} available, ever. Sold outright, not
                leased.
              </span>
            </span>
          </label>
        </fieldset>

        <div>
          <label className="flex cursor-pointer gap-3 text-sm">
            <input type="checkbox" id="consent" name="consent" className="mt-1" />
            <span>I accept the General Terms of Warmth.</span>
          </label>
          {errors.consent && <p className="mt-1 text-xs text-red-700">{errors.consent}</p>}

          {/* Honeypot: hidden from users, irresistible to bots. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-px w-px opacity-0"
          />

          <button
            type="submit"
            disabled={pending}
            className="mt-8 rounded-full bg-ink px-8 py-3 text-paper transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {pending ? 'Filing…' : 'Submit contract'}
          </button>
        </div>
      </div>

      <SummaryPanel config={{ unitSlug, termMonths, quantity, extras, korg }} />
    </form>
  )
}
