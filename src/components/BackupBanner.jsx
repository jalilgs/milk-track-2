import { useState } from 'react'
import { exportBackup } from '../backup'
import { isToday } from '../utils'

function BackupBanner({ backupData, lastBackup, onBackupDone }) {
  const [dismissedToday, setDismissedToday] = useState(false)

  // Never show if already backed up today or dismissed today
  if (dismissedToday || (lastBackup && isToday(lastBackup))) {
    return null
  }

  const today = new Date()
  const isThursday = today.getDay() === 4
  const daysSinceBackup = lastBackup
    ? Math.floor((today - new Date(lastBackup)) / (1000 * 60 * 60 * 24))
    : 999

  // Show only on Thursdays OR if 7+ days passed without a backup (and there is data to save)
  const hasData = backupData.clients.length > 0 || backupData.sales.length > 0
  if (!hasData || (!isThursday && daysSinceBackup < 7)) {
    return null
  }

  function handleQuickExport() {
    exportBackup(backupData)
    const now = new Date().toISOString()
    localStorage.setItem('milk_app_last_backup', now)
    if (onBackupDone) onBackupDone(now)
  }

  return (
    <div className="backup-banner" role="region" aria-label="Rappel de sauvegarde">
      <div className="backup-banner__text">
        <strong>{isThursday ? 'Sauvegarde du jeudi' : 'Sauvegarde recommandée'}</strong>
        <span>Exportez vos données en JSON pour éviter toute perte.</span>
      </div>
      <div className="backup-banner__actions">
        <button type="button" className="primary-btn btn-compact" onClick={handleQuickExport}>
          Sauvegarder
        </button>
        <button
          type="button"
          className="secondary-btn backup-banner__close"
          onClick={() => setDismissedToday(true)}
          aria-label="Ignorer aujourd'hui"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default BackupBanner
