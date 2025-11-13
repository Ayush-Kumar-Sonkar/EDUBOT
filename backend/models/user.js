import mongoose from 'mongoose'

const userPreferencesSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ['en', 'hi', 'bn', 'ta', 'te','mwr'],
    default: 'en'
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'auto'],
    default: 'dark'
  },
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  },
  chatSettings: {
    showTimestamps: { type: Boolean, default: true },
    soundEnabled: { type: Boolean, default: true },
    autoTranslate: { type: Boolean, default: true }
  }
})

const userSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  preferences: {
    type: userPreferencesSchema,
    default: () => ({})
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  totalConversations: {
    type: Number,
    default: 0
  },
  totalMessages: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Index for efficient querying
userSchema.index({ rollNumber: 1 })
userSchema.index({ email: 1 })
userSchema.index({ department: 1, year: 1 })

export default mongoose.model('User', userSchema)