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

export function isYesterday(date) {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date, yesterday)
}

// The last 2 different quantities (not from today) in a list of sales.
// pastSales must be sorted newest first.
export function getRecentQuantities(pastSales, field) {
  const values = []
  for (const sale of pastSales) {
    if (isToday(sale.date)) continue
    const qty = parseFloat(sale[field]) || 0
    if (qty <= 0 || values.includes(qty)) continue
    values.push(qty)
    if (values.length === 2) break
  }
  return values
}

// Turns a date into 'YYYY-MM-DD' (local time). Used to compare days.
export function toDateKey(date) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
