import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { FOUNDED } from '@/lib/fleet'
import { TITLE_RECORDS, getTitleRecord } from '@/lib/title'

export function generateStaticParams() {
  return TITLE_RECORDS.map((r) => ({ code: r.code }))
}

/**
 * Not indexed: the record names a private individual, and it exists to be
 * reached by scanning the patch, not by searching for him.
 */
export const metadata: Metadata = {
  title: 'Title verification — Lease-a-Fleece',
  robots: { index: false, follow: false },
}

export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const record = getTitleRecord(code)
  if (!record) notFound()

  const rows: [string, string][] = [
    ['Asset code', record.code],
    ['Asset', record.asset],
    ['Colourway', record.colourway],
    ['Lessor', 'Lease-a-Fleece B.V., Groningen'],
    ['Lessee', record.lessee],
    ['Term', record.term],
    ['Disposition', record.disposition],
    ['Record issued', record.issued],
  ]

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="register">Title verification record</p>

      <div className="mt-6 flex items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element -- next/image does not optimise SVG. */}
        <img src="/seal.svg" alt="" width={78} height={78} className="shrink-0 opacity-90" />
        <div>
          <h1 className="font-display text-4xl leading-none tracking-tight">Title confirmed</h1>
          <p className="register mt-2">Verified against the register · {record.code}</p>
        </div>
      </div>

      <dl className="mt-12 divide-y divide-line border-y border-line">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-6 py-3.5 text-sm">
            <dt className="register shrink-0 pt-0.5">{label}</dt>
            <dd className="text-right">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-10 leading-relaxed text-stone">
        This record is issued under Clause 8 of the General Terms of Warmth and confirms the
        ownership position of the asset identified above. It confers no right of possession on the
        reader.
      </p>

      <p className="register mt-6">
        Lease-a-Fleece B.V. · Est. {FOUNDED} · Forty years of continuous operation
      </p>

      <Link
        href="/"
        className="mt-12 inline-block rounded-full bg-ink px-7 py-3 text-paper transition-opacity hover:opacity-85"
      >
        Lease-a-Fleece
      </Link>
    </div>
  )
}
