const TABS = [
  { id: 'clients', label: 'Clients' },
  { id: 'manage', label: 'Gérer' },
  { id: 'history', label: 'Historique' },
]

function TabBar({ activeTab, onTabChange }) {
  return (
    <nav id="tab-bar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export default TabBar
