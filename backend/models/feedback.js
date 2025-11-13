import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rollNumber: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['bug_report', 'feature_request', 'general_feedback', 'complaint', 'suggestion'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: String,
    default: null
  },
  adminResponse: {
    message: String,
    respondedBy: String,
    respondedAt: Date
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  tags: [String],
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Indexes for efficient querying
feedbackSchema.index({ user: 1, createdAt: -1 })
feedbackSchema.index({ status: 1, priority: 1 })
feedbackSchema.index({ category: 1, createdAt: -1 })
feedbackSchema.index({ rollNumber: 1 })

export default mongoose.model('Feedback', feedbackSchema)