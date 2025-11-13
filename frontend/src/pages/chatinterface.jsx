import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, FileText } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useSocket } from '../contexts/SocketContext'
import { useChat } from '../hooks/usechat'
import SpeechToText from '../components/speechtotext'

const ChatInterface = () => {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef(null)

  const { translate, getCurrentLanguage } = useLanguage()
  const { socket, isConnected } = useSocket()
  const { messages, sendMessage, isLoading } = useChat()
  const currentLang = getCurrentLanguage() || { code: 'en', fontClass: '' }

  // Scroll to bottom on new messages
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => { scrollToBottom() }, [messages])

  // Handle bot typing events
  useEffect(() => {
    if (!socket) return
    socket.on('bot_typing', () => setIsTyping(true))
    socket.on('bot_stop_typing', () => setIsTyping(false))
    return () => {
      socket.off('bot_typing')
      socket.off('bot_stop_typing')
    }
  }, [socket])

  // Submit text message
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return
    await sendMessage(message)
    setMessage('')
  }

  // Handle speech transcript from SpeechToText
  const handleSpeechTranscript = async (transcript) => {
    if (!transcript) return
    setMessage(transcript)
    setIsProcessing(true) // optional: indicate sending
    await sendMessage(transcript)
    setMessage('')
    setIsProcessing(false)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-dark-800 border-b border-dark-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  {translate('chat.title')}
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-400">
                    {translate('chat.subtitle')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="chat-message bot">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className={`flex-1 ${currentLang.fontClass}`}>
                  <p className="mb-4">{translate('chat.greeting')}</p>
                  <ul className="space-y-2 mb-4">
                    <li>{translate('chat.features.admissions')}</li>
                    <li>{translate('chat.features.academic')}</li>
                    <li>{translate('chat.features.campus')}</li>
                    <li>{translate('chat.features.financial')}</li>
                    <li>{translate('chat.features.technical')}</li>
                  </ul>
                  <p className="text-sm text-gray-400">{translate('chat.features.footer')}</p>
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}>
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'user' ? 'bg-primary-600' : 'bg-gray-600'
                }`}>
                  {msg.sender === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                </div>
                <div className={`flex-1 ${currentLang.fontClass}`}>
                  <p>{msg.text}</p>
                  {msg.sourceType === 'document' && (
                    <div className="mt-2 p-2 bg-dark-700 rounded text-xs">
                      <div className="flex items-center space-x-1 text-blue-400">
                        <FileText className="w-3 h-3" />
                        <span>Source: Document</span>
                      </div>
                    </div>
                  )}
                  <span className="text-xs text-gray-400 mt-1 block">
                    {msg.timestamp}
                    {msg.confidence && (
                      <span className="ml-2">• {Math.round(msg.confidence * 100)}% confidence</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-message bot">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 block">Bot is typing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-dark-800 border-t border-dark-700 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-4 items-center">
            <SpeechToText 
              onTranscript={handleSpeechTranscript}
              language={currentLang.code}
              setIsRecording={setIsRecording}      // track recording state
              setIsProcessing={setIsProcessing}    // track processing state
            />

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={translate('chat.placeholder')}
              className={`flex-1 input-field ${currentLang.fontClass}`}
              disabled={isLoading || !isConnected || isRecording || isProcessing}
            />

            <button
              type="submit"
              disabled={isLoading || !message.trim() || !isConnected || isRecording || isProcessing}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              <span className="ml-2">{translate('chat.send')}</span>
            </button>

            {(isRecording || isProcessing) && (
              <span className="ml-2 text-sm text-gray-300">
                {isRecording ? 'Recording...' : 'Processing...'}
              </span>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
