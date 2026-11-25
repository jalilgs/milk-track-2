import { useState } from 'react'
import DebtSummaryCard from '../components/DebtSummaryCard'
import WeekSelect from '../components/WeekSelect'
import DayStrip from '../components/DayStrip'
import HistorySummaryCard from '../components/HistorySummaryCard'
import SalesTree from '../components/SalesTree'
import { filterSales } from '../history'

function HistoryScreen({ sales, clients }) {
  const [filter, setFilter] = useState({ type: 'all' })
  const filteredSales = filterSales(sales, filter)

  return (
    <section className="screen active">
      <h1>Historique</h1>

      <DebtSummaryCard sales={sales} clients={clients} />

      <WeekSelect sales={sales} filter={filter} setFilter={setFilter} />
      <DayStrip filter={filter} setFilter={setFilter} />

      <HistorySummaryCard sales={filteredSales} />

      <SalesTree sales={sales} clients={clients} />
    </section>
  )
}

export default HistoryScreen
