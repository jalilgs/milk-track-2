import { useState } from 'react'

function GroupsCard({ groups, setGroups, clients, setClients }) {
  const [name, setName] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setGroups([...groups, { id: Date.now(), name: trimmed }])
    setName('')
  }

  function handleDelete(group) {
    if (!window.confirm(`Supprimer le groupe "${group.name}" ?`)) return
    setGroups(groups.filter((g) => g.id !== group.id))
    setClients(
      clients.map((c) => (c.groupId === group.id ? { ...c, groupId: '' } : c))
    )
  }

  return (
    <div className="card">
      <h2>Gérer les groupes / tournées</h2>

      <form
        onSubmit={handleAdd}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '12px',
          marginBottom: '16px',
        }}
      >
        <input
          type="text"
          placeholder="Nom du groupe (ex. Bologhine)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1, minWidth: 0 }}
        />
        <button
          type="submit"
          className="primary-btn btn-compact"
          style={{ flexShrink: 0 }}
        >
          Ajouter
        </button>
      </form>

      {groups.length === 0 ? (
        <p className="empty-hint">Aucun groupe créé.</p>
      ) : (
        <ul className="client-list">
          {groups.map((group) => (
            <li key={group.id}>
              <span className="client-name">{group.name}</span>
              <button
                type="button"
                className="delete-btn"
                onClick={() => handleDelete(group)}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default GroupsCard
