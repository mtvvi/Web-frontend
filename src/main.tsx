import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { registerSW } from 'virtual:pwa-register'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.tsx'
import { store } from './store'

const ghRedirectPath = sessionStorage.getItem('redirect')
if (ghRedirectPath) {
  sessionStorage.removeItem('redirect')
  const normalizedPath = ghRedirectPath.startsWith('/') ? ghRedirectPath : `/${ghRedirectPath}`
  if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
    window.location.hash = normalizedPath
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  registerSW({ immediate: true })
}
