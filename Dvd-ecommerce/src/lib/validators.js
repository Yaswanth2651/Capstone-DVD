export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

export function validatePassword(password) {
  const p = String(password || '')
  const errors = []
  if (p.length < 8) errors.push('Password must be at least 8 characters.')
  if (!/[a-z]/.test(p)) errors.push('Password must include a lowercase letter.')
  if (!/[A-Z]/.test(p)) errors.push('Password must include an uppercase letter.')
  if (!/\d/.test(p)) errors.push('Password must include a number.')
  return errors
}

export function validateRequired(value, label) {
  if (String(value || '').trim().length === 0) return `${label} is required.`
  return null
}

