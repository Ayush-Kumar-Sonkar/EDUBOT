import React, { createContext, useContext, useState, useEffect } from 'react'
import { chatAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('edubot-token')
    const userData = localStorage.getItem('edubot-user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
        // Set token in API headers
        chatAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        logout()
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      console.log('🔐 Attempting login with:', credentials)
      console.log('🌐 API Base URL:', chatAPI.defaults.baseURL)
      const response = await chatAPI.post('/auth/login', credentials)
      console.log(' Login response:', response.data)
      const { token, user: userData } = response.data

      // Store token and user data
      localStorage.setItem('edubot-token', token)
      localStorage.setItem('edubot-user', JSON.stringify(userData))
      
      // Set token in API headers
      chatAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(userData)
      setIsAuthenticated(true)
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('❌ Login error:', error)
      console.error('❌ Error response:', error.response)
      console.error('❌ Error message:', error.message)
      console.error('❌ Error config:', error.config)
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.details || error.message || 'Login failed. Please try again.' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('edubot-token')
    localStorage.removeItem('edubot-user')
    delete chatAPI.defaults.headers.common['Authorization']
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('edubot-user', JSON.stringify(userData))
  }

  const updatePreferences = async (preferences) => {
    try {
      const response = await chatAPI.put('/auth/preferences', { preferences })
      const updatedUser = { ...user, preferences: response.data.preferences }
      updateUser(updatedUser)
      return { success: true }
    } catch (error) {
      console.error('Update preferences error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to update preferences' 
      }
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    updatePreferences
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}