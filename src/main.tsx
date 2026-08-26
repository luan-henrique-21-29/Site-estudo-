import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AuthProvider } from './hooks/useAuth'
import { AppStateProvider } from './hooks/useAppState'
import './styles.css'
import './activities.css'
import './salaries.css'
import './playground.css'
import './career-salaries.css'
import './focus.css'
import './cities.css'
import './account.css'
import './simple.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppStateProvider><App/></AppStateProvider>
    </AuthProvider>
  </StrictMode>
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => undefined))
}
