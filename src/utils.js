export function formatMoney(n) {
  return `${(Number(n) || 0).toLocaleString('fr-FR')} DA`
}

export function clampNonNegative(value) {
  return Math.max(0, parseFloat(value) || 0)
}

export function isSameDay(dateA, dateB) {
  const a = new Date(dateA)
  const b = new Date(dateB)
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  )
}

export function isToday(date) {
  return isSameDay(date, new Date())
}

// Adds up one field across a list. Example: sumBy(sales, 'milkQty')
export function sumBy(items, field) {
  return items.reduce((sum, item) => sum + (parseFloat(item[field]) || 0), 0)
}
