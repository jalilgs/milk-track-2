import { useState } from 'react'
import { exportBackup, parseBackup } from '../backup'

function BackupCard({ data, onRestore, onBackupExported }) {
  const [status, setStatus] = useState({ text: '', error: false })

  function handleExport() {
    exportBackup(data)
    const now = new Date().toISOString()
    localStorage.setItem('milk_app_last_backup', now)
    if (onBackupExported) onBackupExported(now)
    setStatus({ text: 'Sauvegarde exportée.', error: false })
  }

  async function handleImport(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return

    const backup = parseBackup(await file.text())
    if (!backup) {
      setStatus({
        text: 'Ce fichier ne semble pas être une sauvegarde de Milk Manager.',
        error: true,
      })
      return
    }

    const confirmed = window.confirm(
      `Cela remplacera tous les clients, ventes, prix et stock actuels par ceux du fichier ` +
        `(${backup.clients.length} clients, ${backup.sales.length} ventes). Continuer ?`
    )
    if (!confirmed) return

    onRestore(backup)
    setStatus({ text: 'Sauvegarde restaurée avec succès.', error: false })
  }

  return (
    <div className="card">
      <p className="hint-text">
        Vos données ne sont enregistrées que dans ce navigateur. Exportez une sauvegarde de temps
        en temps pour qu'un cache effacé ou un nouveau téléphone ne vous fasse jamais perdre votre
        liste de clients, vos prix ou votre historique de ventes.
      </p>

      <div className="backup-actions">
        <button type="button" className="secondary-btn" onClick={handleExport}>
          Exporter la sauvegarde
        </button>
        <label htmlFor="import-data-input" className="secondary-btn file-btn">
          Importer une sauvegarde
        </label>
        <input
          type="file"
          id="import-data-input"
          accept="application/json"
          hidden
          onChange={handleImport}
        />
      </div>

      <p className={`status-msg ${status.error ? 'status-error' : ''}`}>{status.text}</p>
    </div>
  )
}

export default BackupCard
