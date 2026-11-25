import { formatMoney } from '../utils'

function DebtSummaryCard({ sales, clients }) {
  // Total owed per client: sum of (total - paid) over all their sales
  const debtByClient = new Map()
  sales.forEach((s) => {
    const owed = (parseFloat(s.totalAmount) || 0) - (parseFloat(s.paidAmount) || 0)
    debtByClient.set(s.clientId, (debtByClient.get(s.clientId) || 0) + owed)
  })

  const debtors = [...debtByClient].filter(([, debt]) => debt > 0)
  if (debtors.length === 0) return null

  const totalDebt = debtors.reduce((sum, [, debt]) => sum + debt, 0)

  return (
    <div className="card debt-summary-card">
      <h2 className="debt-summary-heading">
        <span>Total des dettes impayées</span>
        <span>{formatMoney(totalDebt)}</span>
      </h2>
      <ul className="client-list client-list--flush">
        {debtors.map(([clientId, debt]) => {
          const client = clients.find((c) => c.id === clientId)
          return (
            <li key={clientId} className="debt-list-item">
              <span className="client-name">{client ? client.name : 'Inconnu'}</span>
              <span className="debt-amount">{formatMoney(debt)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default DebtSummaryCard
