import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import pdf from 'pdf-parse'
import Document from '../models/document.js'
import { extractKeywords } from '../services/nlpservice.js'

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/documents'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Only PDF files are allowed'), false)
  }
}

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
})

// Upload PDF document
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const { title, category = 'general', language = 'en' } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    console.log(`📄 Processing PDF upload: ${req.file.originalname}`)

    // Extract text from PDF
    const dataBuffer = fs.readFileSync(req.file.path)
    const pdfData = await pdf(dataBuffer)
    const extractedText = pdfData.text

    console.log(`📝 Extracted ${extractedText.length} characters from PDF`)

    // Extract keywords from the text
    const keywords = extractKeywords(extractedText, 10)

    // Create document record
    const document = new Document({
      title,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      filePath: req.file.path,
      extractedText,
      category,
      language,
      keywords,
      isProcessed: true,
      processingStatus: 'completed'
    })

    await document.save()

    console.log(` Document saved: ${document.title}`)

    res.status(201).json({
      success: true,
      document: {
        id: document._id,
        title: document.title,
        category: document.category,
        language: document.language,
        fileSize: document.fileSize,
        keywords: document.keywords,
        extractedTextLength: extractedText.length,
        createdAt: document.createdAt
      }
    })

  } catch (error) {
    console.error('Document upload error:', error)
    
    // Clean up uploaded file if processing failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    
    res.status(500).json({ error: 'Failed to upload and process document' })
  }
})

// Get all documents
router.get('/', async (req, res) => {
  try {
    const { category, language, search } = req.query
    let query = { isActive: true }

    if (category && category !== 'all') {
      query.category = category
    }

    if (language) {
      query.language = language
    }

    let documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .select('-extractedText -filePath') // Exclude large text field

    if (search) {
      documents = documents.filter(doc => 
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.keywords.some(keyword => 
          keyword.toLowerCase().includes(search.toLowerCase())
        )
      )
    }

    res.json(documents)
  } catch (error) {
    console.error('Get documents error:', error)
    res.status(500).json({ error: 'Failed to get documents' })
  }
})

// Get document by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const document = await Document.findById(id)

    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }

    // Update access count and last accessed
    document.accessCount += 1
    document.lastAccessed = new Date()
    await document.save()

    res.json(document)
  } catch (error) {
    console.error('Get document error:', error)
    res.status(500).json({ error: 'Failed to get document' })
  }
})

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const document = await Document.findById(id)

    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }

    // Delete file from filesystem
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath)
    }

    // Mark as inactive instead of deleting
    document.isActive = false
    await document.save()

    res.json({ success: true, message: 'Document deleted successfully' })
  } catch (error) {
    console.error('Delete document error:', error)
    res.status(500).json({ error: 'Failed to delete document' })
  }
})

// Search in documents
router.post('/search', async (req, res) => {
  try {
    const { query, category, language } = req.body

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' })
    }

    let searchFilter = { 
      isActive: true,
      $text: { $search: query }
    }

    if (category && category !== 'all') {
      searchFilter.category = category
    }

    if (language) {
      searchFilter.language = language
    }

    const documents = await Document.find(searchFilter, {
      score: { $meta: 'textScore' }
    })
    .sort({ score: { $meta: 'textScore' } })
    .limit(10)

    const results = documents.map(doc => ({
      id: doc._id,
      title: doc.title,
      category: doc.category,
      language: doc.language,
      relevanceScore: doc.score,
      extractedText: doc.extractedText.substring(0, 500) + '...',
      keywords: doc.keywords
    }))

    res.json(results)
  } catch (error) {
    console.error('Document search error:', error)
    res.status(500).json({ error: 'Failed to search documents' })
  }
})

export default router