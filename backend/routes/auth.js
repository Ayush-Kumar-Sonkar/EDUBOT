import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/user.js'

const router = express.Router()

// Login with roll number
router.post('/login', async (req, res) => {
  try {
    const { rollNumber, name, email, department, year, phoneNumber } = req.body

    console.log('🔐 Login attempt received')
    console.log('📋 Request body:', req.body)
    console.log('🔍 Extracted data:', { rollNumber, name, email, department, year })
    
    if (!rollNumber || !name || !email || !department || !year) {
      console.log('❌ Missing required fields')
      return res.status(400).json({ 
        error: 'Roll number, name, email, department, and year are required' 
      })
    }

    // Find or create user
    let user = await User.findOne({ rollNumber: rollNumber.toUpperCase() })
    
    if (!user) {
      // Create new user
      user = new User({
        rollNumber: rollNumber.toUpperCase(),
        name,
        email: email.toLowerCase(),
        department,
        year,
        phoneNumber
      })
      await user.save()
      console.log(` New user created: ${rollNumber}`)
    } else {
      // Update existing user info
      user.name = name
      user.email = email.toLowerCase()
      user.department = department
      user.year = year
      user.phoneNumber = phoneNumber
      user.lastLogin = new Date()
      await user.save()
      console.log(` User updated: ${rollNumber}`)
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        rollNumber: user.rollNumber,
        email: user.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    console.log(' JWT token generated for user:', user.rollNumber)
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        rollNumber: user.rollNumber,
        name: user.name,
        email: user.email,
        department: user.department,
        year: user.year,
        preferences: user.preferences,
        totalConversations: user.totalConversations,
        totalMessages: user.totalMessages
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-__v')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Failed to get profile' })
  }
})

// Update user preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const { preferences } = req.body
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { preferences },
      { new: true, runValidators: true }
    )

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      success: true,
      preferences: user.preferences
    })

  } catch (error) {
    console.error('Update preferences error:', error)
    res.status(500).json({ error: 'Failed to update preferences' })
  }
})

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

export { authenticateToken }
export default router