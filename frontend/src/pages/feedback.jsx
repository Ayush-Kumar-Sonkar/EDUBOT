import React, { useState, useEffect } from 'react'
import { MessageSquare, Star, Send, Filter, Eye } from 'lucide-react'
import { useAuth } from '../contexts/authcontext'
import { chatAPI } from '../services/api'
import toast from 'react-hot-toast'

const Feedback = () => {
  const { isAuthenticated, user } = useAuth()
  const [activeTab, setActiveTab] = useState('submit')
  const [feedbackForm, setFeedbackForm] = useState({
    category: 'general_feedback',
    title: '',
    description: '',
    rating: 5,
    isAnonymous: false
  })
  const [myFeedback, setMyFeedback] = useState([])
  const [allFeedback, setAllFeedback] = useState([])
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all'
  })

  const categories = [
    { value: 'bug_report', label: '🐛 Bug Report' },
    { value: 'feature_request', label: '✨ Feature Request' },
    { value: 'general_feedback', label: '💬 General Feedback' },
    { value: 'complaint', label: '⚠️ Complaint' },
    { value: 'suggestion', label: '💡 Suggestion' }
  ]

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-600' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-600' },
    { value: 'high', label: 'High', color: 'bg-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-600' }
  ]

  const statuses = [
    { value: 'open', label: 'Open', color: 'bg-blue-600' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-600' },
    { value: 'resolved', label: 'Resolved', color: 'bg-green-600' },
    { value: 'closed', label: 'Closed', color: 'bg-gray-600' }
  ]

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'my-feedback') {
        fetchMyFeedback()
      } else if (activeTab === 'all-feedback') {
        fetchAllFeedback()
      }
    }
  }, [isAuthenticated, activeTab, filters])

  const fetchMyFeedback = async () => {
    setIsLoading(true)
    try {
      const response = await chatAPI.get('/feedback/my-feedback')
      setMyFeedback(response.data.feedbacks)
    } catch (error) {
      console.error('Error fetching my feedback:', error)
      toast.error('Failed to load your feedback')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllFeedback = async () => {
    setIsLoading(true)
    try {
      const params = {
        ...filters,
        ...(filters.status === 'all' && { status: undefined }),
        ...(filters.category === 'all' && { category: undefined }),
        ...(filters.priority === 'all' && { priority: undefined })
      }
      
      const response = await chatAPI.get('/feedback/all', { params })
      setAllFeedback(response.data.feedbacks)
    } catch (error) {
      console.error('Error fetching all feedback:', error)
      toast.error('Failed to load feedback')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitFeedback = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await chatAPI.post('/feedback/submit', feedbackForm)
      
      if (response.data.success) {
        toast.success('Feedback submitted successfully!')
        setFeedbackForm({
          category: 'general_feedback',
          title: '',
          description: '',
          rating: 5,
          isAnonymous: false
        })
        setActiveTab('my-feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error(error.response?.data?.error || 'Failed to submit feedback')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-400'
            } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
            onClick={interactive ? () => onChange(star) : undefined}
          />
        ))}
      </div>
    )
  }

  const getStatusColor = (status) => {
    const statusObj = statuses.find(s => s.value === status)
    return statusObj?.color || 'bg-gray-600'
  }

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority)
    return priorityObj?.color || 'bg-gray-600'
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Please log in to submit feedback.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">📝 Feedback</h1>
        <p className="text-gray-400">Share your thoughts and help us improve EduBot</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'submit', label: 'Submit Feedback' },
          { id: 'my-feedback', label: 'My Feedback' },
          { id: 'all-feedback', label: 'All Feedback' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Submit Feedback Tab */}
      {activeTab === 'submit' && (
        <div className="card max-w-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Submit New Feedback</h2>
          
          <form onSubmit={handleSubmitFeedback} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Category</label>
                <select
                  value={feedbackForm.category}
                  onChange={(e) => setFeedbackForm({...feedbackForm, category: e.target.value})}
                  className="input-field w-full"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Rating</label>
                {renderStars(feedbackForm.rating, true, (rating) => 
                  setFeedbackForm({...feedbackForm, rating})
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={feedbackForm.title}
                onChange={(e) => setFeedbackForm({...feedbackForm, title: e.target.value})}
                placeholder="Brief summary of your feedback"
                className="input-field w-full"
                required
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Description</label>
              <textarea
                value={feedbackForm.description}
                onChange={(e) => setFeedbackForm({...feedbackForm, description: e.target.value})}
                placeholder="Detailed description of your feedback..."
                className="input-field w-full h-32 resize-none"
                required
                maxLength={2000}
              />
              <p className="text-xs text-gray-400 mt-1">
                {feedbackForm.description.length}/2000 characters
              </p>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={feedbackForm.isAnonymous}
                  onChange={(e) => setFeedbackForm({...feedbackForm, isAnonymous: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm text-gray-300">Submit anonymously</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* My Feedback Tab */}
      {activeTab === 'my-feedback' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading your feedback...</p>
            </div>
          ) : myFeedback.length === 0 ? (
            <div className="card text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Feedback Yet</h3>
              <p className="text-gray-400">You haven't submitted any feedback yet.</p>
            </div>
          ) : (
            myFeedback.map(feedback => (
              <div key={feedback._id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">{feedback.title}</h3>
                    <p className="text-gray-300 text-sm mb-3">{feedback.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`px-2 py-1 rounded text-white ${getStatusColor(feedback.status)}`}>
                        {feedback.status.replace('_', ' ')}
                      </span>
                      <span className="text-gray-400">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                </div>
                
                {feedback.adminResponse && (
                  <div className="mt-4 p-4 bg-dark-700 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Admin Response:</h4>
                    <p className="text-gray-300 text-sm">{feedback.adminResponse.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Responded by {feedback.adminResponse.respondedBy} on{' '}
                      {new Date(feedback.adminResponse.respondedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* All Feedback Tab */}
      {activeTab === 'all-feedback' && (
        <div>
          {/* Filters */}
          <div className="card mb-6">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="input-field"
              >
                <option value="all">All Status</option>
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
              
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="input-field"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              
              <select
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
                className="input-field"
              >
                <option value="all">All Priorities</option>
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>{priority.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Feedback List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading feedback...</p>
              </div>
            ) : allFeedback.length === 0 ? (
              <div className="card text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Feedback Found</h3>
                <p className="text-gray-400">No feedback matches your current filters.</p>
              </div>
            ) : (
              allFeedback.map(feedback => (
                <div key={feedback._id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-white">{feedback.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs text-white ${getPriorityColor(feedback.priority)}`}>
                          {feedback.priority}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">{feedback.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-2 py-1 rounded text-white ${getStatusColor(feedback.status)}`}>
                          {feedback.status.replace('_', ' ')}
                        </span>
                        
                        {!feedback.isAnonymous && feedback.user && (
                          <span className="text-gray-400">
                            {feedback.user.name} ({feedback.user.rollNumber})
                          </span>
                        )}
                        
                        <span className="text-gray-400">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                        
                        {renderStars(feedback.rating)}
                      </div>
                    </div>
                  </div>
                  
                  {feedback.adminResponse && (
                    <div className="mt-4 p-4 bg-dark-700 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Admin Response:</h4>
                      <p className="text-gray-300 text-sm">{feedback.adminResponse.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Responded by {feedback.adminResponse.respondedBy} on{' '}
                        {new Date(feedback.adminResponse.respondedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Feedback