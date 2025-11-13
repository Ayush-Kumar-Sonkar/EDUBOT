import express from 'express'
import { processMessage } from '../services/chatservice.js'
import { io } from '../server.js'

const router = express.Router()

// WhatsApp webhook
router.post('/whatsapp', async (req, res) => {
  try {
    const { from, message, language = 'auto-detect' } = req.body

    if (!from || !message) {
      return res.status(400).json({ error: 'From and message are required' })
    }

    const sessionId = `whatsapp_${from}`
    
    const response = await processMessage({
      message,
      language: language === 'auto-detect' ? 'en' : language,
      sessionId,
      platform: 'whatsapp',
      metadata: {
        phoneNumber: from,
        source: 'whatsapp'
      }
    })

    io.emit('webhook_message', {
      platform: 'whatsapp',
      from,
      message,
      response: response.message
    })

    res.json({
      success: true,
      response: response.message
    })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    res.status(500).json({ error: 'Failed to process WhatsApp message' })
  }
})

// Telegram webhook
router.post('/telegram', async (req, res) => {
  try {
    const { update_id, message } = req.body

    if (!message || !message.text) {
      return res.status(400).json({ error: 'Invalid Telegram message format' })
    }

    const sessionId = `telegram_${message.chat.id}`
    
    const response = await processMessage({
      message: message.text,
      language: 'en', // TODO: Detect language
      sessionId,
      platform: 'telegram',
      metadata: {
        chatId: message.chat.id,
        userId: message.from.id,
        firstName: message.from.first_name,
        updateId: update_id
      }
    })

    io.emit('webhook_message', {
      platform: 'telegram',
      chatId: message.chat.id,
      message: message.text,
      response: response.message
    })

    res.json({
      success: true,
      response: response.message
    })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    res.status(500).json({ error: 'Failed to process Telegram message' })
  }
})

// Generic webhook for testing
router.post('/test', async (req, res) => {
  try {
    const { message, platform = 'test', sessionId } = req.body

    const response = await processMessage({
      message,
      language: 'en',
      sessionId: sessionId || `test_${Date.now()}`,
      platform,
      metadata: { source: 'test' }
    })

    res.json(response)
  } catch (error) {
    console.error('Test webhook error:', error)
    res.status(500).json({ error: 'Failed to process test message' })
  }
})

export default router
