import { useState, useEffect } from 'react'
import { clampNonNegative, formatMoney, isToday } from '../utils'
import { getTodayStock, saveTodayStock } from '../stock'

const PIECES_PER_FOND = 15

function splitPieces(pieces) {
  const p = Math.max(0, Math.floor(parseFloat(pieces) || 0))
  return {
    fonds: Math.floor(p / PIECES_PER_FOND),
    extra: p % PIECES_PER_FOND,
  }
}

function PurchaseModal({
  mode = 'pickup',
  entryToEdit = null,
  purchases,
  setPurchases,
  buyPrices,
  dailyStock,
  setDailyStock,
  currentBalance = 0,
  onClose,
}) {
  const activeMode = entryToEdit ? entryToEdit.type : mode

  const [milkPieces, setMilkPieces] = useState(
    entryToEdit ? entryToEdit.milkPieces || '' : ''
  )
  const [lbenPieces, setLbenPieces] = useState(
    entryToEdit ? entryToEdit.lbenPieces || '' : ''
  )
  const [paidAmount, setPaidAmount] = useState(
    entryToEdit ? entryToEdit.paidAmount || '' : ''
  )
  const [cratesReturned, setCratesReturned] = useState(
    entryToEdit ? entryToEdit.cratesReturned || '' : ''
  )
  const [extraForHome, setExtraForHome] = useState(
    entryToEdit ? Boolean(entryToEdit.extraForHome) : false
  )
  const [syncToTodayStock, setSyncToTodayStock] = useState(!entryToEdit)
  const [note, setNote] = useState(entryToEdit ? entryToEdit.note || '' : '')

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const milkSplit = splitPieces(milkPieces)
  const lbenSplit = splitPieces(lbenPieces)

  const totalCost =
    (parseFloat(milkPieces) || 0) * (parseFloat(buyPrices?.milkPiece) || 0) +
    (parseFloat(lbenPieces) || 0) * (parseFloat(buyPrices?.lbenPiece) || 0)

  const hasExtraPieces = milkSplit.extra > 0 || lbenSplit.extra > 0

  function handleSave(e) {
    e.preventDefault()

    if (activeMode === 'payment') {
      const paid = clampNonNegative(paidAmount)
      if (paid <= 0 && !entryToEdit) return

      if (entryToEdit) {
        setPurchases(
          purchases.map((p) =>
            p.id === entryToEdit.id
              ? { ...p, paidAmount: paid, note: note.trim() }
              : p
          )
        )
      } else {
        setPurchases([
          {
            id: Date.now(),
            date: new Date().toISOString(),
            type: 'payment',
            milkPieces: 0,
            lbenPieces: 0,
            totalCost: 0,
            paidAmount: paid,
            cratesReturned: 0,
            note: note.trim(),
          },
          ...purchases,
        ])
      }
      onClose()
      return
    }

    const mPcs = Math.floor(clampNonNegative(milkPieces))
    const lPcs = Math.floor(clampNonNegative(lbenPieces))
    const paid = clampNonNegative(paidAmount)
    const crates = Math.floor(clampNonNegative(cratesReturned))

    if (mPcs === 0 && lPcs === 0 && crates === 0 && !entryToEdit) return

    const cost =
      mPcs * (parseFloat(buyPrices?.milkPiece) || 0) +
      lPcs * (parseFloat(buyPrices?.lbenPiece) || 0)

    if (entryToEdit) {
      setPurchases(
        purchases.map((p) =>
          p.id === entryToEdit.id
            ? {
                ...p,
                milkPieces: mPcs,
                lbenPieces: lPcs,
                totalCost: cost,
                paidAmount: paid,
                cratesReturned: crates,
                extraForHome,
                note: note.trim(),
              }
            : p
        )
      )
    } else {
      setPurchases([
        {
          id: Date.now(),
          date: new Date().toISOString(),
          type: 'pickup',
          milkPieces: mPcs,
          lbenPieces: lPcs,
          totalCost: cost,
          paidAmount: paid,
          cratesReturned: crates,
          extraForHome,
          note: note.trim(),
        },
        ...purchases,
      ])

      if (syncToTodayStock && (milkSplit.fonds > 0 || lbenSplit.fonds > 0)) {
        const currentStock = getTodayStock(dailyStock, [])
        const todayEntry = dailyStock.find((d) => isToday(d.date))
        const existingMilk = todayEntry ? parseFloat(todayEntry.milkOwned) || 0 : 0
        const existingLben = todayEntry ? parseFloat(todayEntry.lbenOwned) || 0 : 0

        setDailyStock(
          saveTodayStock(
            dailyStock,
            existingMilk + milkSplit.fonds,
            existingLben + lbenSplit.fonds,
            currentStock.isLocked
          )
        )
      }
    }

    onClose()
  }

  function handleDelete() {
    if (!entryToEdit) return
    if (!window.confirm('Supprimer cette opération ?')) return
    setPurchases(purchases.filter((p) => p.id !== entryToEdit.id))
    onClose()
  }

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <form className="modal-content card" onSubmit={handleSave}>
        <h2 style={{ marginTop: 0 }}>
          {activeMode === 'payment'
            ? entryToEdit
              ? 'Modifier le paiement'
              : 'Régler la société'
            : entryToEdit
            ? "Modifier l'achat"
            : 'Nouvel achat (Société)'}
        </h2>

        {activeMode === 'pickup' ? (
          <>
            <div className="form-group row-form">
              <label className="modal-product-label modal-product-label--milk">
                Lait <span>(pièces)</span>
              </label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="ex. 150"
                min="0"
                value={milkPieces}
                onChange={(e) => setMilkPieces(e.target.value)}
                style={{ maxWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}
              />
            </div>
            {(parseFloat(milkPieces) || 0) > 0 && (
              <p className="empty-hint" style={{ margin: '-6px 0 10px 0', textAlign: 'right' }}>
                = <strong>{milkSplit.fonds} fonds</strong>
                {milkSplit.extra > 0 && ` + ${milkSplit.extra} pièce(s)`}
              </p>
            )}

            <div className="form-group row-form">
              <label className="modal-product-label modal-product-label--lben">
                Lben <span>(pièces)</span>
              </label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="ex. 30"
                min="0"
                value={lbenPieces}
                onChange={(e) => setLbenPieces(e.target.value)}
                style={{ maxWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}
              />
            </div>
            {(parseFloat(lbenPieces) || 0) > 0 && (
              <p className="empty-hint" style={{ margin: '-6px 0 10px 0', textAlign: 'right' }}>
                = <strong>{lbenSplit.fonds} fonds</strong>
                {lbenSplit.extra > 0 && ` + ${lbenSplit.extra} pièce(s)`}
              </p>
            )}

            {hasExtraPieces && (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                  marginBottom: '12px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={extraForHome}
                  onChange={(e) => setExtraForHome(e.target.checked)}
                  style={{ width: '18px', height: '18px', minHeight: '18px' }}
                />
                <span>
                  Garder le reste ({milkSplit.extra > 0 ? `${milkSplit.extra} Lait ` : ''}
                  {lbenSplit.extra > 0 ? `${lbenSplit.extra} Lben` : ''}) pour la maison
                </span>
              </label>
            )}

            <div className="modal-totals">
              <span>Coût total : </span>
              <span className="total-price">{formatMoney(totalCost)}</span>
            </div>

            <div className="form-group row-form">
              <label>Payé sur place (optionnel) :</label>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                min="0"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                style={{ maxWidth: '130px', textAlign: 'right' }}
              />
            </div>

            <div className="form-group row-form">
              <label>Fonds vides rendus :</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="0"
                min="0"
                value={cratesReturned}
                onChange={(e) => setCratesReturned(e.target.value)}
                style={{ maxWidth: '110px', textAlign: 'center' }}
              />
            </div>

            {!entryToEdit && (milkSplit.fonds > 0 || lbenSplit.fonds > 0) && (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                  marginBottom: '12px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={syncToTodayStock}
                  onChange={(e) => setSyncToTodayStock(e.target.checked)}
                  style={{ width: '18px', height: '18px', minHeight: '18px' }}
                />
                <span>
                  Ajouter{' '}
                  <strong>
                    {milkSplit.fonds > 0 ? `${milkSplit.fonds} Lait ` : ''}
                    {lbenSplit.fonds > 0 ? `${lbenSplit.fonds} Lben` : ''}
                  </strong>{' '}
                  au Stock du jour
                </span>
              </label>
            )}
          </>
        ) : (
          <>
            {currentBalance > 0 && !entryToEdit && (
              <div className="reminder-cloud red-cloud" style={{ marginBottom: '12px' }}>
                Solde dû à la société : <strong>{formatMoney(currentBalance)}</strong>
              </div>
            )}

            <div className="form-group row-form">
              <label>Montant versé :</label>
              <div className="paid-row">
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  min="0"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                />
                {currentBalance > 0 && (
                  <button
                    type="button"
                    className="secondary-btn btn-compact"
                    onClick={() => setPaidAmount(currentBalance)}
                  >
                    Tout solder
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        <div className="form-group" style={{ marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Note (ex. Virement, 5 pcs maison...)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="primary-btn">
            Enregistrer
          </button>
        </div>

        {entryToEdit && (
          <button
            type="button"
            className="delete-btn"
            style={{ width: '100%', marginTop: '0.75rem' }}
            onClick={handleDelete}
          >
            Supprimer
          </button>
        )}
      </form>
    </div>
  )
}

export default PurchaseModal
