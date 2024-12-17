import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AppProvider from './contexts/AppProvider.tsx'
import {BrowserRouter as Router} from 'react-router-dom'
import SocketProvider from './contexts/SocketProvider.tsx'
import FeedProvider from './contexts/FeedProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <FeedProvider>
        <SocketProvider>
          <Router>
            <App />
          </Router>
        </SocketProvider>
      </FeedProvider>
    </AppProvider>
  </StrictMode>,
)
