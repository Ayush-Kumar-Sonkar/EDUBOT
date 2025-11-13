import mongoose from 'mongoose'

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['admissions', 'academic', 'campus', 'financial', 'technical'],
    default: 'admissions'
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
  createdBy: {
    type: String,
    default: 'admin'
  },
  updatedBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
})

// Index for text search
faqSchema.index({ 
  question: 'text', 
  answer: 'text', 
  keywords: 'text' 
})

// Index for category and language filtering
faqSchema.index({ category: 1, language: 1, isActive: 1 })

//  Prevent OverwriteModelError
export default mongoose.models.FAQ || mongoose.model('FAQ', faqSchema)
