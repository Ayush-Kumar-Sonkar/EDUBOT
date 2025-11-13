import { useState, useEffect } from 'react'
import { useSocket } from '../contexts/SocketContext'
import { useLanguage } from '../contexts/LanguageContext'
import { chatAPI } from '../services/api'

export const useChat = () => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { socket } = useSocket()
  const { currentLanguage } = useLanguage()

  useEffect(() => {
    if (socket) {
      socket.on('bot_response', (data) => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: data.message,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString(),
          language: data.language
        }])
        setIsLoading(false)
      })

      return () => {
        socket.off('bot_response')
      }
    }
  }, [socket])

  const sendMessage = async (text) => {
    if (!text.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      language: currentLanguage
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Send message via Socket.IO
      if (socket) {
        socket.emit('user_message', {
          message: text,
          language: currentLanguage,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setIsLoading(false)
    }
  }

  return {
    messages,
    sendMessage,
    isLoading
  }
}