import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// Backward-compatibility: if visitor enters via legacy hash URL (#/contact or #/), seamlessly redirect
if (typeof window !== 'undefined' && window.location.hash.startsWith('#/')) {
  const cleanPath = window.location.hash.slice(2)
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  window.history.replaceState(null, '', `${base}/${cleanPath}`)
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <App />
  </BrowserRouter>
)
