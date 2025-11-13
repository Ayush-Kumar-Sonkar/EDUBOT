import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['admissions', 'academic', 'campus', 'financial', 'technical', 'general'],
    default: 'general'
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'bn', 'ta', 'te','mwr']
  },
  keywords: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isProcessed: {
    type: Boolean,
    default: false
  },
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  uploadedBy: {
    type: String,
    default: 'admin'
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  accessCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Index for text search
documentSchema.index({ 
  title: 'text', 
  extractedText: 'text', 
  keywords: 'text' 
})

// Index for category and language filtering
documentSchema.index({ category: 1, language: 1, isActive: 1 })

export default mongoose.model('Document', documentSchema)