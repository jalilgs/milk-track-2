import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import './styles/text-size.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./sw.js')
      const registration = await navigator.serviceWorker.ready

      // Tell the worker which files this page loaded, so they work offline
      const urls = performance
        .getEntriesByType('resource')
        .map((entry) => entry.name)
        .filter((url) => url.startsWith(location.origin))
      registration.active.postMessage({ type: 'CACHE_URLS', urls })
    } catch (err) {
      console.error('Service worker registration failed:', err)
    }
  })
}
