import { getWeekOptions } from '../history'

function WeekSelect({ sales, filter, setFilter }) {
  const options = getWeekOptions(sales)

  // The select shows a week only when the filter is a week
  const value = filter.type === 'week' ? String(filter.start) : 'all'

  function handleChange(e) {
    const chosen = e.target.value
    setFilter(
      chosen === 'all'
        ? { type: 'all' }
        : { type: 'week', start: Number(chosen) }
    )
  }

  return (
    <div className="form-group">
      <label htmlFor="history-week-select">Semaine</label>
      <select
        id="history-week-select"
        className="custom-select"
        value={value}
        onChange={handleChange}
      >
        <option value="all">Toutes les ventes</option>
        {options.map((week) => (
          <option key={week.value} value={String(week.value)}>
            {week.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default WeekSelect
