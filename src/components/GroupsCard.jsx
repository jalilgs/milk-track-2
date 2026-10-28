import { useState } from 'react'

function GroupsCard({ groups, setGroups, clients, setClients }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setGroups([...groups, { id: 'grp_' + Date.now(), name: trimmed }])
    setName('')
  }

  function handleDelete(groupId) {
    setGroups(groups.filter((g) => g.id !== groupId))
    // clients of this group become "unassigned"
    setClients(
      clients.map((c) => (c.groupId === groupId ? { ...c, groupId: '' } : c))
    )
  }

  return (
    <div className="card">
      <h2>Gérer les groupes / tournées</h2>

      <form id="addGroupForm" className="row-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom du groupe (ex. Bologhine)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit" className="primary-btn btn-compact">
          Ajouter
        </button>
      </form>

      {groups.length === 0 ? (
        <p className="empty-hint">Aucun groupe / tournée ajouté.</p>
      ) : (
        <ul className="client-list">
          {groups.map((group) => (
            <li key={group.id}>
              <span className="client-name">{group.name}</span>
              <button className="delete-btn" onClick={() => handleDelete(group.id)}>
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
