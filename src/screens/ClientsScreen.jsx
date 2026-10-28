import { useState } from 'react'
import Header from '../components/Header'
import DailyStockCard from '../components/DailyStockCard'
import DailyMoneyCard from '../components/DailyMoneyCard'
import GroupAccordion from '../components/GroupAccordion'
import SaleModal from '../components/SaleModal'
import useLocalStorage from '../hooks/useLocalStorage'
import { isToday, sumBy } from '../utils'

function ClientsScreen({ sales, setSales, clients, groups, prices, dailyStock, setDailyStock }) {
  const [openGroups, setOpenGroups] = useLocalStorage('milk_app_open_groups', {})
  const [selectedClient, setSelectedClient] = useState(null)

  const todaySales = sales.filter((s) => isToday(s.date))
  const activeClients = clients.filter((c) => c.isActive !== false)

  // One section per group, plus one for clients without a group
  const sections = groups.map((g) => ({
    key: `group-${g.id}`,
    title: g.name,
    clients: activeClients.filter((c) => c.groupId === g.id),
  }))

  const unassigned = activeClients.filter(
    (c) => !groups.some((g) => g.id === c.groupId)
  )
  sections.push({
    key: 'group-unassigned',
    title: 'Clients non assignés',
    clients: unassigned,
    openByDefault: true,
  })

  const visibleSections = sections.filter((s) => s.clients.length > 0)

  // Marks the client's unpaid amount of today as paid
  function handleQuickPay(clientId) {
    const clientSales = todaySales.filter((s) => s.clientId === clientId)
    const lastSale = clientSales[clientSales.length - 1]
    if (!lastSale) return

    const outstanding =
      sumBy(clientSales, 'totalAmount') - sumBy(clientSales, 'paidAmount')

    setSales(
      sales.map((s) =>
        s.id === lastSale.id
          ? { ...s, paidAmount: (parseFloat(s.paidAmount) || 0) + outstanding }
          : s
      )
    )
  }

  return (
    <section className="screen active">
      <Header title="Livraisons du jour" />

      <DailyStockCard dailyStock={dailyStock} setDailyStock={setDailyStock} sales={sales} />
      <DailyMoneyCard sales={sales} />

      {visibleSections.length === 0 && (
        <p className="empty-hint">Aucun client. Ajoutez-en dans l'onglet Gérer.</p>
      )}

      {visibleSections.map((section) => (
        <GroupAccordion
          key={section.key}
          groupKey={section.key}
          title={section.title}
          clients={section.clients}
          todaySales={todaySales}
          openByDefault={section.openByDefault}
          openGroups={openGroups}
          setOpenGroups={setOpenGroups}
          onOpenClient={setSelectedClient}
          onQuickPay={handleQuickPay}
        />
      ))}

      {selectedClient && (
        <SaleModal
          key={selectedClient.id}
          client={selectedClient}
          sales={sales}
          setSales={setSales}
          prices={prices}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </section>
  )
}

export default ClientsScreen
