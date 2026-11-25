import { useState } from 'react'

function ManageClientsCard({ clients, setClients, groups }) {
  const [name, setName] = useState('')
  const [groupId, setGroupId] = useState('')

  // Inline edit state
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editGroupId, setEditGroupId] = useState('')

  const activeClients = clients.filter((c) => c.isActive !== false)
  const archivedClients = clients.filter((c) => c.isActive === false)

  function handleAdd(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setClients([
      ...clients,
      { id: Date.now(), name: trimmed, isActive: true, groupId },
    ])
    setName('')
    setGroupId('')
  }

  function startEdit(client) {
    setEditingId(client.id)
    setEditName(client.name)
    setEditGroupId(client.groupId || '')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName('')
    setEditGroupId('')
  }

  function saveEdit(id) {
    const trimmed = editName.trim()
    if (!trimmed) return
    setClients(
      clients.map((c) =>
        c.id === id ? { ...c, name: trimmed, groupId: editGroupId } : c
      )
    )
    cancelEdit()
  }

  function setActive(id, isActive) {
    setClients(clients.map((c) => (c.id === id ? { ...c, isActive } : c)))
  }

  function handleArchive(client) {
    if (window.confirm(`Archiver ${client.name} ? L'historique reste conservé.`)) {
      setActive(client.id, false)
    }
  }

  function getGroupName(gId) {
    return groups.find((g) => String(g.id) === String(gId))?.name || null
  }

  return (
    <div className="card">
      <form className="form-group row-form add-client-row" onSubmit={handleAdd}>
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
          <option value="">Aucun groupe</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <button type="submit" className="primary-btn btn-compact" style={{ flex: 1 }}>
          Ajouter
        </button>
      </form>

      {clients.length === 0 ? (
        <p className="empty-hint">Aucun client ajouté pour le moment.</p>
      ) : (
        <ul className="client-list">
          {activeClients.map((client) => {
            const isEditing = editingId === client.id
            const groupLabel = getGroupName(client.groupId)

            if (isEditing) {
              return (
                <li key={client.id} className="client-edit-item">
                  <div className="client-edit-inputs">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nom du client"
                      autoFocus
                    />
                    <select
                      className="custom-select"
                      value={editGroupId}
                      onChange={(e) => setEditGroupId(e.target.value)}
                    >
                      <option value="">Aucun groupe</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="client-edit-actions">
                    <button
                      type="button"
                      className="secondary-btn btn-compact"
                      onClick={cancelEdit}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      className="primary-btn btn-compact"
                      onClick={() => saveEdit(client.id)}
                    >
                      OK
                    </button>
                  </div>
                </li>
              )
            }

            return (
              <li key={client.id}>
                <div className="manage-client-info">
                  <span className="client-name">{client.name}</span>
                  {groupLabel && (
                    <span className="client-group-tag">{groupLabel}</span>
                  )}
                </div>

                <div className="manage-client-actions">
                  <button
                    type="button"
                    className="secondary-btn edit-client-btn"
                    onClick={() => startEdit(client)}
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleArchive(client)}
                  >
                    Archiver
                  </button>
                </div>
              </li>
            )
          })}
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
                  type="button"
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
