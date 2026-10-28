import { isToday, isSameDay, sumBy } from './utils'

// Returns today's stock. If today has no entry yet,
// carry over what was left from the last day.
export function getTodayStock(dailyStock, sales) {
  const todayEntry = dailyStock.find((s) => isToday(s.date))
  if (todayEntry) return todayEntry

  if (dailyStock.length > 0) {
    const last = [...dailyStock].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )[0]
    const lastDaySales = sales.filter((s) => isSameDay(s.date, last.date))

    return {
      date: new Date().toISOString(),
      milkOwned: Math.max(0, (parseFloat(last.milkOwned) || 0) - sumBy(lastDaySales, 'milkQty')),
      lbenOwned: Math.max(0, (parseFloat(last.lbenOwned) || 0) - sumBy(lastDaySales, 'lbenQty')),
      isLocked: false,
    }
  }

  return { date: new Date().toISOString(), milkOwned: 0, lbenOwned: 0, isLocked: false }
}

// Returns a NEW stock list with today's entry saved or updated.
export function saveTodayStock(dailyStock, milkOwned, lbenOwned, isLocked) {
  const index = dailyStock.findIndex((s) => isToday(s.date))

  if (index > -1) {
    return dailyStock.map((s, i) =>
      i === index ? { ...s, milkOwned, lbenOwned, isLocked } : s
    )
  }

  return [
    ...dailyStock,
    { id: Date.now(), date: new Date().toISOString(), milkOwned, lbenOwned, isLocked },
  ]
}
