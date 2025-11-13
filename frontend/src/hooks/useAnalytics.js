import { useState } from 'react'
import { analyticsAPI } from '../services/api'

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalConversations: 0,
    languageDistribution: [],
    categoryStats: [],
    resolutionRate: 0,
    recentActivity: []
  })
  const [isLoading, setIsLoading] = useState(false)

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await analyticsAPI.getAnalytics()
      setAnalytics(response.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getLanguageStats = async () => {
    try {
      const response = await analyticsAPI.getLanguageStats()
      return response.data
    } catch (error) {
      console.error('Error fetching language stats:', error)
      return []
    }
  }

  const getCategoryStats = async () => {
    try {
      const response = await analyticsAPI.getCategoryStats()
      return response.data
    } catch (error) {
      console.error('Error fetching category stats:', error)
      return []
    }
  }

  return {
    analytics,
    isLoading,
    fetchAnalytics,
    getLanguageStats,
    getCategoryStats
  }
}
