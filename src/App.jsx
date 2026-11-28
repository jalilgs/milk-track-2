import { useState, useEffect } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import TabBar from './components/TabBar'
import ClientsScreen from './screens/ClientsScreen'
import ManageScreen from './screens/ManageScreen'
import HistoryScreen from './screens/HistoryScreen'
import PurchasesScreen from './screens/PurchasesScreen'

const DEFAULT_PRICES = { milk: 345, lben: 1200, isLocked: false }
const DEFAULT_BUY_PRICES = { milkPiece: 0, lbenPiece: 0 }

function App() {
  const [activeTab, setActiveTab] = useState('clients')

  const [prices, setPrices] = useLocalStorage('milk_app_prices', DEFAULT_PRICES)
  const [clients, setClients] = useLocalStorage('milk_app_clients', [])
  const [sales, setSales] = useLocalStorage('milk_app_sales', [])
  const [buyPrices, setBuyPrices] = useLocalStorage('milk_app_buy_prices', DEFAULT_BUY_PRICES)
  const [purchases, setPurchases] = useLocalStorage('milk_app_purchases', [])
  const [dailyStock, setDailyStock] = useLocalStorage('milk_app_daily_stock', [])
  const [groups, setGroups] = useLocalStorage('groups', [])
  const [textSize, setTextSize] = useLocalStorage('milk_app_text_size', 'normal')
  const [lastBackup, setLastBackup] = useLocalStorage('milk_app_last_backup', null)

  useEffect(() => {
    document.documentElement.setAttribute('data-text-size', textSize)
  }, [textSize])

  const backupData = { prices, buyPrices, clients, sales, purchases, dailyStock, groups }

  function restoreBackup(data) {
    if (data.prices) setPrices(data.prices)
    if (data.buyPrices) setBuyPrices(data.buyPrices)
    setClients(data.clients)
    setSales(data.sales)
    if (data.purchases) setPurchases(data.purchases)
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
            backupData={backupData}
            lastBackup={lastBackup}
            setLastBackup={setLastBackup}
          />
        )}
        
        {activeTab === 'manage' && (
          <ManageScreen
            prices={prices}
            setPrices={setPrices}
            buyPrices={buyPrices}
            setBuyPrices={setBuyPrices}
            clients={clients}
            setClients={setClients}
            groups={groups}
            setGroups={setGroups}
            textSize={textSize}
            setTextSize={setTextSize}
            backupData={backupData}
            onRestore={restoreBackup}
            onBackupExported={setLastBackup}
          />
        )}

        {activeTab === 'purchases' && (
          <PurchasesScreen
            purchases={purchases}
            setPurchases={setPurchases}
            buyPrices={buyPrices}
            dailyStock={dailyStock}
            setDailyStock={setDailyStock}
          />
        )}

        {activeTab === 'history' && (
          <HistoryScreen
            sales={sales}
            setSales={setSales}
            clients={clients}
            prices={prices}
          />
        )}
      </main>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  )
}

export default App
