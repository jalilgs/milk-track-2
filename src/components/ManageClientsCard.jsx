import { useState } from 'react'

function ManageClientsCard({ clients, setClients, groups }) {
  const [name, setName] = useState('')
  const [groupId, setGroupId] = useState('')

  const activeClients = clients.filter((c) => c.isActive !== false)
  const archivedClients = clients.filter((c) => c.isActive === false)

  function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    setClients([
      ...clients,
      { id: Date.now(), name: trimmed, isActive: true, groupId },
    ])
    setName('')
    setGroupId('')
  }

  function setActive(id, isActive) {
    setClients(clients.map((c) => (c.id === id ? { ...c, isActive } : c)))
  }

  function handleArchive(client) {
    if (window.confirm(`Archiver ${client.name} ? L'historique reste conservé.`)) {
      setActive(client.id, false)
    }
  }

  return (
    <div className="card">
      <div className="form-group row-form add-client-row" style={{ gap: 8 }}>
        <input
          type="text"
          placeholder="Nom"
          style={{ flex: 2 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="custom-select"
          style={{ flex: 2 }}
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        >
          <option value="">Aucun</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <button className="primary-btn add-btn" style={{ flex: 1 }} onClick={handleAdd}>
          Ajouter
        </button>
      </div>

      {clients.length === 0 ? (
        <p className="empty-hint">Aucun client ajouté pour le moment.</p>
      ) : (
        <ul className="client-list">
          {activeClients.map((client) => (
            <li key={client.id}>
              <span className="client-name">{client.name}</span>
              <button className="delete-btn" onClick={() => handleArchive(client)}>
                Archiver
              </button>
            </li>
          ))}
        </ul>
      )}

      {archivedClients.length > 0 && (
        <details className="archived-details">
          <summary className="archived-summary">
            Clients archivés ({archivedClients.length})
          </summary>
          <ul className="client-list archived-ul">
            {archivedClients.map((client) => (
              <li key={client.id} className="archived-item">
                <span className="client-name">{client.name}</span>
                <button
                  className="secondary-btn restore-btn"
                  onClick={() => setActive(client.id, true)}
                >
                  Restaurer
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}

export default ManageClientsCard
