import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contract received — Lease-a-Fleece',
}

export default async function SubmittedPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const { ref } = await searchParams

  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <p className="register">Application received</p>
      <h1 className="mt-4 font-display text-4xl tracking-tight">Your contract is on file.</h1>

      {ref && (
        <div className="mt-8 rounded-lg border border-line bg-paper px-6 py-5">
          <p className="register">Reference</p>
          <p className="mt-2 font-mono text-3xl tracking-widest">{ref}</p>
        </div>
      )}

      <div className="mt-10 space-y-4 leading-relaxed text-stone">
        <p>
          Quote this reference in any correspondence. Our underwriting team reviews applications in
          the order received.
        </p>
        <p>
          If approved, your unit is dispatched within three working days and the first laundering
          collection is scheduled automatically.
        </p>
      </div>

      <Link
        href="/"
        className="mt-12 inline-block rounded-full bg-ink px-7 py-3 text-paper transition-opacity hover:opacity-85"
      >
        Return home
      </Link>
    </div>
  )
}
