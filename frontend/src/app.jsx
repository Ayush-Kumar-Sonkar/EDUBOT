import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from './contexts/LanguageContext'
import { SocketProvider } from './contexts/SocketContext'
import { AuthProvider } from './contexts/authcontext'
import Layout from './components/Layout'
import ChatInterface from './pages/chatinterface'
import AdminDashboard from './pages/admindashboard'
import Analytics from './pages/analytics'
import Integration from './pages/integration'
import EnvironmentSetup from './pages/environmentsetup'
import Login from './pages/login'
import Profile from './pages/profile'
import ChatHistory from './pages/chathistory'
import Feedback from './pages/feedback'

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SocketProvider>
          <Router>
            <div className="min-h-screen bg-dark-900">
              <Layout>
                <Routes>
                  <Route path="/" element={<ChatInterface />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/chat-history" element={<ChatHistory />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/integration" element={<Integration />} />
                  <Route path="/environment" element={<EnvironmentSetup />} />
                </Routes>
              </Layout>
              <Toaster 
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid #334155'
                  }
                }}
              />
            </div>
          </Router>
        </SocketProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App