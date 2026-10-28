import { useState } from 'react'
import QtyControl from './QtyControl'
import { formatMoney, clampNonNegative, isToday } from '../utils'

function SaleModal({ client, sales, setSales, prices, onClose }) {
  // Does this client already have a sale today? Then we edit it.
  const todaySale = sales.find(
    (s) => s.clientId === client.id && isToday(s.date)
  )

  const [milkQty, setMilkQty] = useState(todaySale ? todaySale.milkQty : '')
  const [lbenQty, setLbenQty] = useState(todaySale ? todaySale.lbenQty : '')
  const [paidAmount, setPaidAmount] = useState(todaySale ? todaySale.paidAmount : '') // NEW

  // Calculated, not stored
  const total =
    (parseFloat(milkQty) || 0) * prices.milk +
    (parseFloat(lbenQty) || 0) * prices.lben

  const remaining = Math.max(0, total - (parseFloat(paidAmount) || 0)) // NEW

  function handleFullPay() { // NEW
    setPaidAmount(total)
  }

  function handleSave() {
    const milk = clampNonNegative(milkQty)
    const lben = clampNonNegative(lbenQty)
    const paid = clampNonNegative(paidAmount) // NEW
    const totalAmount = milk * prices.milk + lben * prices.lben

    if (todaySale) {
      // Edit: change only these fields, keep everything else
      setSales(
        sales.map((s) =>
          s.id === todaySale.id
            ? { ...s, milkQty: milk, lbenQty: lben, totalAmount, paidAmount: paid } // CHANGED
            : s
        )
      )
    } else if (milk > 0 || lben > 0) {
      // New sale (nothing is saved if both quantities are empty)
      setSales([
        ...sales,
        {
          id: Date.now(),
          clientId: client.id,
          date: new Date().toISOString(),
          milkQty: milk,
          lbenQty: lben,
          totalAmount,
          paidAmount: paid, // CHANGED
          tomorrowMilk: 0,
          tomorrowLben: 0,
          remainingFunds: 0,
        },
      ])
    }

    onClose()
  }

  return (
    <div className="modal-overlay active">
      <div className="modal-content card">
        <h2>{client.name}</h2>

        <div className="form-group row-form">
          <label className="modal-product-label modal-product-label--milk">
            Lait <span>Fonds</span>
          </label>
          <QtyControl value={milkQty} onChange={setMilkQty} />
        </div>

        <div className="form-group row-form">
          <label className="modal-product-label modal-product-label--lben">
            Lben <span>Fonds</span>
          </label>
          <QtyControl value={lbenQty} onChange={setLbenQty} />
        </div>

        <div className="modal-totals">
          <span>Total : </span>
          <span className="total-price">{formatMoney(total)}</span>
        </div>

        {/* NEW: buttons at the top */}
        <div className="modal-actions modal-actions--top">
          <button className="secondary-btn" onClick={onClose}>
            Annuler
          </button>
          <button className="primary-btn" onClick={handleSave}>
            Enregistrer la vente
          </button>
        </div>

        {/* NEW: payment */}
        <div className="form-group row-form">
          <label>Montant payé :</label>
          <div className="paid-row">
            <input
              type="number"
              placeholder="0"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
            />
            <button
              type="button"
              className="secondary-btn btn-compact"
              onClick={handleFullPay}
            >
              Tout payer
            </button>
          </div>
        </div>

        {/* NEW: remaining */}
        <div className="modal-totals modal-totals--remaining">
          <span className="remaining-money-label">Reste à payer : </span>
          <span className="remaining-money-figure">{formatMoney(remaining)}</span>
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>
            Annuler
          </button>
          <button className="primary-btn" onClick={handleSave}>
            Enregistrer la vente
          </button>
        </div>
      </div>
    </div>
  )
}

export default SaleModal
