const EUR = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
})

export function formatEur(cents: number): string {
  return EUR.format(cents / 100)
}
