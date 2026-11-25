import { formatMoney, sumBy } from '../utils'

function HistorySummaryCard({ sales }) {
  const totalMilk = sumBy(sales, 'milkQty')
  const totalLben = sumBy(sales, 'lbenQty')
  const totalMoney = sumBy(sales, 'totalAmount')
  const totalPaid = sumBy(sales, 'paidAmount')
  const totalLeft = Math.max(0, totalMoney - totalPaid)

  return (
    <div className="card">
      <h2>Résumé</h2>
      <div className="money-strip">
        <div className="money-block">
          <span className="money-block__label">Lait vendu</span>
          <span className="money-block__figure">{totalMilk}</span>
        </div>
        <div className="money-block">
          <span className="money-block__label">Lben vendu</span>
          <span className="money-block__figure">{totalLben}</span>
        </div>
      </div>
      <div className="money-strip" style={{ marginTop: 10 }}>
        <div className="money-block money-block--paid">
          <span className="money-block__label">Total payé</span>
          <span className="money-block__figure">{formatMoney(totalPaid)}</span>
        </div>
        <div className="money-block money-block--left">
          <span className="money-block__label">Reste à payer</span>
          <span className="money-block__figure">{formatMoney(totalLeft)}</span>
        </div>
      </div>
    </div>
  )
}

export default HistorySummaryCard
