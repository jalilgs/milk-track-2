import { useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import TabBar from './components/TabBar'
import ClientsScreen from './screens/ClientsScreen'
import ManageScreen from './screens/ManageScreen'
import HistoryScreen from './screens/HistoryScreen'

const DEFAULT_PRICES = { milk: 345, lben: 1200, isLocked: false }

function App() {
  const [activeTab, setActiveTab] = useState('clients')

  const [prices, setPrices] = useLocalStorage('milk_app_prices', DEFAULT_PRICES)
  const [clients, setClients] = useLocalStorage('milk_app_clients', [])
  const [sales, setSales] = useLocalStorage('milk_app_sales', [])
  const [dailyStock, setDailyStock] = useLocalStorage('milk_app_daily_stock', [])
  const [groups, setGroups] = useLocalStorage('groups', [])

  return (
    <>
      <main id="app">
{activeTab === 'clients' && (
  <ClientsScreen
    sales={sales}
    setSales={setSales}
    clients={clients}
    groups={groups}
    prices={prices}
    dailyStock={dailyStock}
    setDailyStock={setDailyStock}
  />
)}
{activeTab === 'manage' && (
  <ManageScreen
    prices={prices}
    setPrices={setPrices}
    clients={clients}
    setClients={setClients}
    groups={groups}
    setGroups={setGroups}
  />
)}
        {activeTab === 'history' && <HistoryScreen />}
      </main>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  )
}

export default App
