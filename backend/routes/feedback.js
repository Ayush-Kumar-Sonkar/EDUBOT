import express from 'express'
import Feedback from '../models/feedback.js'
import User from '../models/user.js'
import { authenticateToken } from './auth.js'

const router = express.Router()

// Submit feedback
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { category, title, description, rating, conversationId, isAnonymous } = req.body

    if (!category || !title || !description || !rating) {
      return res.status(400).json({ 
        error: 'Category, title, description, and rating are required' 
      })
    }

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const feedback = new Feedback({
      user: user._id,
      rollNumber: user.rollNumber,
      category,
      title,
      description,
      rating,
      conversationId,
      isAnonymous: isAnonymous || false
    })

    await feedback.save()

    // Populate user details for response
    await feedback.populate('user', 'name rollNumber department year')

    console.log(`📝 New feedback submitted by ${user.rollNumber}: ${title}`)

    res.status(201).json({
      success: true,
      feedback: {
        id: feedback._id,
        category: feedback.category,
        title: feedback.title,
        description: feedback.description,
        rating: feedback.rating,
        status: feedback.status,
        createdAt: feedback.createdAt,
        user: isAnonymous ? null : {
          name: user.name,
          rollNumber: user.rollNumber,
          department: user.department,
          year: user.year
        }
      }
    })

  } catch (error) {
    console.error('Submit feedback error:', error)
    res.status(500).json({ error: 'Failed to submit feedback' })
  }
})

// Get user's feedback history
router.get('/my-feedback', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query
    
    let query = { user: req.user.userId }
    if (status) query.status = status
    if (category) query.category = category

    const feedbacks = await Feedback.find(query)
      .populate('user', 'name rollNumber department year')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Feedback.countDocuments(query)

    res.json({
      feedbacks,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    })

  } catch (error) {
    console.error('Get user feedback error:', error)
    res.status(500).json({ error: 'Failed to get feedback' })
  }
})

// Get all feedback (Admin only)
router.get('/all', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      category, 
      priority,
      department,
      search 
    } = req.query

    let query = {}
    if (status) query.status = status
    if (category) query.category = category
    if (priority) query.priority = priority

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ]
    }

    let feedbackQuery = Feedback.find(query)
      .populate('user', 'name rollNumber department year email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    // Filter by department if specified
    if (department) {
      feedbackQuery = feedbackQuery.populate({
        path: 'user',
        match: { department: department }
      })
    }

    const feedbacks = await feedbackQuery

    // Filter out null users (when department filter doesn't match)
    const filteredFeedbacks = feedbacks.filter(f => f.user !== null)

    const total = await Feedback.countDocuments(query)

    // Get statistics
    const stats = await Feedback.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalFeedback: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          statusBreakdown: {
            $push: '$status'
          },
          categoryBreakdown: {
            $push: '$category'
          },
          priorityBreakdown: {
            $push: '$priority'
          }
        }
      }
    ])

    res.json({
      feedbacks: filteredFeedbacks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      },
      statistics: stats[0] || {
        totalFeedback: 0,
        averageRating: 0,
        statusBreakdown: [],
        categoryBreakdown: [],
        priorityBreakdown: []
      }
    })

  } catch (error) {
    console.error('Get all feedback error:', error)
    res.status(500).json({ error: 'Failed to get feedback' })
  }
})

// Update feedback status (Admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status, priority, assignedTo, adminResponse } = req.body

    const updateData = {}
    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    if (assignedTo) updateData.assignedTo = assignedTo
    if (adminResponse) {
      updateData.adminResponse = {
        ...adminResponse,
        respondedAt: new Date()
      }
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name rollNumber department year email')

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' })
    }

    console.log(`📋 Feedback ${id} updated: status=${status}, priority=${priority}`)

    res.json({
      success: true,
      feedback
    })

  } catch (error) {
    console.error('Update feedback status error:', error)
    res.status(500).json({ error: 'Failed to update feedback' })
  }
})

// Get feedback statistics
router.get('/statistics', async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query
    
    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (timeframe) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    const stats = await Feedback.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $facet: {
          overview: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                averageRating: { $avg: '$rating' },
                resolved: {
                  $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
                }
              }
            }
          ],
          byCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          byRating: [
            { $group: { _id: '$rating', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
          ],
          timeline: [
            {
              $group: {
                _id: {
                  $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ])

    res.json(stats[0])

  } catch (error) {
    console.error('Get feedback statistics error:', error)
    res.status(500).json({ error: 'Failed to get statistics' })
  }
})

export default router