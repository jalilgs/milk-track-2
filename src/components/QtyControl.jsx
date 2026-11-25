import { useState } from 'react'

function QtyControl({ value, onChange, suggestions = [] }) {
  const [focused, setFocused] = useState(false)

  function step(delta) {
    onChange(Math.max(0, (parseInt(value) || 0) + delta))
  }

  return (
    <div className="qty-control">
      <button type="button" className="qty-btn" onClick={() => step(-1)}>
        -
      </button>
      <input
        type="number"
        placeholder="0"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <button type="button" className="qty-btn" onClick={() => step(1)}>
        +
      </button>

      {suggestions.length > 0 && (
        <div className={`qty-suggestions ${focused ? 'visible' : ''}`}>
          {suggestions.map((v) => (
            <button
              key={v}
              type="button"
              className="qty-suggestion-chip"
              onPointerDown={(e) => {
                e.preventDefault()
                onChange(v)
                setFocused(false)
              }}
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default QtyControl
