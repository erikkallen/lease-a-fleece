import type { Metadata } from 'next'
import { Fraunces, IBM_Plex_Mono, Karla } from 'next/font/google'
import { Grain } from '@/components/grain'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['SOFT', 'WONK'],
  variable: '--font-fraunces',
})
const karla = Karla({ subsets: ['latin'], variable: '--font-karla' })
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
})

export const metadata: Metadata = {
  title: 'Lease-a-Fleece — Fleece blankets, leased',
  description:
    'Full-service fleece leasing. Quarterly laundering included, swap units at any time, delivery within three working days.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${karla.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <Grain />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
