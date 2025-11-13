import React, { useState, useEffect } from 'react'
import { MessageCircle, Calendar, Search, Bookmark, Archive, Trash2, Eye } from 'lucide-react'
import { useAuth } from '../contexts/authcontext'
import { chatAPI } from '../services/api'
import toast from 'react-hot-toast'

const ChatHistory = () => {
  const { isAuthenticated } = useAuth()
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 })

  useEffect(() => {
    if (isAuthenticated) {
      fetchChatHistory()
    }
  }, [isAuthenticated, searchTerm, statusFilter])

  const fetchChatHistory = async (page = 1) => {
    setIsLoading(true)
    try {
      const params = {
        page,
        limit: 10,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      }

      const response = await chatAPI.get('/chat-history/my-chats', { params })
      setChats(response.data.chats)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching chat history:', error)
      toast.error('Failed to load chat history')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchChatDetails = async (chatId) => {
    try {
      const response = await chatAPI.get(`/chat-history/chat/${chatId}`)
      setSelectedChat(response.data)
    } catch (error) {
      console.error('Error fetching chat details:', error)
      toast.error('Failed to load chat details')
    }
  }

  const updateChat = async (chatId, updates) => {
    try {
      await chatAPI.put(`/chat-history/chat/${chatId}`, updates)
      
      // Update local state
      setChats(prev => prev.map(chat => 
        chat._id === chatId ? { ...chat, ...updates } : chat
      ))
      
      if (selectedChat && selectedChat._id === chatId) {
        setSelectedChat(prev => ({ ...prev, ...updates }))
      }
      
      toast.success('Chat updated successfully')
    } catch (error) {
      console.error('Error updating chat:', error)
      toast.error('Failed to update chat')
    }
  }

  const deleteChat = async (chatId) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return

    try {
      await chatAPI.delete(`/chat-history/chat/${chatId}`)
      setChats(prev => prev.filter(chat => chat._id !== chatId))
      if (selectedChat && selectedChat._id === chatId) {
        setSelectedChat(null)
      }
      toast.success('Chat deleted successfully')
    } catch (error) {
      console.error('Error deleting chat:', error)
      toast.error('Failed to delete chat')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Please log in to view your chat history.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">💬 Chat History</h1>
        <p className="text-gray-400">View and manage your conversation history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="mb-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-full"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field w-full"
              >
                <option value="all">All Chats</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading chats...</p>
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No chats found</p>
                </div>
              ) : (
                chats.map(chat => (
                  <div
                    key={chat._id}
                    onClick={() => fetchChatDetails(chat._id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat?._id === chat._id 
                        ? 'bg-primary-600' 
                        : 'bg-dark-700 hover:bg-dark-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-white text-sm truncate">
                        {chat.title}
                      </h3>
                      {chat.isBookmarked && (
                        <Bookmark className="w-4 h-4 text-yellow-400 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{formatDate(chat.lastActivity)}</span>
                      <span>{chat.summary?.totalMessages || 0} messages</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        chat.platform === 'web' ? 'bg-blue-600' :
                        chat.platform === 'whatsapp' ? 'bg-green-600' :
                        chat.platform === 'telegram' ? 'bg-blue-500' :
                        'bg-purple-600'
                      }`}>
                        {chat.platform}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-dark-600">
                <button
                  onClick={() => fetchChatHistory(pagination.current - 1)}
                  disabled={pagination.current === 1}
                  className="btn-secondary text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-400">
                  Page {pagination.current} of {pagination.pages}
                </span>
                <button
                  onClick={() => fetchChatHistory(pagination.current + 1)}
                  disabled={pagination.current === pagination.pages}
                  className="btn-secondary text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Details */}
        <div className="lg:col-span-2">
          {selectedChat ? (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">{selectedChat.title}</h2>
                  <p className="text-gray-400 text-sm">
                    {formatDate(selectedChat.createdAt)} • {selectedChat.summary?.totalMessages || 0} messages
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateChat(selectedChat._id, { 
                      isBookmarked: !selectedChat.isBookmarked 
                    })}
                    className={`p-2 rounded ${
                      selectedChat.isBookmarked 
                        ? 'bg-yellow-600 text-white' 
                        : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateChat(selectedChat._id, { 
                      status: selectedChat.status === 'archived' ? 'active' : 'archived' 
                    })}
                    className="p-2 bg-dark-700 text-gray-400 hover:bg-dark-600 rounded"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteChat(selectedChat._id)}
                    className="p-2 bg-red-600 text-white hover:bg-red-700 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedChat.messages?.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-dark-700 text-gray-100'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                        {message.confidence && (
                          <span className="ml-2">
                            ({Math.round(message.confidence * 100)}% confidence)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Summary */}
              {selectedChat.summary && (
                <div className="mt-6 pt-6 border-t border-dark-600">
                  <h3 className="text-lg font-medium text-white mb-4">Chat Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-3 bg-dark-700 rounded">
                      <p className="text-2xl font-bold text-primary-400">
                        {selectedChat.summary.totalMessages}
                      </p>
                      <p className="text-gray-400">Total Messages</p>
                    </div>
                    <div className="text-center p-3 bg-dark-700 rounded">
                      <p className="text-2xl font-bold text-blue-400">
                        {selectedChat.summary.userMessages}
                      </p>
                      <p className="text-gray-400">Your Messages</p>
                    </div>
                    <div className="text-center p-3 bg-dark-700 rounded">
                      <p className="text-2xl font-bold text-green-400">
                        {selectedChat.summary.botMessages}
                      </p>
                      <p className="text-gray-400">Bot Responses</p>
                    </div>
                    <div className="text-center p-3 bg-dark-700 rounded">
                      <p className="text-2xl font-bold text-yellow-400">
                        {selectedChat.summary.categoriesDiscussed?.length || 0}
                      </p>
                      <p className="text-gray-400">Topics</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card text-center py-12">
              <Eye className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Select a Chat</h3>
              <p className="text-gray-400">Choose a conversation from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatHistory