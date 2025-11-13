import { processMessage } from './chatservice.js'

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    // Handle user messages
    socket.on('user_message', async (data) => {
      try {
        const { message, language, sessionId } = data
        
        // Emit typing indicator
        socket.emit('bot_typing')
        
        // Process the message
        const response = await processMessage({
          message,
          language: language || 'en',
          sessionId: sessionId || `web_${socket.id}`,
          platform: 'web',
          metadata: {
            socketId: socket.id,
            userAgent: socket.handshake.headers['user-agent'],
            ipAddress: socket.handshake.address
          }
        })

        // Simulate processing delay for better UX
        setTimeout(() => {
          socket.emit('bot_stop_typing')
          socket.emit('bot_response', {
            message: response.message,
            confidence: response.confidence,
            timestamp: response.timestamp,
            language: language
          })
        }, 1000 + Math.random() * 2000) // 1-3 second delay

      } catch (error) {
        console.error('Socket message processing error:', error)
        socket.emit('bot_stop_typing')
        socket.emit('bot_response', {
          message: 'I apologize, but I encountered an error processing your message. Please try again.',
          confidence: 0,
          timestamp: new Date().toISOString(),
          language: data.language || 'en'
        })
      }
    })

    // Handle typing indicators
    socket.on('user_typing', () => {
      socket.broadcast.emit('user_typing', { socketId: socket.id })
    })

    socket.on('user_stop_typing', () => {
      socket.broadcast.emit('user_stop_typing', { socketId: socket.id })
    })

    // Handle language change
    socket.on('language_changed', (data) => {
      socket.emit('language_confirmed', {
        language: data.language,
        message: `Language changed to ${data.language}`
      })
    })

    // Handle conversation history request
    socket.on('get_conversation_history', async (data) => {
      try {
        const { sessionId } = data
        // Implementation would fetch conversation history
        socket.emit('conversation_history', {
          sessionId,
          messages: [] // Placeholder
        })
      } catch (error) {
        console.error('Get conversation history error:', error)
        socket.emit('error', { message: 'Failed to get conversation history' })
      }
    })

    // Handle admin events
    socket.on('join_admin', () => {
      socket.join('admin')
      console.log('Admin user joined:', socket.id)
    })

    socket.on('leave_admin', () => {
      socket.leave('admin')
      console.log('Admin user left:', socket.id)
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  })

  // Broadcast system messages to admin users
  const broadcastToAdmin = (event, data) => {
    io.to('admin').emit(event, data)
  }

  // Export admin broadcast function
  io.broadcastToAdmin = broadcastToAdmin

  return io
}

// Helper function to emit real-time updates
export const emitRealTimeUpdate = (io, event, data) => {
  io.emit(event, data)
}

// Helper function to emit to specific room
export const emitToRoom = (io, room, event, data) => {
  io.to(room).emit(event, data)
}