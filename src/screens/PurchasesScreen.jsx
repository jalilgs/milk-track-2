import { useState } from 'react'
import Header from '../components/Header'
import PurchaseModal from '../components/PurchaseModal'
import { formatMoney } from '../utils'

const PIECES_PER_FOND = 15

function formatPiecesSummary(pieces) {
  const p = Math.floor(parseFloat(pieces) || 0)
  if (p <= 0) return null
  const fonds = Math.floor(p / PIECES_PER_FOND)
  const extra = p % PIECES_PER_FOND
  if (fonds === 0) return `${extra} pcs`
  if (extra === 0) return `${p} pcs (${fonds} fonds)`
  return `${p} pcs (${fonds} fonds + ${extra})`
}

function PurchasesScreen({
  purchases,
  setPurchases,
  buyPrices,
  dailyStock,
  setDailyStock,
}) {
  const [modalMode, setModalMode] = useState(null)
  const [editingEntry, setEditingEntry] = useState(null)

  const sorted = [...purchases].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  const totalBought = sorted.reduce(
    (sum, p) => sum + (parseFloat(p.totalCost) || 0),
    0
  )
  const totalPaid = sorted.reduce(
    (sum, p) => sum + (parseFloat(p.paidAmount) || 0),
    0
  )
  const balance = totalBought - totalPaid

  const lastPaymentIdx = sorted.findIndex((p) => p.type === 'payment')
  const recentPickups = (
    lastPaymentIdx === -1 ? sorted : sorted.slice(0, lastPaymentIdx)
  ).filter((p) => p.type === 'pickup')

  const recentMilkPcs = recentPickups.reduce(
    (sum, p) => sum + (parseFloat(p.milkPieces) || 0),
    0
  )
  const recentLbenPcs = recentPickups.reduce(
    (sum, p) => sum + (parseFloat(p.lbenPieces) || 0),
    0
  )
  const recentCost = recentPickups.reduce(
    (sum, p) => sum + (parseFloat(p.totalCost) || 0),
    0
  )

  return (
    <section className="screen active">
      <Header title="Achats Société" />

      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <span style={{ fontWeight: 600 }}>
            {balance > 0
              ? 'Reste à payer (Société)'
              : balance < 0
              ? 'Avance chez la société'
              : 'Compte à jour'}
          </span>
          <span
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color:
                balance > 0
                  ? 'var(--unpaid-main)'
                  : balance < 0
                  ? 'var(--paid-main)'
                  : 'inherit',
            }}
          >
            {formatMoney(Math.abs(balance))}
          </span>
        </div>

        {recentPickups.length > 0 && (
          <div
            style={{
              backgroundColor: 'var(--color-page)',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '2px' }}>
              Depuis le dernier règlement ({recentPickups.length} achat
              {recentPickups.length > 1 ? 's' : ''}) :
            </div>
            <div>
              {recentMilkPcs > 0 && (
                <span>
                  Lait : <strong>{formatPiecesSummary(recentMilkPcs)}</strong>
                  {recentLbenPcs > 0 ? ' • ' : ''}
                </span>
              )}
              {recentLbenPcs > 0 && (
                <span>
                  Lben : <strong>{formatPiecesSummary(recentLbenPcs)}</strong>
                </span>
              )}
              {' — '}
              <strong>{formatMoney(recentCost)}</strong>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="primary-btn"
            style={{ flex: 1 }}
            onClick={() => {
              setEditingEntry(null)
              setModalMode('pickup')
            }}
          >
            + Nouvel achat
          </button>
          <button
            type="button"
            className="secondary-btn"
            style={{ flex: 1 }}
            onClick={() => {
              setEditingEntry(null)
              setModalMode('payment')
            }}
          >
            Régler / Payer
          </button>
        </div>
      </div>

      <h2>Historique des opérations</h2>

      {sorted.length === 0 ? (
        <p className="empty-hint">
          Aucun achat enregistré. Appuyez sur <strong>+ Nouvel achat</strong> pour commencer.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sorted.map((entry) => {
            const dateLabel = new Date(entry.date).toLocaleDateString('fr-FR', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })
            const isPayment = entry.type === 'payment'

            return (
              <div
                key={entry.id}
                className="card"
                style={{
                  marginBottom: 0,
                  cursor: 'pointer',
                  borderLeft: `4px solid ${
                    isPayment ? 'var(--paid-main)' : 'var(--milk-main)'
                  }`,
                }}
                onClick={() => setEditingEntry(entry)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ fontWeight: 700 }}>
                    {isPayment ? '💵 Règlement société' : '🚚 Achat marchandise'}
                  </span>
                  <span className="today-date">{dateLabel}</span>
                </div>

                {!isPayment && (
                  <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                    {entry.milkPieces > 0 && (
                      <div>
                        Lait : <strong>{formatPiecesSummary(entry.milkPieces)}</strong>
                      </div>
                    )}
                    {entry.lbenPieces > 0 && (
                      <div>
                        Lben : <strong>{formatPiecesSummary(entry.lbenPieces)}</strong>
                      </div>
                    )}
                    {entry.cratesReturned > 0 && (
                      <div style={{ fontSize: '0.82rem', opacity: 0.8 }}>
                        📦 {entry.cratesReturned} fond(s) vide(s) rendu(s)
                      </div>
                    )}
                    {entry.extraForHome && (
                      <div style={{ fontSize: '0.82rem', opacity: 0.8 }}>
                        🏠 Reste gardé pour la maison
                      </div>
                    )}
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.92rem',
                  }}
                >
                  <span style={{ opacity: 0.75 }}>{entry.note || ''}</span>
                  <div style={{ textAlign: 'right' }}>
                    {!isPayment && (
                      <div>
                        Coût : <strong>{formatMoney(entry.totalCost)}</strong>
                      </div>
                    )}
                    {(parseFloat(entry.paidAmount) || 0) > 0 && (
                      <div style={{ color: 'var(--paid-main)', fontWeight: 700 }}>
                        Payé : {formatMoney(entry.paidAmount)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {(modalMode || editingEntry) && (
        <PurchaseModal
          mode={modalMode || 'pickup'}
          entryToEdit={editingEntry}
          purchases={purchases}
          setPurchases={setPurchases}
          buyPrices={buyPrices}
          dailyStock={dailyStock}
          setDailyStock={setDailyStock}
          currentBalance={balance}
          onClose={() => {
            setModalMode(null)
            setEditingEntry(null)
          }}
        />
      )}
    </section>
  )
}

export default PurchasesScreen
