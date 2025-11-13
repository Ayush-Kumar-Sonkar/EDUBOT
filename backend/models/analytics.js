import mongoose from 'mongoose'

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  totalConversations: {
    type: Number,
    default: 0
  },
  totalMessages: {
    type: Number,
    default: 0
  },
  languageDistribution: {
    en: { type: Number, default: 0 },
    hi: { type: Number, default: 0 },
    bn: { type: Number, default: 0 },
    ta: { type: Number, default: 0 },
    te: { type: Number, default: 0 },
    mwr: { type: Number, default: 0 }
  },
  categoryStats: {
    admissions: { type: Number, default: 0 },
    academic: { type: Number, default: 0 },
    campus: { type: Number, default: 0 },
    financial: { type: Number, default: 0 },
    technical: { type: Number, default: 0 }
  },
  platformStats: {
    web: { type: Number, default: 0 },
    whatsapp: { type: Number, default: 0 },
    telegram: { type: Number, default: 0 },
  },
  resolutionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  averageResponseTime: {
    type: Number,
    default: 0
  },
  userSatisfaction: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
})

// Index for date-based queries
analyticsSchema.index({ date: -1 })

export default mongoose.model('Analytics', analyticsSchema)