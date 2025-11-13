import express from 'express'
import Analytics from '../models/analytics.js'
import Conversation from '../models/conversation.js'
import FAQ from '../models/faq.js'
import Document from '../models/document.js'

const router = express.Router()

// Get real-time analytics overview
router.get('/overview', async (req, res) => {
  try {
    // Get real-time FAQ count
    const totalFaqs = await FAQ.countDocuments({ isActive: true })
    
    // Get FAQ count by category
    const faqsByCategory = await FAQ.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    // Get FAQ count by language
    const faqsByLanguage = await FAQ.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    // Get total conversations (real-time)
    const totalConversations = await Conversation.countDocuments()
    
    // Get conversations by platform
    const conversationsByPlatform = await Conversation.aggregate([
      { $group: { _id: '$platform', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    // Get conversations by language
    const conversationsByLanguage = await Conversation.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    // Get today's conversations
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayConversations = await Conversation.countDocuments({
      createdAt: { $gte: today }
    })

    // Get active conversations (last 30 minutes)
    const activeConversations = await Conversation.countDocuments({
      status: 'active',
      lastActivity: { $gte: new Date(Date.now() - 30 * 60 * 1000) }
    })

    // Calculate resolution rate
    const resolvedConversations = await Conversation.countDocuments({
      status: 'resolved'
    })
    const resolutionRate = totalConversations > 0 ? 
      ((resolvedConversations / totalConversations) * 100).toFixed(1) : 0

    // Get document count
    const totalDocuments = await Document.countDocuments({ isActive: true })

    // Get recent activity
    const recentActivity = await Conversation.find()
      .sort({ lastActivity: -1 })
      .limit(10)
      .select('language lastMessage createdAt platform')

    const formattedActivity = recentActivity.map(conv => ({
      time: getTimeAgo(conv.createdAt),
      message: `New conversation in ${conv.language?.toUpperCase()} on ${conv.platform}`,
      details: conv.lastMessage?.substring(0, 50) + '...'
    }))

    res.json({
      totalFaqs,
      totalConversations,
      todayConversations,
      activeConversations,
      totalDocuments,
      resolutionRate: parseFloat(resolutionRate),
      faqsByCategory: faqsByCategory.map(item => ({
        category: item._id,
        count: item.count
      })),
      faqsByLanguage: faqsByLanguage.map(item => ({
        language: item._id,
        count: item.count
      })),
      conversationsByPlatform: conversationsByPlatform.map(item => ({
        platform: item._id,
        count: item.count
      })),
      conversationsByLanguage: conversationsByLanguage.map(item => ({
        language: item._id,
        count: item.count
      })),
      recentActivity: formattedActivity
    })
  } catch (error) {
    console.error('Analytics overview error:', error)
    res.status(500).json({ error: 'Failed to get analytics overview' })
  }
})

// Get language statistics
router.get('/languages', async (req, res) => {
  try {
    const { days = 30 } = req.query
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const languageStats = await Conversation.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    const formattedStats = languageStats.map(stat => ({
      language: stat._id,
      count: stat.count,
      percentage: 0
    }))

    const total = formattedStats.reduce((sum, stat) => sum + stat.count, 0)
    formattedStats.forEach(stat => {
      stat.percentage = total > 0 ? ((stat.count / total) * 100).toFixed(1) : 0
    })

    res.json(formattedStats)
  } catch (error) {
    console.error('Language stats error:', error)
    res.status(500).json({ error: 'Failed to get language statistics' })
  }
})

// Get category statistics (real-time FAQ data)
router.get('/categories', async (req, res) => {
  try {
    const categoryStats = await FAQ.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    res.json(categoryStats.map(stat => ({
      category: stat._id,
      count: stat.count
    })))
  } catch (error) {
    console.error('Category stats error:', error)
    res.status(500).json({ error: 'Failed to get category statistics' })
  }
})

// Get activity log
router.get('/activity', async (req, res) => {
  try {
    const { limit = 50 } = req.query

    const activities = await Conversation.find()
      .sort({ lastActivity: -1 })
      .limit(parseInt(limit))
      .select('sessionId platform language lastMessage lastActivity status')

    const formattedActivities = activities.map(activity => ({
      id: activity._id,
      time: getTimeAgo(activity.lastActivity),
      message: `Conversation in ${activity.language?.toUpperCase()} on ${activity.platform}`,
      details: activity.lastMessage?.substring(0, 100) + '...'
    }))

    res.json(formattedActivities)
  } catch (error) {
    console.error('Activity log error:', error)
    res.status(500).json({ error: 'Failed to get activity log' })
  }
})

// Helper function to format time ago
function getTimeAgo(date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

export default router