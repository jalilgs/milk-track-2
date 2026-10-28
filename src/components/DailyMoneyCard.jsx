import { formatMoney, isToday, sumBy } from '../utils'

function DailyMoneyCard({ sales }) {
  const todaySales = sales.filter((s) => isToday(s.date))
  const total = sumBy(todaySales, 'totalAmount')
  const paid = sumBy(todaySales, 'paidAmount')
  const left = Math.max(0, total - paid)

  return (
    <div className="card" id="daily-money-card">
      <h2>Argent du jour</h2>
      <div className="money-strip">
        <div className="money-block">
          <span className="money-block__label">Total du jour</span>
          <span className="money-block__figure">{formatMoney(total)}</span>
        </div>
        <div className="money-block money-block--paid">
          <span className="money-block__label">Payé</span>
          <span className="money-block__figure">{formatMoney(paid)}</span>
        </div>
        <div className="money-block money-block--left">
          <span className="money-block__label">Reste</span>
          <span className="money-block__figure">{formatMoney(left)}</span>
        </div>
      </div>
    </div>
  )
}

export default DailyMoneyCard
