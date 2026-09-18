export function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            {/* eslint-disable-next-line @next/next/no-img-element -- next/image does not optimise SVG; a plain img is right for a vector mark. */}
            <img src="/seal.svg" alt="" width={64} height={64} className="mb-4 opacity-80" />
            <p className="font-display text-lg">Lease&#8209;a&#8209;Fleece B.V.</p>
            <p className="mt-3 text-sm leading-relaxed text-stone">
              Registered warmth provider. Amsterdam, the Netherlands.
            </p>
          </div>
          <div className="max-w-xs text-sm leading-relaxed text-stone">
            <p>
              All fleece remains the property of the lessor at all times. Units are inspected on
              return.
            </p>
          </div>
          <div className="register leading-loose">
            <p>Est. 1986</p>
            <p>Fleet size — 002</p>
            <p>Jurisdiction — NL</p>
            <p>Terms — 12 / 24 / 36</p>
          </div>
        </div>
        <p className="register mt-12 border-t border-line pt-6">
          &copy; {new Date().getFullYear()} Lease&#8209;a&#8209;Fleece B.V.
        </p>
      </div>
    </footer>
  )
}
