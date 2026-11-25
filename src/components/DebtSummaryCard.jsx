import { formatMoney } from '../utils'

function DebtSummaryCard({ sales, clients, onSettleDebt, onClearCrates }) {
  // 1. Total money owed per client
  const debtByClient = new Map()
  sales.forEach((s) => {
    const owed = (parseFloat(s.totalAmount) || 0) - (parseFloat(s.paidAmount) || 0)
    debtByClient.set(s.clientId, (debtByClient.get(s.clientId) || 0) + owed)
  })
  const debtors = [...debtByClient].filter(([, debt]) => debt > 0)
  const totalDebt = debtors.reduce((sum, [, debt]) => sum + debt, 0)

  // 2. Empty crates owed per client (taken from each client's most recent sale)
  const sortedSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date))
  const latestByClient = new Map()
  sortedSales.forEach((s) => {
    if (!latestByClient.has(s.clientId)) {
      latestByClient.set(s.clientId, s)
    }
  })

  const crateDebtors = [...latestByClient.values()]
    .filter((s) => (parseInt(s.remainingFunds, 10) || 0) > 0)
    .map((s) => ({
      saleId: s.id,
      clientId: s.clientId,
      crates: parseInt(s.remainingFunds, 10) || 0,
    }))
  const totalCrates = crateDebtors.reduce((sum, item) => sum + item.crates, 0)

  if (debtors.length === 0 && crateDebtors.length === 0) return null

  return (
    <div className="debt-overview-stack">
      {debtors.length > 0 && (
        <div className="card debt-summary-card">
          <h2 className="debt-summary-heading">
            <span>Dettes impayées</span>
            <span className="num">{formatMoney(totalDebt)}</span>
          </h2>
          <ul className="client-list client-list--flush">
            {debtors.map(([clientId, debt]) => {
              const client = clients.find((c) => c.id === clientId)
              const clientName = client ? client.name : 'Inconnu'
              return (
                <li key={clientId} className="debt-list-item">
                  <span className="client-name">{clientName}</span>
                  <div className="debt-item-actions">
                    <span className="debt-amount num">{formatMoney(debt)}</span>
                    {onSettleDebt && (
                      <button
                        type="button"
                        className="quick-pay-btn"
                        title="Solder la dette"
                        onClick={() => onSettleDebt(clientId, clientName, debt)}
                      >
                        ✔
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {crateDebtors.length > 0 && (
        <div className="card crates-summary-card">
          <h2 className="crates-summary-heading">
            <span>Fonds vides chez les clients</span>
            <span className="num">{totalCrates} casiers</span>
          </h2>
          <ul className="client-list client-list--flush">
            {crateDebtors.map(({ saleId, clientId, crates }) => {
              const client = clients.find((c) => c.id === clientId)
              const clientName = client ? client.name : 'Inconnu'
              return (
                <li key={clientId} className="debt-list-item">
                  <span className="client-name">{clientName}</span>
                  <div className="debt-item-actions">
                    <span className="crates-amount num">{crates} fonds</span>
                    {onClearCrates && (
                      <button
                        type="button"
                        className="check-funds-btn"
                        title="Fonds retournés"
                        onClick={() => onClearCrates(saleId, clientName, crates)}
                      >
                        ✔
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DebtSummaryCard
