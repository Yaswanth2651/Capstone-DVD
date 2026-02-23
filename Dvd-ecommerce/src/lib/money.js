export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
    amount,
  )
}

export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

