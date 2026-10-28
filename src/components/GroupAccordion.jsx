import ClientCard from './ClientCard'
import { formatMoney, sumBy } from '../utils'

function GroupAccordion({
  groupKey,
  title,
  clients,
  todaySales,
  openByDefault,
  openGroups,
  setOpenGroups,
  onOpenClient,
  onQuickPay,
}) {
  // Money of this group today
  const clientIds = clients.map((c) => c.id)
  const groupSales = todaySales.filter((s) => clientIds.includes(s.clientId))
  const total = sumBy(groupSales, 'totalAmount')
  const paid = sumBy(groupSales, 'paidAmount')
  const left = Math.max(0, total - paid)

  // "Pending" = at least one client has no sale today
  const hasPending = clients.some(
    (c) => !todaySales.some((s) => s.clientId === c.id)
  )

  // Open or closed: the saved choice wins, otherwise the default
  const defaultOpen = openByDefault ?? hasPending
  const isOpen = groupKey in openGroups ? openGroups[groupKey] : defaultOpen

  function handleToggle(e) {
    const open = e.currentTarget.open
    setOpenGroups((prev) => (prev[groupKey] === open ? prev : { ...prev, [groupKey]: open }))
  }

  return (
    <details className="group-accordion" open={isOpen} onToggle={handleToggle}>
      <summary className="group-summary">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span className="group-title" style={{ fontSize: 15, fontWeight: 800 }}>
            {title} ({clients.length})
          </span>
          <span className={hasPending ? 'group-badge has-pending' : 'group-badge'}>
            {hasPending ? 'En attente' : 'Soldé'}
          </span>
        </div>

        {total > 0 && (
          <div className="group-money-row">
            <span className="money-chip">Total <strong>{formatMoney(total)}</strong></span>
            <span className="money-chip money-chip--paid">Payé <strong>{formatMoney(paid)}</strong></span>
            {left > 0 && (
              <span className="money-chip money-chip--left">Reste <strong>{formatMoney(left)}</strong></span>
            )}
          </div>
        )}
      </summary>

      <div className="client-grid" style={{ marginTop: 12 }}>
        {clients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            todaySales={todaySales}
            onOpen={onOpenClient}
            onQuickPay={onQuickPay}
          />
        ))}
      </div>
    </details>
  )
}

export default GroupAccordion
