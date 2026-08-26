import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AppStateProvider } from './hooks/useAppState'
import './styles.css'

createRoot(document.getElementById('root')!).render(<StrictMode><AppStateProvider><App/></AppStateProvider></StrictMode>)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => undefined))
}
