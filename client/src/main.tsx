import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AppProvider from './contexts/AppProvider.tsx'
import {BrowserRouter as Router} from 'react-router-dom'
import SocketProvider from './contexts/SocketProvider.tsx'
import FeedProvider from './contexts/FeedProvider.tsx'
import ChatProvider from './contexts/ChatProvider.tsx'

createRoot(document.getElementById('root')!).render(
  
  <AppProvider>
    <SocketProvider>
      <FeedProvider>
        <ChatProvider>
          <Router>
            <App />
          </Router>
        </ChatProvider>
      </FeedProvider>
    </SocketProvider>
  </AppProvider>
)
