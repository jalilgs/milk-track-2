import { formatMoney } from '../utils'

function SaleHistoryCard({ sale, clients }) {
  const isFullyPaid = sale.paidAmount >= sale.totalAmount
  const clientName = clients.find((c) => c.id === sale.clientId)?.name || 'Inconnu'
  const statusClass = isFullyPaid ? 'is-paid' : 'is-unpaid'

  return (
    <div className={`card history-sale-card ${statusClass}`}>
      <div className="sale-card-row">
        <strong className="sale-card-name">{clientName}</strong>
        <span className="sale-card-total">{formatMoney(sale.totalAmount)}</span>
      </div>
      <div className="sale-card-meta">
        <span>
          Lait : <strong>{sale.milkQty}</strong> | Lben : <strong>{sale.lbenQty}</strong>
        </span>
        <span className={`sale-card-status ${statusClass}`}>
          {isFullyPaid ? 'Payé intégralement' : `Payé : ${formatMoney(sale.paidAmount)}`}
        </span>
      </div>
    </div>
  )
}

export default SaleHistoryCard
