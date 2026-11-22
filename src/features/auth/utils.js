export function getInitials(username) {
  if (!username) {
    return '··'
  }
  const parts = String(username)
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
  const initials = parts.map((part) => part[0]).join('').toUpperCase()
  return initials || '··'
}
