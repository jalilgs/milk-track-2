import { useState, useEffect } from 'react'
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
  const [textSize, setTextSize] = useLocalStorage('milk_app_text_size', 'normal')

  // Your CSS reads the size from the <html> tag, which is outside React
  useEffect(() => {
    document.documentElement.setAttribute('data-text-size', textSize)
  }, [textSize])

  // Everything that goes into a backup file
  const backupData = { prices, clients, sales, dailyStock, groups }

  // Puts a backup back (the hook saves each value by itself)
  function restoreBackup(data) {
    if (data.prices) setPrices(data.prices)
    setClients(data.clients)
    setSales(data.sales)
    if (data.dailyStock) setDailyStock(data.dailyStock)
    if (data.groups) setGroups(data.groups)
  }

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
            textSize={textSize}
            setTextSize={setTextSize}
            backupData={backupData}
            onRestore={restoreBackup}
          />
        )}
        {activeTab === 'history' && (
          <HistoryScreen sales={sales} clients={clients} />
        )}
      </main>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  )
}

export default App
