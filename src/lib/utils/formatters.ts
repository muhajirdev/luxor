export function formatPrice(cents: number): string {
  const dollars = cents / 100
  if (dollars >= 1000000) {
    return `$${(dollars / 1000000).toFixed(2)}M`
  } else if (dollars >= 1000) {
    return `$${(dollars / 1000).toFixed(1)}k`
  }
  return `$${dollars.toFixed(2)}`
}

export function formatTimeLeft(endsAt: Date | null): string {
  if (!endsAt) return 'Ongoing'
  const now = new Date()
  const diff = new Date(endsAt).getTime() - now.getTime()

  if (diff <= 0) return 'Ended'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
}

export function priceToCents(price: string): number | null {
  const parsed = parseFloat(price)
  if (isNaN(parsed) || parsed < 0) return null
  return Math.round(parsed * 100)
}
