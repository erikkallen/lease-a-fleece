import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bone/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-xl">
          Lease&#8209;a&#8209;Fleece
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="/fleet" className="register transition-colors hover:text-ink">
            Fleet
          </Link>
          <Link
            href="/lease"
            className="rounded-full bg-ink px-5 py-2 text-sm text-paper transition-opacity hover:opacity-85"
          >
            Start a contract
          </Link>
        </nav>
      </div>
    </header>
  )
}
