import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  language: {
    type: String,
    default: 'en'
  },
  translatedText: {
    type: String
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  }
})

const conversationSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    default: 'anonymous'
  },
  platform: {
    type: String,
    enum: ['web', 'whatsapp', 'telegram'],
    default: 'web'
  },
  language: {
    type: String,
    default: 'en'
  },
  messages: [messageSchema],
  status: {
    type: String,
    enum: ['active', 'resolved', 'escalated'],
    default: 'active'
  },
  lastMessage: {
    type: String
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    location: String
  }
}, {
  timestamps: true
})

// Index for efficient querying
//conversationSchema.index({ sessionId: 1 })
conversationSchema.index({ platform: 1, language: 1 })
conversationSchema.index({ lastActivity: -1 })
conversationSchema.index({ status: 1 })

export default mongoose.model('Conversation', conversationSchema)