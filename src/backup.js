// Downloads the data as a .json file.
export function exportBackup(data) {
  const payload = { exportedAt: new Date().toISOString(), ...data }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })

  // Browsers download files through a link, so we create one and click it
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `milk-manager-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

// Reads the text of a file. Returns the data if it looks like a backup,
// or null if it doesn't.
export function parseBackup(text) {
  try {
    const data = JSON.parse(text)
    if (data && Array.isArray(data.clients) && Array.isArray(data.sales)) {
      return data
    }
  } catch {
    // not valid JSON
  }
  return null
}
