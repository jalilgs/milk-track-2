function QtyControl({ value, onChange }) {
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
      />
      <button type="button" className="qty-btn" onClick={() => step(1)}>
        +
      </button>
    </div>
  )
}

export default QtyControl
