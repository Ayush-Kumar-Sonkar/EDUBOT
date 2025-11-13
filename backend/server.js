import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import chatRoutes from './routes/chat.js'
import adminRoutes from './routes/admin.js'
import analyticsRoutes from './routes/analytics.js'
import webhookRoutes from './routes/webhooks.js'
import authRoutes from './routes/auth.js'
import feedbackRoutes from './routes/feedback.js'
import chatHistoryRoutes from './routes/chathistory.js'
import documentsRoutes from './routes/document.js'
import speechToTextRoutes from './routes/speech.js'
import { initializeSocket } from './services/socketservice.js'
import { populateSampleData } from './utils/sampleData.js'
import { initializeNLP } from './services/nlpservice.js'
import { testTranslation } from './services/translationservice.js'

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path}`, req.body ? Object.keys(req.body) : 'no body')
  console.log(`📍 Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`)
  next()
})

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edubot', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(' Connected to MongoDB')
  return populateSampleData()
})
.then(() => {
  console.log(' Sample data initialization completed')
  return initializeNLP()
})
.then(() => {
  console.log(' NLP service initialized')
  return testTranslation()
})
.then((translationWorking) => {
  if (translationWorking) {
    console.log(' Google Translate API is working')
  } else {
    console.log('⚠️ Google Translate API test failed - translations may not work')
  }
})
.catch(err => {
  console.error('❌ Database connection or initialization error:', err)
})

// Initialize Socket.IO
initializeSocket(io)

// Routes
app.use('/api/chat', chatRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/webhooks', webhookRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/chat-history', chatHistoryRoutes)
app.use('/api/documents', documentsRoutes)
app.use('/api/speech-to-text', speechToTextRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'EduBot Backend'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`🚀 EduBot server running on port ${PORT}`)
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
})

export { io }