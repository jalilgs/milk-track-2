import { useEffect, useRef } from 'react'
import { getRecentDays, getSaturdayFridayRange } from '../history'
import { toDateKey } from '../utils'

function DayStrip({ filter, setFilter }) {
  const stripRef = useRef(null)
  const days = getRecentDays(90)
  const selectedKeys = filter.type === 'days' ? filter.keys : []

  // Runs once, after the strip is on the page:
  // scroll to the start of the current week (the last Saturday)
  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return

    const { start } = getSaturdayFridayRange(new Date())
    const startButton = strip.querySelector(`[data-date="${toDateKey(start)}"]`)
    if (startButton) {
      strip.scrollLeft = startButton.offsetLeft - 8
    }
  }, [])

  function toggleDay(key) {
    const next = selectedKeys.includes(key)
      ? selectedKeys.filter((k) => k !== key)
      : [...selectedKeys, key]

    setFilter(next.length > 0 ? { type: 'days', keys: next } : { type: 'all' })
  }

  return (
    <div className="day-strip-wrapper">
      <div className="day-strip" ref={stripRef} style={{ position: 'relative' }}>
        {days.map((day) => (
          <button
            key={day.key}
            type="button"
            data-date={day.key}
            className={`day-square ${selectedKeys.includes(day.key) ? 'selected' : ''}`}
            onClick={() => toggleDay(day.key)}
          >
            <span className="day-square__name">{day.dayName}</span>
            <span className="day-square__num">{day.dayNum}</span>
            <span className="day-square__month">{day.monthName}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default DayStrip
