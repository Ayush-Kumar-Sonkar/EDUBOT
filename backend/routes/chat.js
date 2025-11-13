import express from 'express'
import { processMessage } from '../services/chatservice.js'
import Conversation from '../models/conversation.js'

const router = express.Router()

// Send message
router.post('/message', async (req, res) => {
  try {
    const { message, language = 'en', sessionId, platform = 'web' } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const response = await processMessage({
      message: message.trim(),
      language,
      sessionId: sessionId || `web_${Date.now()}`,
      platform,
      metadata: {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      }
    })

    res.json(response)
  } catch (error) {
    console.error('Chat message error:', error)
    res.status(500).json({ error: 'Failed to process message' })
  }
})

// Get conversation history
router.get('/conversation/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    const conversation = await getConversationHistory(sessionId)
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    res.json(conversation)
  } catch (error) {
    console.error('Get conversation error:', error)
    res.status(500).json({ error: 'Failed to get conversation' })
  }
})

// Get active conversations
router.get('/conversations/active', async (req, res) => {
  try {
    const conversations = await Conversation.find({ status: 'active' })
      .sort({ lastActivity: -1 })
      .limit(50)
      .select('sessionId platform language lastMessage lastActivity')

    res.json(conversations)
  } catch (error) {
    console.error('Get active conversations error:', error)
    res.status(500).json({ error: 'Failed to get active conversations' })
  }
})

export default router