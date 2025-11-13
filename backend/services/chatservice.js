import FAQ from '../models/faq.js'
import Conversation from '../models/conversation.js'
import ChatHistory from '../models/chathistory.js'
import User from '../models/user.js'
import { translateText } from './translationservice.js'
import { findBestMatch } from './nlpservice.js'
import { updateAnalytics } from './analyticsservice.js'

export const processMessage = async ({ message, language, sessionId, platform, metadata }) => {
  try {
    console.log(`💬 Processing message: "${message}" in ${language}`)
    
    // Find or create conversation
    let conversation = await Conversation.findOne({ sessionId })
    
    if (!conversation) {
      conversation = new Conversation({
        sessionId,
        platform,
        language,
        metadata
      })
      console.log(`🆕 Created new conversation: ${sessionId}`)
    }

    // Add user message to conversation
    conversation.messages.push({
      text: message,
      sender: 'user',
      language,
      timestamp: new Date()
    })

    // Save to chat history if user is authenticated
    if (metadata?.userId) {
      try {
        await saveToChatHistory(metadata.userId, sessionId, {
          text: message,
          sender: 'user',
          language,
          timestamp: new Date()
        }, platform)
      } catch (error) {
        console.warn('Failed to save user message to chat history:', error.message)
      }
    }

    // Translate message to English if needed for processing
    let processedMessage = message
    if (language !== 'en') {
      try {
        processedMessage = await translateText(message, language, 'en')
        console.log(`🌐 Translated "${message}" to "${processedMessage}"`)
      } catch (error) {
        console.warn('Translation failed, using original message:', error.message)
      }
    }

    // Find best matching FAQ
    const bestMatch = await findBestMatch(processedMessage, language)
    
    let botResponse = "I'm sorry, I couldn't find a specific answer to your question. Could you please rephrase it or contact our support team for assistance?"
    let confidence = 0

    if (bestMatch && bestMatch.confidence > 0.1) {
      botResponse = bestMatch.faq.answer
      confidence = bestMatch.confidence
      
      console.log(` Found match: "${bestMatch.faq.question}" (confidence: ${confidence.toFixed(3)})`)

      // Translate response back to user's language if needed
      if (language !== 'en' && bestMatch.faq.language === 'en') {
        try {
          botResponse = await translateText(botResponse, 'en', language)
          console.log(`🌐 Translated response to ${language}`)
        } catch (error) {
          console.warn('Response translation failed:', error.message)
        }
      }
    } else {
      console.log('❌ No suitable match found, using default response')
    }

    // Add bot response to conversation
    conversation.messages.push({
      text: botResponse,
      sender: 'bot',
      language,
      confidence,
      timestamp: new Date()
    })

    // Save bot response to chat history
    if (metadata?.userId) {
      try {
        await saveToChatHistory(metadata.userId, sessionId, {
          text: botResponse,
          sender: 'bot',
          language,
          confidence,
          timestamp: new Date(),
          category: bestMatch?.faq?.category,
          faqMatched: bestMatch?.faq?._id
        }, platform)
      } catch (error) {
        console.warn('Failed to save bot response to chat history:', error.message)
      }
    }

    // Update conversation metadata
    conversation.lastMessage = message
    conversation.lastActivity = new Date()
    conversation.language = language

    await conversation.save()

    // Update analytics
    await updateAnalytics({
      platform,
      language,
      messageCount: 1,
      resolved: confidence > 0.1
    })

    console.log(`📤 Sending response: "${botResponse.substring(0, 100)}..."`)

    return {
      message: botResponse,
      confidence,
      sessionId,
      timestamp: new Date().toISOString()
    }

  } catch (error) {
    console.error('Process message error:', error)
    throw new Error('Failed to process message')
  }
}

export const getConversationHistory = async (sessionId) => {
  try {
    const conversation = await Conversation.findOne({ sessionId })
    return conversation
  } catch (error) {
    console.error('Get conversation history error:', error)
    throw new Error('Failed to get conversation history')
  }
}

export const updateConversationStatus = async (sessionId, status) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      { sessionId },
      { status, lastActivity: new Date() },
      { new: true }
    )
    return conversation
  } catch (error) {
    console.error('Update conversation status error:', error)
    throw new Error('Failed to update conversation status')
  }
}

// Helper function to save messages to chat history
const saveToChatHistory = async (userId, sessionId, message, platform) => {
  try {
    const user = await User.findById(userId)
    if (!user) return

    let chatHistory = await ChatHistory.findOne({
      user: userId,
      sessionId
    })

    if (!chatHistory) {
      chatHistory = new ChatHistory({
        user: userId,
        rollNumber: user.rollNumber,
        sessionId,
        platform: platform || 'web',
        language: message.language || 'en',
        messages: []
      })
    }

    chatHistory.messages.push(message)
    chatHistory.lastActivity = new Date()
    
    await chatHistory.save()
    
    console.log(`💾 Message saved to chat history for user ${user.rollNumber}`)
  } catch (error) {
    console.error('Save to chat history error:', error)
  }
}