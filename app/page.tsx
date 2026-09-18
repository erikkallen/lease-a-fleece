import Image from 'next/image'
import Link from 'next/link'
import { UnitCard } from '@/components/unit-card'
import { CONCESSION, FLEET, FOUNDED } from '@/lib/fleet'
import { FEATURED, TESTIMONIALS } from '@/lib/testimonials'

const PROPOSITIONS = [
  {
    title: 'Quarterly laundering included',
    body: 'Every unit is collected, professionally laundered and returned within 48 hours. Four times a year, on a schedule you never have to think about.',
  },
  {
    title: 'Swap units at any time',
    body: 'Specified Fjord and found yourself wanting Aurora? One request and we exchange it. No fee, no adjustment to your term.',
  },
  {
    title: 'Delivery within three working days',
    body: 'Contracts approved before 14:00 are dispatched the same day. Our fleet is small, so it is never far away.',
  },
]

const STEPS = [
  { n: '01', title: 'Select a unit', body: 'Two are available. Both are excellent.' },
  { n: '02', title: 'Choose a term', body: 'Twelve, twenty-four or thirty-six months. Longer terms carry a lower monthly rate.' },
  { n: '03', title: 'Receive it', body: 'We deliver, you use it, we launder it. At end of term you renew, swap, or return the unit.' },
]

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="register rise">Est. 1986 · Amsterdam · Fleet size 002</p>
            <h1
              className="rise mt-6 font-display text-6xl leading-[0.98] sm:text-7xl"
              style={{ animationDelay: '80ms' }}
            >
              Never own a<br />
              blanket again.
            </h1>
            <p
              className="rise mt-7 max-w-md text-lg leading-relaxed text-stone"
              style={{ animationDelay: '160ms' }}
            >
              Full-service fleece leasing for the domestic interior since 1986. You get the
              warmth. We keep the asset, the laundering schedule and the depreciation.
            </p>
            <div
              className="rise mt-10 flex flex-wrap items-center gap-6"
              style={{ animationDelay: '240ms' }}
            >
              <Link
                href="/lease"
                className="rounded-full bg-ink px-7 py-3 text-paper transition-opacity hover:opacity-85"
              >
                Start a contract
              </Link>
              <Link href="/fleet" className="register transition-colors hover:text-ink">
                View the fleet &rarr;
              </Link>
            </div>
          </div>
          <div
            className="rise relative aspect-square overflow-hidden rounded-lg bg-olive-soft"
            style={{ animationDelay: '320ms' }}
          >
            <div
              aria-hidden="true"
              className="absolute bottom-[16%] left-1/2 h-6 w-1/2 -translate-x-1/2 rounded-[50%] bg-ink/15 blur-lg"
            />
            <Image
              src="/fleet/fjord-rolled.avif"
              alt={`${FLEET[0].name}, our olive unit, rolled for despatch`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-12"
            />
            <p className="register absolute bottom-5 left-6">
              {FLEET[0].assetCode} · {FLEET[0].dimensionsCm}
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-3">
          {PROPOSITIONS.map((p) => (
            <div key={p.title}>
              <h2 className="font-display text-xl">{p.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-20">
        <div className="flex flex-col items-center gap-4 border-b border-line pb-16 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- next/image does not optimise SVG; a plain img is right for a vector mark. */}
          <img src="/seal.svg" alt="" width={150} height={150} className="opacity-90" />
          <p className="font-display text-2xl">
            Forty years of continuous operation.
          </p>
          <p className="register">{FOUNDED}&ndash;{FOUNDED + 40} · Fleet size unchanged since 1986</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-3xl">The fleet</h2>
          <Link href="/fleet" className="text-sm text-stone underline-offset-4 hover:underline">
            Availability &amp; specifications
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {FLEET.map((unit) => (
            <UnitCard key={unit.slug} unit={unit} />
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="register">References</h2>

          <figure className="mt-8 max-w-3xl">
            <blockquote className="font-display text-3xl leading-[1.25] sm:text-4xl">
              &ldquo;{FEATURED.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6">
              <span className="text-sm">{FEATURED.name}</span>
              <span className="register ml-3">{FEATURED.role}</span>
              <span className="register mt-1 block">{FEATURED.since}</span>
            </figcaption>
          </figure>

          <div className="mt-16 grid gap-px border-t border-line bg-line sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="flex flex-col bg-bone px-6 pt-8 pb-8">
                <blockquote className="leading-relaxed text-stone">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                {/* Pushed to the bottom so attributions align across columns
                    of unequal quote length. */}
                <figcaption className="mt-6 pt-5 sm:mt-auto">
                  <span className="block text-sm">{t.name}</span>
                  <span className="register mt-1 block">{t.role}</span>
                  <span className="register mt-1 block">{t.since}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl">How leasing works</h2>
          <ol className="mt-10 grid gap-10 sm:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className="font-display text-sm text-stone">{s.n}</span>
                <h3 className="mt-2 font-display text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-14 border-t border-line pt-10">
            <p className="register">Clause 5.1 — {CONCESSION.name}</p>
            <p className="mt-3 max-w-2xl leading-relaxed text-stone">{CONCESSION.clause}</p>
          </div>

          <div className="mt-12 border-t border-line pt-10">
            <Link
              href="/lease"
              className="inline-block rounded-full bg-ink px-7 py-3 text-paper transition-opacity hover:opacity-85"
            >
              Start a contract
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
