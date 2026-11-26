import { useState } from 'react'
import { clampNonNegative, isToday, sumBy } from '../utils'
import { getTodayStock, saveTodayStock } from '../stock'

function DailyStockCard({ dailyStock, setDailyStock, sales }) {
  const stock = getTodayStock(dailyStock, sales)

  const [milkDraft, setMilkDraft] = useState(stock.milkOwned || '')
  const [lbenDraft, setLbenDraft] = useState(stock.lbenOwned || '')

  const todaySales = sales.filter((s) => isToday(s.date))
  const milkSold = sumBy(todaySales, 'milkQty')
  const lbenSold = sumBy(todaySales, 'lbenQty')
  const milkRemaining = (parseFloat(stock.milkOwned) || 0) - milkSold
  const lbenRemaining = (parseFloat(stock.lbenOwned) || 0) - lbenSold

  function handleSave() {
    const milk = clampNonNegative(milkDraft)
    const lben = clampNonNegative(lbenDraft)
    setMilkDraft(milk || '')
    setLbenDraft(lben || '')
    setDailyStock(saveTodayStock(dailyStock, milk, lben, true))
  }

  function handleEdit() {
    setDailyStock(
      saveTodayStock(dailyStock, stock.milkOwned, stock.lbenOwned, false)
    )
  }

  return (
    <div className="card" id="daily-stock-card">
      <div className="stock-header">
        <h2>Stock du jour</h2>
        <div className="stock-inputs">
          <label className="product-label product-label--milk" htmlFor="stock-milk-owned">
            Lait
          </label>
<input
            type="number"
            inputMode="numeric"
            id="stock-milk-owned"
            className="stock-input"
            placeholder="0"
            min="0"
            value={milkDraft}
            style={{ '--chars': Math.max(3, String(milkDraft || '').length) }}
            onChange={(e) => setMilkDraft(e.target.value)}
            disabled={stock.isLocked}
          />

          <label className="product-label product-label--lben" htmlFor="stock-lben-owned">
            Lben
          </label>
          <input
            type="number"
            inputMode="numeric"
            id="stock-lben-owned"
            className="stock-input"
            placeholder="0"
            min="0"
            value={lbenDraft}
            style={{ '--chars': Math.max(3, String(lbenDraft || '').length) }}
            onChange={(e) => setLbenDraft(e.target.value)}
            disabled={stock.isLocked}
          />

          {stock.isLocked ? (
            <button className="secondary-btn btn-compact" onClick={handleEdit}>
              Modifier
            </button>
          ) : (
            <button className="primary-btn btn-compact" onClick={handleSave}>
              Valider
            </button>
          )}
        </div>
      </div>

<div className="stat-strip">
        <div className="stat-block stat-block--milk">
          <span className="stat-label">Lait vendu</span>
          <span className="stat-figure">{milkSold}</span>
          <span className="stat-sub">
            Restant{' '}
            <strong className={milkRemaining < 0 ? 'negative-num' : ''}>
              {milkRemaining}
            </strong>
          </span>
        </div>
        <div className="stat-block stat-block--lben">
          <span className="stat-label">Lben vendu</span>
          <span className="stat-figure">{lbenSold}</span>
          <span className="stat-sub">
            Restant{' '}
            <strong className={lbenRemaining < 0 ? 'negative-num' : ''}>
              {lbenRemaining}
            </strong>
          </span>
        </div>
      </div>
    </div>
  )
}

export default DailyStockCard
