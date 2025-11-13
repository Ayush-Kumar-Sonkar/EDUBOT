import React from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  const location = useLocation()
  const isChatInterface = location.pathname === '/'

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="flex">
        {isChatInterface && <Sidebar />}
        <main className={`flex-1 ${isChatInterface ? 'ml-80' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout