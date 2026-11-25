import { toDateKey } from './utils'

function getOrCreate(map, key, create) {
  if (!map.has(key)) map.set(key, create())
  return map.get(key)
}

// Groups sales as: year -> month -> week -> day -> list of sales.
// Newest first at every level.
export function buildSalesTree(sales) {
  const sorted = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date))
  const years = new Map()

  for (const sale of sorted) {
    const d = new Date(sale.date)

    // Monday of that sale's week
    const monday = new Date(d)
    monday.setDate(d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1))

    const year = String(d.getFullYear())
    const month = d.toLocaleString('fr-FR', { month: 'long' })
    const week = `Semaine du ${monday.toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric',
    })}`
    const day = d.toLocaleDateString('fr-FR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })

    const months = getOrCreate(years, year, () => new Map())
    const weeks = getOrCreate(months, month, () => new Map())
    const days = getOrCreate(weeks, week, () => new Map())
    getOrCreate(days, day, () => []).push(sale)
  }

  return years
}


// The "business week" runs from Saturday to Friday.
export function getSaturdayFridayRange(dateInput) {
  const date = new Date(dateInput)
  date.setHours(0, 0, 0, 0)

  const diff = (date.getDay() - 6 + 7) % 7 // days since the last Saturday
  const start = new Date(date)
  start.setDate(date.getDate() - diff)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

// The weeks that have at least one sale, newest first, for the week selector.
export function getWeekOptions(sales) {
  const weeks = new Map()
  sales.forEach((sale) => {
    const { start, end } = getSaturdayFridayRange(sale.date)
    weeks.set(start.getTime(), { start, end })
  })

  const format = (d) =>
    d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })

  return [...weeks.values()]
    .sort((a, b) => b.start - a.start)
    .map((w) => ({
      value: w.start.getTime(),
      label: `Semaine du ${format(w.start)} au ${format(w.end)}`,
    }))
}

// The squares of the day strip: the last 90 days plus today, oldest first.
export function getRecentDays(daysBack = 90) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days = []
  for (let i = daysBack; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push({
      key: toDateKey(d),
      dayName: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString('fr-FR', { month: 'short' }),
    })
  }
  return days
}

// The sales that match the current filter.
export function filterSales(sales, filter) {
  if (filter.type === 'week') {
    const { start, end } = getSaturdayFridayRange(filter.start)
    return sales.filter((s) => {
      const d = new Date(s.date)
      return d >= start && d <= end
    })
  }

  if (filter.type === 'days') {
    return sales.filter((s) => filter.keys.includes(toDateKey(s.date)))
  }

  return sales
}
