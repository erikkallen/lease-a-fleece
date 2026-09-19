import { FLEET, KORG } from './fleet'

/**
 * Title records. A patch sewn onto a unit carries a QR to its record here, so
 * "SCAN TO VERIFY TITLE" resolves to something that actually states who owns
 * the thing. Assets are held by the lessor; the lessee holds possession only.
 */
export interface TitleRecord {
  code: string
  asset: string
  colourway: string
  lessee: string
  term: string
  issued: string
  disposition: string
}

const LESSEE = 'J. Olijve'
const ISSUED = '19 September 2026'

export const TITLE_RECORDS: TitleRecord[] = [
  ...FLEET.map((unit) => ({
    code: unit.assetCode,
    asset: `${unit.name} — ${unit.dimensionsCm} cm, ${unit.gsm} gsm`,
    colourway: unit.colourway,
    lessee: LESSEE,
    term: 'Perpetual',
    issued: ISSUED,
    disposition: 'On lease. Title retained by the lessor.',
  })),
  {
    code: KORG.assetCode,
    asset: `${KORG.name} — ${KORG.subtitle}`,
    colourway: 'White',
    lessee: LESSEE,
    term: 'Not applicable',
    issued: ISSUED,
    disposition: 'Sold outright. Title passed to the holder.',
  },
]

export function getTitleRecord(code: string): TitleRecord | undefined {
  return TITLE_RECORDS.find((r) => r.code.toLowerCase() === code.toLowerCase())
}
