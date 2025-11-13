import express from 'express'
import FAQ from '../models/faq.js'
import Conversation from '../models/conversation.js'

const router = express.Router()

// FAQ Management
router.get('/faqs', async (req, res) => {
  try {
    const { category, language, search } = req.query
    let query = { isActive: true }

    if (category && category !== 'all') {
      query.category = category
    }

    if (language) {
      query.language = language
    }

    let faqs = await FAQ.find(query).sort({ createdAt: -1 })

    if (search) {
      faqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase())
      )
    }

    res.json(faqs)
  } catch (error) {
    console.error('Get FAQs error:', error)
    res.status(500).json({ error: 'Failed to get FAQs' })
  }
})

router.post('/faqs', async (req, res) => {
  try {
    const { question, answer, category, language = 'en', keywords } = req.body

    if (!question || !answer || !category) {
      return res.status(400).json({ error: 'Question, answer, and category are required' })
    }

    const faq = new FAQ({
      question: question.trim(),
      answer: answer.trim(),
      category,
      language,
      keywords: keywords || [],
      createdBy: 'admin' // TODO: Get from auth
    })

    await faq.save()
    res.status(201).json(faq)
  } catch (error) {
    console.error('Create FAQ error:', error)
    res.status(500).json({ error: 'Failed to create FAQ' })
  }
})

router.put('/faqs/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { question, answer, category, language, keywords } = req.body

    const faq = await FAQ.findByIdAndUpdate(
      id,
      {
        question: question?.trim(),
        answer: answer?.trim(),
        category,
        language,
        keywords,
        updatedBy: 'admin' // TODO: Get from auth
      },
      { new: true, runValidators: true }
    )

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' })
    }

    res.json(faq)
  } catch (error) {
    console.error('Update FAQ error:', error)
    res.status(500).json({ error: 'Failed to update FAQ' })
  }
})

router.delete('/faqs/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const faq = await FAQ.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    )

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' })
    }

    res.json({ message: 'FAQ deleted successfully' })
  } catch (error) {
    console.error('Delete FAQ error:', error)
    res.status(500).json({ error: 'Failed to delete FAQ' })
  }
})

// Conversation Management
router.get('/conversations', async (req, res) => {
  try {
    const { platform, language, status, limit = 50 } = req.query
    let query = {}

    if (platform) query.platform = platform
    if (language) query.language = language
    if (status) query.status = status

    const conversations = await Conversation.find(query)
      .sort({ lastActivity: -1 })
      .limit(parseInt(limit))
      .select('sessionId platform language lastMessage lastActivity status createdAt')

    res.json(conversations)
  } catch (error) {
    console.error('Get conversations error:', error)
    res.status(500).json({ error: 'Failed to get conversations' })
  }
})

router.get('/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params
    const conversation = await Conversation.findById(id)

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    res.json(conversation)
  } catch (error) {
    console.error('Get conversation error:', error)
    res.status(500).json({ error: 'Failed to get conversation' })
  }
})

export default router