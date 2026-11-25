import { buildSalesTree } from '../history'
import SaleHistoryCard from './SaleHistoryCard'

// One CSS class per level: year, month, week, day
const LEVEL_CLASSES = [
  'tree-details',
  'tree-details tree-details--nested',
  'tree-details tree-details--nested',
  'tree-details tree-details--nested tree-details--leaf',
]

// Draws one level, then calls itself for the next one.
function TreeLevel({ node, level, clients, firstPath }) {
  return (
    <>
      {[...node].map(([label, child], index) => {
        // Only the newest year > month > week > day starts open
        const isOpen = firstPath && index === 0

        return (
          <details key={label} className={LEVEL_CLASSES[level]} open={isOpen}>
            <summary className="tree-summary">{label}</summary>

            {Array.isArray(child) ? (
              <div className="sales-list">
                {child.map((sale) => (
                  <SaleHistoryCard key={sale.id} sale={sale} clients={clients} />
                ))}
              </div>
            ) : (
              <TreeLevel
                node={child}
                level={level + 1}
                clients={clients}
                firstPath={isOpen}
              />
            )}
          </details>
        )
      })}
    </>
  )
}

function SalesTree({ sales, clients }) {
  if (sales.length === 0) {
    return <p className="empty-hint">Aucun historique de ventes disponible.</p>
  }

  return (
    <TreeLevel node={buildSalesTree(sales)} level={0} clients={clients} firstPath={true} />
  )
}

export default SalesTree
