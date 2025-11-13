import express from 'express'
import ChatHistory from '../models/chathistory.js'
import User from '../models/user.js'
import { authenticateToken } from './auth.js'

const router = express.Router()

// Get user's chat history
router.get('/my-chats', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query
    
    let query = { user: req.user.userId }
    if (status) query.status = status
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'messages.text': { $regex: search, $options: 'i' } }
      ]
    }

    const chats = await ChatHistory.find(query)
      .populate('user', 'name rollNumber')
      .sort({ lastActivity: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-messages') // Exclude messages for list view

    const total = await ChatHistory.countDocuments(query)

    res.json({
      chats,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    })

  } catch (error) {
    console.error('Get chat history error:', error)
    res.status(500).json({ error: 'Failed to get chat history' })
  }
})

// Get specific chat with full messages
router.get('/chat/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    
    const chat = await ChatHistory.findOne({
      _id: id,
      user: req.user.userId
    }).populate('user', 'name rollNumber department year')

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    res.json(chat)

  } catch (error) {
    console.error('Get specific chat error:', error)
    res.status(500).json({ error: 'Failed to get chat' })
  }
})

// Save/Update chat history
router.post('/save', authenticateToken, async (req, res) => {
  try {
    const { sessionId, messages, platform, language, title } = req.body

    if (!sessionId || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Session ID and messages array are required' 
      })
    }

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Find existing chat or create new one
    let chat = await ChatHistory.findOne({
      user: user._id,
      sessionId
    })

    if (chat) {
      // Update existing chat
      chat.messages = messages
      chat.lastActivity = new Date()
      if (title) chat.title = title
      if (platform) chat.platform = platform
      if (language) chat.language = language
    } else {
      // Create new chat
      chat = new ChatHistory({
        user: user._id,
        rollNumber: user.rollNumber,
        sessionId,
        messages,
        platform: platform || 'web',
        language: language || 'en',
        title: title || `Chat - ${new Date().toLocaleDateString()}`
      })
    }

    await chat.save()

    // Update user statistics
    user.totalConversations = await ChatHistory.countDocuments({ user: user._id })
    user.totalMessages = await ChatHistory.aggregate([
      { $match: { user: user._id } },
      { $project: { messageCount: { $size: '$messages' } } },
      { $group: { _id: null, total: { $sum: '$messageCount' } } }
    ]).then(result => result[0]?.total || 0)
    
    await user.save()

    res.json({
      success: true,
      chatId: chat._id,
      message: 'Chat history saved successfully'
    })

  } catch (error) {
    console.error('Save chat history error:', error)
    res.status(500).json({ error: 'Failed to save chat history' })
  }
})

// Update chat (bookmark, archive, etc.)
router.put('/chat/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { isBookmarked, status, title, tags, satisfactionRating } = req.body

    const updateData = {}
    if (typeof isBookmarked === 'boolean') updateData.isBookmarked = isBookmarked
    if (status) updateData.status = status
    if (title) updateData.title = title
    if (tags) updateData.tags = tags
    if (satisfactionRating) updateData['summary.satisfactionRating'] = satisfactionRating

    const chat = await ChatHistory.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      updateData,
      { new: true, runValidators: true }
    )

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    res.json({
      success: true,
      chat
    })

  } catch (error) {
    console.error('Update chat error:', error)
    res.status(500).json({ error: 'Failed to update chat' })
  }
})

// Delete chat
router.delete('/chat/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const chat = await ChatHistory.findOneAndDelete({
      _id: id,
      user: req.user.userId
    })

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    res.json({
      success: true,
      message: 'Chat deleted successfully'
    })

  } catch (error) {
    console.error('Delete chat error:', error)
    res.status(500).json({ error: 'Failed to delete chat' })
  }
})

// Get chat statistics for user
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    const stats = await ChatHistory.aggregate([
      { $match: { user: req.user.userId } },
      {
        $group: {
          _id: null,
          totalChats: { $sum: 1 },
          totalMessages: { $sum: '$summary.totalMessages' },
          averageMessagesPerChat: { $avg: '$summary.totalMessages' },
          bookmarkedChats: {
            $sum: { $cond: ['$isBookmarked', 1, 0] }
          },
          platformBreakdown: { $push: '$platform' },
          languageBreakdown: { $push: '$language' },
          categoriesDiscussed: { $push: '$summary.categoriesDiscussed' }
        }
      }
    ])

    const recentChats = await ChatHistory.find({ user: req.user.userId })
      .sort({ lastActivity: -1 })
      .limit(5)
      .select('title lastActivity summary.totalMessages platform')

    res.json({
      statistics: stats[0] || {
        totalChats: 0,
        totalMessages: 0,
        averageMessagesPerChat: 0,
        bookmarkedChats: 0,
        platformBreakdown: [],
        languageBreakdown: [],
        categoriesDiscussed: []
      },
      recentChats
    })

  } catch (error) {
    console.error('Get chat statistics error:', error)
    res.status(500).json({ error: 'Failed to get statistics' })
  }
})

export default router