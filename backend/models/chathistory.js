import mongoose from 'mongoose'

const chatHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rollNumber: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: function() {
      return `Chat - ${new Date().toLocaleDateString()}`
    }
  },
  messages: [{
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
    translatedText: String,
    confidence: Number,
    category: String,
    faqMatched: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FAQ'
    }
  }],
  platform: {
    type: String,
    enum: ['web', 'whatsapp', 'telegram'],
    default: 'web'
  },
  language: {
    type: String,
    default: 'en'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
  summary: {
    totalMessages: { type: Number, default: 0 },
    userMessages: { type: Number, default: 0 },
    botMessages: { type: Number, default: 0 },
    averageResponseTime: { type: Number, default: 0 },
    categoriesDiscussed: [String],
    satisfactionRating: Number
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isBookmarked: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
})

// Indexes for efficient querying
chatHistorySchema.index({ user: 1, createdAt: -1 })
chatHistorySchema.index({ rollNumber: 1, lastActivity: -1 })
chatHistorySchema.index({ sessionId: 1 })
chatHistorySchema.index({ status: 1, lastActivity: -1 })

// Pre-save middleware to update summary
chatHistorySchema.pre('save', function(next) {
  if (this.messages && this.messages.length > 0) {
    this.summary.totalMessages = this.messages.length
    this.summary.userMessages = this.messages.filter(m => m.sender === 'user').length
    this.summary.botMessages = this.messages.filter(m => m.sender === 'bot').length
    
    // Extract categories discussed
    const categories = [...new Set(this.messages
      .filter(m => m.category)
      .map(m => m.category))]
    this.summary.categoriesDiscussed = categories
    
    // Update title based on first user message
    const firstUserMessage = this.messages.find(m => m.sender === 'user')
    if (firstUserMessage && !this.title.includes('Chat -')) {
      this.title = firstUserMessage.text.substring(0, 50) + '...'
    }
  }
  next()
})

export default mongoose.model('ChatHistory', chatHistorySchema)