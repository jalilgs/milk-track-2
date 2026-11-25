import { formatMoney, sumBy } from '../utils'

function ClientCard({ client, todaySales, onOpen, onQuickPay }) {
  const clientSales = todaySales.filter((s) => s.clientId === client.id)

  // No sale today yet
  if (clientSales.length === 0) {
    return (
      <div className="client-card" onClick={() => onOpen(client)}>
        <span className="client-name">{client.name}</span>
        <span className="tap-hint">Appuyer pour ajouter</span>
      </div>
    )
  }

  // At least one sale today
  const totalMilk = sumBy(clientSales, 'milkQty')
  const totalLben = sumBy(clientSales, 'lbenQty')
  const totalAmount = sumBy(clientSales, 'totalAmount')
  const totalPaid = sumBy(clientSales, 'paidAmount')

  const isOverpaid = totalPaid > totalAmount
  const isUnpaid = totalPaid < totalAmount
  const statusClass = isOverpaid ? 'overpaid' : isUnpaid ? 'unpaid' : 'paid'

  return (
    <div className={`client-card has-sale ${statusClass}`} onClick={() => onOpen(client)}>
      <div className="client-card-info">
        <span className="client-name">{client.name}</span>
        <span className="client-sale-summary">
          Lait : <strong>{totalMilk}</strong> | Lben : <strong>{totalLben}</strong>
        </span>
      </div>

      <div className="client-right-block">
        <div className="client-amount-block">
          <span className={`client-amount client-amount--${statusClass}`}>
            {formatMoney(totalAmount)}
          </span>
          <div className={`client-status-line client-status-line--${statusClass}`}>
            {isOverpaid
              ? `Surplus +${formatMoney(totalPaid - totalAmount)}`
              : isUnpaid
                ? `Doit ${formatMoney(totalAmount - totalPaid)}`
                : 'Payé intégralement'}
          </div>
        </div>

        {isUnpaid && (
          <button
            type="button"
            className="quick-pay-btn"
            onClick={(e) => {
              e.stopPropagation()
              onQuickPay(client.id)
            }}
          >
            ✔
          </button>
        )}
      </div>
    </div>
  )
}

export default ClientCard
