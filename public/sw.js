// Change this number every time you publish a new version of the app
const CACHE_NAME = 'milk-manager-react-v3'

// Files that never change name. Paths are relative to this file.
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
      )
  )
  self.clients.claim()
})

// The page tells us which files it loaded (the built JS and CSS have
// names that change at every build), and we save each one for offline use.
self.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'CACHE_URLS') return
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled([...new Set(event.data.urls)].map((url) => cache.add(url)))
    )
  )
})

// Network first (always the newest version when online),
// saved copy when offline.
self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET' || !request.url.startsWith('http')) return

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        }
        return response
      })
      .catch(async () => {
        // ignoreVary: some servers (like "vite preview") send "Vary: Origin",
        // which would stop the browser from matching our saved copy
        const options = { ignoreVary: true }
        const cached = await caches.match(request, options)
        if (cached) return cached
        if (request.mode === 'navigate') return caches.match('./', options)
        return Response.error()
      })
  )
})
