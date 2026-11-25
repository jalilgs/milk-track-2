import { formatMoney } from '../utils'

function SaleHistoryCard({ sale, clients, onEdit }) {
  const isOverpaid = sale.paidAmount > sale.totalAmount
  const isUnpaid = sale.paidAmount < sale.totalAmount
  const clientName = clients.find((c) => c.id === sale.clientId)?.name || 'Inconnu'
  const statusClass = isOverpaid ? 'is-overpaid' : isUnpaid ? 'is-unpaid' : 'is-paid'

  return (
    <div
      className={`card history-sale-card ${statusClass}`}
      onClick={() => onEdit && onEdit(sale)}
      style={{ cursor: onEdit ? 'pointer' : 'default' }}
    >
      <div className="sale-card-row">
        <strong className="sale-card-name">{clientName}</strong>
        <span className={`sale-card-total ${statusClass}`}>
          {formatMoney(sale.totalAmount)}
        </span>
      </div>
      <div className="sale-card-meta">
        <span>
          Lait : <strong>{sale.milkQty}</strong> | Lben : <strong>{sale.lbenQty}</strong>
        </span>
        <span className={`sale-card-status ${statusClass}`}>
          {isOverpaid
            ? `Payé : ${formatMoney(sale.paidAmount)} (+${formatMoney(sale.paidAmount - sale.totalAmount)})`
            : isUnpaid
              ? `Payé : ${formatMoney(sale.paidAmount)}`
              : 'Payé intégralement'}
        </span>
      </div>
    </div>
  )
}

export default SaleHistoryCard
