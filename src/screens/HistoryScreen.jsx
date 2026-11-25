import { useState, useMemo } from 'react'
import DebtSummaryCard from '../components/DebtSummaryCard'
import WeekSelect from '../components/WeekSelect'
import DayStrip from '../components/DayStrip'
import HistorySummaryCard from '../components/HistorySummaryCard'
import SaleHistoryCard from '../components/SaleHistoryCard'
import SaleModal from '../components/SaleModal'
import { filterSales } from '../history'
import { formatMoney, sumBy, toDateKey } from '../utils'

function HistoryScreen({ sales, setSales, clients, prices }) {
  const [filter, setFilter] = useState({ type: 'all' })
  const [selectedClientId, setSelectedClientId] = useState('all')
  const [onlyUnpaid, setOnlyUnpaid] = useState(false)
  const [editingSale, setEditingSale] = useState(null)

  // Resolve the client object (even if the client was archived or deleted)
  const editingClient = editingSale
    ? clients.find((c) => c.id === editingSale.clientId) || {
        id: editingSale.clientId,
        name: 'Client inconnu',
      }
    : null

  // 1. Apply week/day filter, client filter, and unpaid filter
  const filteredSales = useMemo(() => {
    let list = filterSales(sales, filter)
    if (selectedClientId !== 'all') {
      list = list.filter((s) => String(s.clientId) === String(selectedClientId))
    }
    if (onlyUnpaid) {
      list = list.filter(
        (s) => (parseFloat(s.totalAmount) || 0) > (parseFloat(s.paidAmount) || 0)
      )
    }
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [sales, filter, selectedClientId, onlyUnpaid])

  // 2. Group filtered sales by day (flat, 1-level list instead of 4-level tree)
  const groupedByDay = useMemo(() => {
    const map = new Map()
    filteredSales.forEach((sale) => {
      const key = toDateKey(new Date(sale.date))
      if (!map.has(key)) {
        const label = new Date(sale.date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
        })
        map.set(key, { key, label, items: [] })
      }
      map.get(key).items.push(sale)
    })
    return [...map.values()]
  }, [filteredSales])

  // Settle all unpaid sales for a client from DebtSummaryCard
  function handleSettleClientDebt(clientId, clientName, debtAmount) {
    if (!window.confirm(`Marquer la dette de ${clientName} (${formatMoney(debtAmount)}) comme payée ?`)) {
      return
    }
    setSales(
      sales.map((s) => {
        if (s.clientId !== clientId) return s
        const total = parseFloat(s.totalAmount) || 0
        return total > (parseFloat(s.paidAmount) || 0) ? { ...s, paidAmount: total } : s
      })
    )
  }

  const hasActiveFilters =
    filter.type !== 'all' || selectedClientId !== 'all' || onlyUnpaid

  return (
    <section className="screen active">
      <h1>Historique</h1>

      <DebtSummaryCard
        sales={sales}
        clients={clients}
        onSettleDebt={setSales ? handleSettleClientDebt : null}
      />

      {/* Filter Card */}
      <div className="card history-filters">
        <div className="history-filter-row">
          <select
            className="custom-select"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            aria-label="Filtrer par client"
          >
            <option value="all">Tous les clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            className={`secondary-btn btn-compact ${onlyUnpaid ? 'active-unpaid-filter' : ''}`}
            onClick={() => setOnlyUnpaid((v) => !v)}
          >
            Impayés
          </button>
        </div>

        <WeekSelect sales={sales} filter={filter} setFilter={setFilter} />
        <DayStrip filter={filter} setFilter={setFilter} />

        {hasActiveFilters && (
          <button
            type="button"
            className="secondary-btn reset-filter-btn"
            onClick={() => {
              setFilter({ type: 'all' })
              setSelectedClientId('all')
              setOnlyUnpaid(false)
            }}
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      <HistorySummaryCard sales={filteredSales} />

      {/* Clean Daily Sections */}
      {groupedByDay.length === 0 ? (
        <p className="empty-hint">Aucune vente ne correspond à ces filtres.</p>
      ) : (
        groupedByDay.map((day, index) => {
          const dayTotal = sumBy(day.items, 'totalAmount')
          const dayPaid = sumBy(day.items, 'paidAmount')
          const dayLeft = Math.max(0, dayTotal - dayPaid)

          return (
            <details key={day.key} className="history-day-group" open={index < 2}>
              <summary className="history-day-summary">
                <span className="history-day-title">{day.label}</span>
                <div className="history-day-badges">
                  <span className="num">{formatMoney(dayTotal)}</span>
                  {dayLeft > 0 && (
                    <span className="day-debt-pill num">-{formatMoney(dayLeft)}</span>
                  )}
                </div>
              </summary>

              <div className="sales-list">
                {day.items.map((sale) => (
                  <SaleHistoryCard
                    key={sale.id}
                    sale={sale}
                    clients={clients}
                    onEdit={setEditingSale}
                  />
                ))}
              </div>
            </details>
          )
        })
      )}

      {editingSale && editingClient && (
        <SaleModal
          key={editingSale.id}
          client={editingClient}
          saleToEdit={editingSale}
          sales={sales}
          setSales={setSales}
          prices={prices}
          onClose={() => setEditingSale(null)}
        />
      )}
    </section>
  )
}

export default HistoryScreen
