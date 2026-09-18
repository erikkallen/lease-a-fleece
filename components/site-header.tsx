import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bone/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5">
        <Link href="/" className="font-display text-lg whitespace-nowrap sm:text-xl">
          Lease&#8209;a&#8209;Fleece
        </Link>
        <nav className="flex items-center gap-4 sm:gap-8">
          <Link href="/fleet" className="register transition-colors hover:text-ink">
            Fleet
          </Link>
          <Link
            href="/lease"
            className="rounded-full bg-ink px-4 py-2 text-xs whitespace-nowrap text-paper transition-opacity hover:opacity-85 sm:px-5 sm:text-sm"
          >
            <span className="sm:hidden">Contract</span>
            <span className="hidden sm:inline">Start a contract</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
