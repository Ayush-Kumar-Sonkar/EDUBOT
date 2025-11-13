import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bot, ChevronDown, User, LogOut } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/authcontext'
import LanguageSelector from './LanguageSelector'

const Navbar = () => {
  const location = useLocation()
  const { translate } = useLanguage()
  const { user, isAuthenticated, logout } = useAuth()

  const navItems = [
    { path: '/', label: translate('nav.chat'), key: 'chat' },
    { path: '/chat-history', label: 'Chat History', key: 'history', authRequired: true },
    { path: '/feedback', label: 'Feedback', key: 'feedback', authRequired: true },
    { path: '/admin', label: translate('nav.admin'), key: 'admin' },
    { path: '/analytics', label: translate('nav.analytics'), key: 'analytics' },
    { path: '/integration', label: translate('nav.integration'), key: 'integration' },
    { path: '/environment', label: translate('nav.environment'), key: 'environment' }
  ].filter(item => !item.authRequired || isAuthenticated)

  return (
    <nav className="bg-dark-800 border-b border-dark-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold text-primary-500">EduBot</span>
          </Link>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`nav-item ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSelector />
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-3 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">{user?.name}</span>
              </Link>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar