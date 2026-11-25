import { useState } from 'react'
import QtyControl from './QtyControl'
import {
  formatMoney,
  clampNonNegative,
  isToday,
  isYesterday,
  getRecentQuantities,
} from '../utils'

function SaleModal({ client, sales, setSales, prices, onClose }) {
  // Does this client already have a sale today? Then we edit it.
  const todaySale = sales.find(
    (s) => s.clientId === client.id && isToday(s.date)
  )

  // NEW: all sales of this client, newest first
  const pastSales = sales
    .filter((s) => s.clientId === client.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
  const lastSale = pastSales[0] || null

  const [milkQty, setMilkQty] = useState(todaySale ? todaySale.milkQty : '')
  const [lbenQty, setLbenQty] = useState(todaySale ? todaySale.lbenQty : '')
  const [paidAmount, setPaidAmount] = useState(todaySale ? todaySale.paidAmount : '')
  const [remainingFunds, setRemainingFunds] = useState(
    todaySale ? todaySale.remainingFunds || '' : ''
  )
  const [tomorrowMilk, setTomorrowMilk] = useState(
    todaySale ? todaySale.tomorrowMilk || '' : ''
  )
  const [tomorrowLben, setTomorrowLben] = useState(
    todaySale ? todaySale.tomorrowLben || '' : ''
  )

  // NEW: "settle on save" switches (nothing is saved until Enregistrer)
  const [clearCrates, setClearCrates] = useState(false)
  const [clearDebt, setClearDebt] = useState(false)

  // Calculated, not stored
  const total =
    (parseFloat(milkQty) || 0) * prices.milk +
    (parseFloat(lbenQty) || 0) * prices.lben

  const remaining = Math.max(0, total - (parseFloat(paidAmount) || 0))

  // NEW: reminders, calculated from past sales
  const orderFromYesterday = !todaySale && lastSale && isYesterday(lastSale.date)
  const plannedMilk = orderFromYesterday ? lastSale.tomorrowMilk || 0 : 0
  const plannedLben = orderFromYesterday ? lastSale.tomorrowLben || 0 : 0
  const cratesOwed = !todaySale && lastSale ? lastSale.remainingFunds || 0 : 0
  const totalDebt = pastSales.reduce(
    (sum, s) =>
      sum +
      Math.max(0, (parseFloat(s.totalAmount) || 0) - (parseFloat(s.paidAmount) || 0)),
    0
  )

  // NEW: last 2 different milk quantities for this client
  const milkSuggestions = getRecentQuantities(pastSales, 'milkQty')

  function handleFullPay() {
    setPaidAmount(total)
  }

  function handleSave() {
    const milk = clampNonNegative(milkQty)
    const lben = clampNonNegative(lbenQty)
    const paid = clampNonNegative(paidAmount)
    const funds = clampNonNegative(remainingFunds)
    const tMilk = clampNonNegative(tomorrowMilk)
    const tLben = clampNonNegative(tomorrowLben)
    const totalAmount = milk * prices.milk + lben * prices.lben

    // CHANGED: we build the new list step by step, then save it once
    let updated = sales

    if (todaySale) {
      updated = updated.map((s) =>
        s.id === todaySale.id
          ? {
              ...s,
              milkQty: milk,
              lbenQty: lben,
              totalAmount,
              paidAmount: paid,
              remainingFunds: funds,
              tomorrowMilk: tMilk,
              tomorrowLben: tLben,
            }
          : s
      )
    } else if (milk > 0 || lben > 0) {
      updated = [
        ...updated,
        {
          id: Date.now(),
          clientId: client.id,
          date: new Date().toISOString(),
          milkQty: milk,
          lbenQty: lben,
          totalAmount,
          paidAmount: paid,
          tomorrowMilk: tMilk,
          tomorrowLben: tLben,
          remainingFunds: funds,
        },
      ]
    }

    // NEW: empty crates returned -> the last sale no longer owes crates
    if (clearCrates && lastSale) {
      updated = updated.map((s) =>
        s.id === lastSale.id ? { ...s, remainingFunds: 0 } : s
      )
    }

    // NEW: debt settled -> every unpaid sale of this client becomes paid
    if (clearDebt) {
      updated = updated.map((s) => {
        if (s.clientId !== client.id) return s
        const sTotal = parseFloat(s.totalAmount) || 0
        return sTotal > (parseFloat(s.paidAmount) || 0)
          ? { ...s, paidAmount: sTotal }
          : s
      })
    }

    setSales(updated)
    onClose()
  }

  return (
    <div className="modal-overlay active">
      <div className="modal-content card">
        <h2>{client.name}</h2>

        {/* NEW: reminders */}
        <div className="modal-reminders">
          {orderFromYesterday && (plannedMilk > 0 || plannedLben > 0) && (
            <div className="reminder-cloud blue-cloud">
              🛒 Prévu : <strong>{plannedMilk} Lait</strong> |{' '}
              <strong>{plannedLben} Lben</strong>
            </div>
          )}

          {cratesOwed > 0 &&
            (clearCrates ? (
              <div className="reminder-cloud reminder-cloud--done">
                ✅ Fonds retournés (cliquez sur Enregistrer)
              </div>
            ) : (
              <div className="reminder-cloud orange-cloud">
                📦 Doit : <strong>{cratesOwed} fonds vides</strong>
                <button
                  type="button"
                  className="check-funds-btn"
                  onClick={() => setClearCrates(true)}
                >
                  ✔
                </button>
              </div>
            ))}

          {totalDebt > 0 &&
            (clearDebt ? (
              <div className="reminder-cloud reminder-cloud--done">
                ✅ Dette réglée (cliquez sur Enregistrer)
              </div>
            ) : (
              <div className="reminder-cloud red-cloud">
                <span className="debt-label">💰 Dette :</span>{' '}
                <strong>{formatMoney(totalDebt)}</strong>
                <button
                  type="button"
                  className="check-funds-btn"
                  onClick={() => setClearDebt(true)}
                >
                  ✔
                </button>
              </div>
            ))}
        </div>

        <div className="form-group row-form">
          <label className="modal-product-label modal-product-label--milk">
            Lait <span>Fonds</span>
          </label>
          <QtyControl
            value={milkQty}
            onChange={setMilkQty}
            suggestions={milkSuggestions}
          />
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

        <div className="modal-actions modal-actions--top">
          <button className="secondary-btn" onClick={onClose}>
            Annuler
          </button>
          <button className="primary-btn" onClick={handleSave}>
            Enregistrer la vente
          </button>
        </div>

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

        <div className="modal-totals modal-totals--remaining">
          <span className="remaining-money-label">Reste à payer : </span>
          <span className="remaining-money-figure">{formatMoney(remaining)}</span>
        </div>

        <div className="form-group row-form">
          <label>Fonds vides (casiers) :</label>
          <QtyControl value={remainingFunds} onChange={setRemainingFunds} />
        </div>

        <div className="form-group row-form">
          <label className="modal-product-label modal-product-label--milk">
            Lait demain
          </label>
          <QtyControl value={tomorrowMilk} onChange={setTomorrowMilk} />
        </div>

        <div className="form-group row-form">
          <label className="modal-product-label modal-product-label--lben">
            Lben demain
          </label>
          <QtyControl value={tomorrowLben} onChange={setTomorrowLben} />
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
