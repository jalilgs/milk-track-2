import { useState } from 'react'
import { formatMoney, clampNonNegative } from '../utils'

function PricesCard({ prices, setPrices }) {
  const [milkDraft, setMilkDraft] = useState(prices.milk)
  const [lbenDraft, setLbenDraft] = useState(prices.lben)

  function handleSave() {
    const milk = clampNonNegative(milkDraft)
    const lben = clampNonNegative(lbenDraft)
    setMilkDraft(milk)
    setLbenDraft(lben)
    setPrices({ milk, lben, isLocked: true })
  }

  function handleEdit() {
    setPrices({ ...prices, isLocked: false })
  }

  if (prices.isLocked) {
    return (
      <div className="card">
        <div className="prices-display-row">
          <div className="price-display-block">
            <span className="product-label product-label--milk">Lait</span>
            <span className="price-figure milk-figure">{formatMoney(prices.milk)}</span>
          </div>
          <div className="price-display-block">
            <span className="product-label product-label--lben">Lben</span>
            <span className="price-figure lben-figure">{formatMoney(prices.lben)}</span>
          </div>
          <button className="secondary-btn btn-compact edit-icon-btn" onClick={handleEdit}>
            Modifier
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="form-group">
        <label className="product-label product-label--milk" htmlFor="milk-price">
          Prix du lait <span>DA / fond</span>
        </label>
        <input
          type="number"
          id="milk-price"
          placeholder="ex. 345"
          value={milkDraft}
          onChange={(e) => setMilkDraft(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="product-label product-label--lben" htmlFor="lben-price">
          Prix du Lben <span>DA / fond</span>
        </label>
        <input
          type="number"
          id="lben-price"
          placeholder="ex. 1200"
          value={lbenDraft}
          onChange={(e) => setLbenDraft(e.target.value)}
        />
      </div>
      <button className="primary-btn" onClick={handleSave}>
        Enregistrer les prix
      </button>
    </div>
  )
}

export default PricesCard
