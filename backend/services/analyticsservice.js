import Analytics from '../models/analytics.js'
import Conversation from '../models/conversation.js'
import FAQ from '../models/faq.js'

// Update daily analytics
export const updateAnalytics = async ({ platform, language, messageCount = 1, resolved = false }) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let analytics = await Analytics.findOne({ date: today })
    
    if (!analytics) {
      analytics = new Analytics({ date: today })
    }

    // Update counters
    analytics.totalMessages += messageCount
    
    if (platform) {
      analytics.platformStats[platform] = (analytics.platformStats[platform] || 0) + 1
    }
    
    if (language) {
      analytics.languageDistribution[language] = (analytics.languageDistribution[language] || 0) + 1
    }

    // Update resolution rate
    if (resolved) {
      const totalResolved = analytics.totalMessages * (analytics.resolutionRate / 100) + 1
      analytics.resolutionRate = (totalResolved / (analytics.totalMessages + 1)) * 100
    }

    await analytics.save()
  } catch (error) {
    console.error('Update analytics error:', error)
  }
}

// Get analytics summary
export const getAnalyticsSummary = async (days = 30) => {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    const analytics = await Analytics.find({
      date: { $gte: startDate }
    }).sort({ date: -1 })

    // Aggregate data
    const summary = {
      totalConversations: 0,
      totalMessages: 0,
      languageDistribution: {},
      platformStats: {},
      averageResolutionRate: 0,
      dailyStats: []
    }

    analytics.forEach(day => {
      summary.totalMessages += day.totalMessages
      summary.averageResolutionRate += day.resolutionRate

      // Aggregate language distribution
      Object.entries(day.languageDistribution).forEach(([lang, count]) => {
        summary.languageDistribution[lang] = (summary.languageDistribution[lang] || 0) + count
      })

      // Aggregate platform stats
      Object.entries(day.platformStats).forEach(([platform, count]) => {
        summary.platformStats[platform] = (summary.platformStats[platform] || 0) + count
      })

      summary.dailyStats.push({
        date: day.date,
        messages: day.totalMessages,
        resolutionRate: day.resolutionRate
      })
    })

    // Calculate averages
    if (analytics.length > 0) {
      summary.averageResolutionRate = summary.averageResolutionRate / analytics.length
    }

    return summary
  } catch (error) {
    console.error('Get analytics summary error:', error)
    return null
  }
}

// Generate daily analytics report
export const generateDailyReport = async () => {
  try {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)

    const endOfYesterday = new Date(yesterday)
    endOfYesterday.setHours(23, 59, 59, 999)

    // Get conversation stats for yesterday
    const conversations = await Conversation.find({
      createdAt: { $gte: yesterday, $lte: endOfYesterday }
    })

    const totalConversations = conversations.length
    const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0)

    // Language distribution
    const languageDistribution = {}
    conversations.forEach(conv => {
      languageDistribution[conv.language] = (languageDistribution[conv.language] || 0) + 1
    })

    // Platform distribution
    const platformStats = {}
    conversations.forEach(conv => {
      platformStats[conv.platform] = (platformStats[conv.platform] || 0) + 1
    })

    // Resolution rate (simplified - based on conversation status)
    const resolvedConversations = conversations.filter(conv => conv.status === 'resolved').length
    const resolutionRate = totalConversations > 0 ? (resolvedConversations / totalConversations) * 100 : 0

    // Update or create analytics record
    let analytics = await Analytics.findOne({ date: yesterday })
    
    if (!analytics) {
      analytics = new Analytics({ date: yesterday })
    }

    analytics.totalConversations = totalConversations
    analytics.totalMessages = totalMessages
    analytics.languageDistribution = languageDistribution
    analytics.platformStats = platformStats
    analytics.resolutionRate = resolutionRate

    await analytics.save()

    console.log(`Daily report generated for ${yesterday.toDateString()}:`, {
      totalConversations,
      totalMessages,
      resolutionRate: resolutionRate.toFixed(2) + '%'
    })

    return analytics
  } catch (error) {
    console.error('Generate daily report error:', error)
    return null
  }
}

// Get real-time stats
export const getRealTimeStats = async () => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get today's conversations
    const todayConversations = await Conversation.countDocuments({
      createdAt: { $gte: today }
    })

    // Get active conversations
    const activeConversations = await Conversation.countDocuments({
      status: 'active',
      lastActivity: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // Active in last 30 minutes
    })

    // Get total FAQs
    const totalFaqs = await FAQ.countDocuments({ isActive: true })

    // Get language distribution for today
    const languageStats = await Conversation.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: '$language', count: { $sum: 1 } } }
    ])

    return {
      todayConversations,
      activeConversations,
      totalFaqs,
      languageStats: languageStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count
        return acc
      }, {})
    }
  } catch (error) {
    console.error('Get real-time stats error:', error)
    return null
  }
}