import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('edubot-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    if (error.response?.status === 401) {
      localStorage.removeItem('edubot-token')
      // Don't redirect if already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Chat API
export const chatAPI = {
  sendMessage: (data) => api.post('/chat/message', data),
  getConversationHistory: (conversationId) => api.get(`/chat/conversation/${conversationId}`),
  
  // Auth endpoints
  post: (url, data) => api.post(url, data),
  get: (url, config) => api.get(url, config),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url)
}

// In your existing api.js

// Speech-to-Text API
export const speechAPI = {
  transcribeAudio: (audioFormData) =>
    api.post('/speech-to-text', audioFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};


// Admin API
export const adminAPI = {
  getFaqs: () => api.get('/admin/faqs'),
  createFaq: (data) => api.post('/admin/faqs', data),
  updateFaq: (id, data) => api.put(`/admin/faqs/${id}`, data),
  deleteFaq: (id) => api.delete(`/admin/faqs/${id}`),
  getConversations: () => api.get('/admin/conversations'),
  getConversation: (id) => api.get(`/admin/conversations/${id}`)
}

// Analytics API
export const analyticsAPI = {
  getAnalytics: () => api.get('/analytics/overview'),
  getLanguageStats: () => api.get('/analytics/languages'),
  getCategoryStats: () => api.get('/analytics/categories'),
  getActivityLog: () => api.get('/analytics/activity')
}

// Webhook API
export const webhookAPI = {
  whatsapp: (data) => api.post('/webhooks/whatsapp', data),
  telegram: (data) => api.post('/webhooks/telegram', data),
}

export default api