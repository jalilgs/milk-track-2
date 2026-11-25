import { useState } from 'react'
import QtyControl from './QtyControl'
import {
  formatMoney,
  clampNonNegative,
  isToday,
  isYesterday,
  getRecentQuantities,
} from '../utils'

function SaleModal({ client, sales, setSales, prices, onClose, saleToEdit = null }) {
  // If opened from History, edit saleToEdit; otherwise look for today's sale
  const targetSale =
    saleToEdit || sales.find((s) => s.clientId === client.id && isToday(s.date))

  const pastSales = sales
    .filter((s) => s.clientId === client.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
  const lastSale = pastSales[0] || null

  const [milkQty, setMilkQty] = useState(targetSale ? targetSale.milkQty : '')
  const [lbenQty, setLbenQty] = useState(targetSale ? targetSale.lbenQty : '')
  const [paidAmount, setPaidAmount] = useState(targetSale ? targetSale.paidAmount : '')
  const [remainingFunds, setRemainingFunds] = useState(
    targetSale ? targetSale.remainingFunds || '' : ''
  )
  const [tomorrowMilk, setTomorrowMilk] = useState(
    targetSale ? targetSale.tomorrowMilk || '' : ''
  )
  const [tomorrowLben, setTomorrowLben] = useState(
    targetSale ? targetSale.tomorrowLben || '' : ''
  )

  const [clearCrates, setClearCrates] = useState(false)
  const [clearDebt, setClearDebt] = useState(false)

  const total =
    (parseFloat(milkQty) || 0) * prices.milk +
    (parseFloat(lbenQty) || 0) * prices.lben

  const remaining = Math.max(0, total - (parseFloat(paidAmount) || 0))

  // Only show yesterday/debt reminders when logging a new sale on ClientsScreen
  const orderFromYesterday = !targetSale && lastSale && isYesterday(lastSale.date)
  const plannedMilk = orderFromYesterday ? lastSale.tomorrowMilk || 0 : 0
  const plannedLben = orderFromYesterday ? lastSale.tomorrowLben || 0 : 0
  const cratesOwed = !targetSale && lastSale ? lastSale.remainingFunds || 0 : 0
  const totalDebt = !saleToEdit
    ? pastSales.reduce(
        (sum, s) =>
          sum +
          Math.max(0, (parseFloat(s.totalAmount) || 0) - (parseFloat(s.paidAmount) || 0)),
        0
      )
    : 0

  const milkSuggestions = getRecentQuantities(pastSales, 'milkQty')

  function handleFullPay() {
    setPaidAmount(total)
  }

  function handleDelete() {
    if (!targetSale) return
    if (!window.confirm(`Supprimer cette vente de ${client.name} ?`)) return
    setSales(sales.filter((s) => s.id !== targetSale.id))
    onClose()
  }

  function handleSave() {
    const milk = clampNonNegative(milkQty)
    const lben = clampNonNegative(lbenQty)
    const paid = clampNonNegative(paidAmount)
    const funds = clampNonNegative(remainingFunds)
    const tMilk = clampNonNegative(tomorrowMilk)
    const tLben = clampNonNegative(tomorrowLben)
    const totalAmount = milk * prices.milk + lben * prices.lben

    let updated = sales

    if (targetSale) {
      updated = updated.map((s) =>
        s.id === targetSale.id
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

    if (clearCrates && lastSale) {
      updated = updated.map((s) =>
        s.id === lastSale.id ? { ...s, remainingFunds: 0 } : s
      )
    }

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

  // Format date badge when editing a historical sale
  const editDateLabel = saleToEdit
    ? new Date(saleToEdit.date).toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    : null

  return (
    <div className="modal-overlay active">
      <div className={`modal-content card ${saleToEdit ? 'modal-content--history' : ''}`}>
        {saleToEdit && (
          <div className="history-edit-banner">
            Modification d'une vente passée
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h2 style={{ margin: 0 }}>{client.name}</h2>
          {editDateLabel && <span className="today-date">{editDateLabel}</span>}
        </div>
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
          <button type="button" className="secondary-btn" onClick={onClose}>
            Annuler
          </button>
          <button type="button" className="primary-btn" onClick={handleSave}>
            Enregistrer
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
          <button type="button" className="secondary-btn" onClick={onClose}>
            Annuler
          </button>
          <button type="button" className="primary-btn" onClick={handleSave}>
            Enregistrer
          </button>
        </div>

        {targetSale && (
          <button
            type="button"
            className="delete-btn"
            style={{ width: '100%', marginTop: '0.75rem' }}
            onClick={handleDelete}
          >
            Supprimer cette vente
          </button>
        )}
      </div>
    </div>
  )
}

export default SaleModal
