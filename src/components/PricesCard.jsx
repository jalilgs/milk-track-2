import { useState } from 'react'
import { formatMoney, clampNonNegative } from '../utils'

function PricesCard({ prices, setPrices, buyPrices, setBuyPrices }) {
  const [milkDraft, setMilkDraft] = useState(prices.milk)
  const [lbenDraft, setLbenDraft] = useState(prices.lben)
  const [buyMilkDraft, setBuyMilkDraft] = useState(buyPrices?.milkPiece ?? '')
  const [buyLbenDraft, setBuyLbenDraft] = useState(buyPrices?.lbenPiece ?? '')

  function handleSave() {
    const milk = clampNonNegative(milkDraft)
    const lben = clampNonNegative(lbenDraft)
    const buyMilk = clampNonNegative(buyMilkDraft)
    const buyLben = clampNonNegative(buyLbenDraft)

    setMilkDraft(milk)
    setLbenDraft(lben)
    setBuyMilkDraft(buyMilk)
    setBuyLbenDraft(buyLben)

    setPrices({ milk, lben, isLocked: true })
    if (setBuyPrices) {
      setBuyPrices({ milkPiece: buyMilk, lbenPiece: buyLben })
    }
  }

  function handleEdit() {
    setPrices({ ...prices, isLocked: false })
  }

if (prices.isLocked) {
    return (
      <div className="card">
        <div className="prices-display-row">
          <div className="price-display-block">
            <span className="product-label product-label--milk">Lait (vente)</span>
            <span className="price-figure milk-figure">{formatMoney(prices.milk)}</span>
          </div>
          <div className="price-display-block">
            <span className="product-label product-label--lben">Lben (vente)</span>
            <span className="price-figure lben-figure">{formatMoney(prices.lben)}</span>
          </div>
          <button className="secondary-btn btn-compact edit-icon-btn" onClick={handleEdit}>
            Modifier
          </button>
        </div>

        <hr className="divider" style={{ margin: '10px 0' }} />

        <div className="prices-display-row">
          <div className="price-display-block">
            <span className="product-label product-label--milk">Achat Lait / pc</span>
            <span className="price-figure milk-figure">
              {formatMoney(buyPrices?.milkPiece || 0)}
            </span>
          </div>
          <div className="price-display-block">
            <span className="product-label product-label--lben">Achat Lben / pc</span>
            <span className="price-figure lben-figure">
              {formatMoney(buyPrices?.lbenPiece || 0)}
            </span>
          </div>
          <button
            type="button"
            className="secondary-btn btn-compact edit-icon-btn"
            style={{ visibility: 'hidden' }}
            aria-hidden="true"
            tabIndex={-1}
          >
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
      <hr className="divider" style={{ margin: '12px 0' }} />

      <div className="form-group">
        <label className="product-label product-label--milk" htmlFor="buy-milk-price">
          Prix d&apos;achat lait <span>DA / pièce</span>
        </label>
        <input
          type="number"
          id="buy-milk-price"
          placeholder="ex. 22"
          value={buyMilkDraft}
          onChange={(e) => setBuyMilkDraft(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="product-label product-label--lben" htmlFor="buy-lben-price">
          Prix d&apos;achat Lben <span>DA / pièce</span>
        </label>
        <input
          type="number"
          id="buy-lben-price"
          placeholder="ex. 75"
          value={buyLbenDraft}
          onChange={(e) => setBuyLbenDraft(e.target.value)}
        />
      </div>
      <button className="primary-btn" onClick={handleSave}>
        Enregistrer les prix
      </button>
    </div>
  )
}

export default PricesCard
