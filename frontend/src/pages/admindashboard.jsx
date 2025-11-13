import React, { useState, useEffect } from 'react'
import { Plus, CreditCard as Edit, Trash2, Search, ListFilter as Filter, Upload, FileText, Eye, Download } from 'lucide-react'
import { useAdmin } from '../hooks/useAdmin'
import { chatAPI } from '../services/api'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('faqs')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [documents, setDocuments] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const { faqs, isLoading, fetchFaqs, addFaq, updateFaq, deleteFaq } = useAdmin()

  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
    category: 'admissions',
    language: 'en',
    keywords: ''
  })

  const [newDocument, setNewDocument] = useState({
    title: '',
    category: 'general',
    language: 'en',
    file: null
  })

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'admissions', label: '📋 Admissions' },
    { value: 'academic', label: '🎓 Academic' },
    { value: 'campus', label: '🏫 Campus' },
    { value: 'financial', label: '💰 Financial' },
    { value: 'technical', label: '💻 Technical' }
  ]

  const languages = [
    { value: 'all', label: 'All Languages' },
    { value: 'en', label: '🇺🇸 English' },
    { value: 'hi', label: '🇮🇳 Hindi' },
    { value: 'bn', label: '🇧🇩 Bengali' },
    { value: 'ta', label: '🇮🇳 Tamil' },
    { value: 'te', label: '🇮🇳 Telugu' },
    { value: 'mwr', label: '🇮🇳 Marwari' },
  ]

  useEffect(() => {
    fetchFaqs()
    if (activeTab === 'documents') {
      fetchDocuments()
    }
  }, [activeTab])

  const fetchDocuments = async () => {
    try {
      const response = await chatAPI.get('/documents')
      setDocuments(response.data)
    } catch (error) {
      console.error('Error fetching documents:', error)
      toast.error('Failed to fetch documents')
    }
  }

  const handleAddFaq = async (e) => {
    e.preventDefault()
    try {
      const faqData = {
        ...newFaq,
        keywords: newFaq.keywords.split(',').map(k => k.trim()).filter(k => k)
      }
      await addFaq(faqData)
      setNewFaq({ question: '', answer: '', category: 'admissions', language: 'en', keywords: '' })
      setShowAddModal(false)
      toast.success('FAQ added successfully!')
    } catch (error) {
      toast.error('Failed to add FAQ')
    }
  }

  const handleEditFaq = async (e) => {
    e.preventDefault()
    try {
      const faqData = {
        ...editingFaq,
        keywords: editingFaq.keywords.split(',').map(k => k.trim()).filter(k => k)
      }
      await updateFaq(editingFaq._id, faqData)
      setEditingFaq(null)
      toast.success('FAQ updated successfully!')
    } catch (error) {
      toast.error('Failed to update FAQ')
    }
  }

  const handleDeleteFaq = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await deleteFaq(id)
        toast.success('FAQ deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete FAQ')
      }
    }
  }

  const handleDocumentUpload = async (e) => {
    e.preventDefault()
    if (!newDocument.file || !newDocument.title) {
      toast.error('Please select a file and enter a title')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('document', newDocument.file)
      formData.append('title', newDocument.title)
      formData.append('category', newDocument.category)
      formData.append('language', newDocument.language)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await chatAPI.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.data.success) {
        toast.success('Document uploaded and processed successfully!')
        setNewDocument({ title: '', category: 'general', language: 'en', file: null })
        fetchDocuments()
        
        // Reset file input
        const fileInput = document.getElementById('document-file')
        if (fileInput) fileInput.value = ''
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.error || 'Failed to upload document')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDeleteDocument = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await chatAPI.delete(`/documents/${id}`)
        toast.success('Document deleted successfully!')
        fetchDocuments()
      } catch (error) {
        toast.error('Failed to delete document')
      }
    }
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesLanguage = selectedLanguage === 'all' || faq.language === selectedLanguage
    return matchesSearch && matchesCategory && matchesLanguage
  })

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    const matchesLanguage = selectedLanguage === 'all' || doc.language === selectedLanguage
    return matchesSearch && matchesCategory && matchesLanguage
  })

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">⚙️ Admin Dashboard</h1>
        <p className="text-gray-400">Manage FAQs, documents, and system content</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'faqs', label: 'FAQ Management', icon: '❓' },
          { id: 'documents', label: 'Document Management', icon: '📄' },
          { id: 'analytics', label: 'Quick Analytics', icon: '📊' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* FAQ Management Tab */}
      {activeTab === 'faqs' && (
        <div>
          {/* Controls */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="input-field"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ</span>
              </button>
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading FAQs...</p>
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="card text-center py-12">
                <h3 className="text-lg font-medium text-white mb-2">No FAQs Found</h3>
                <p className="text-gray-400">No FAQs match your current filters.</p>
              </div>
            ) : (
              filteredFaqs.map(faq => (
                <div key={faq._id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded">
                          {faq.category}
                        </span>
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                          {faq.language.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                      <p className="text-gray-300 text-sm mb-3">{faq.answer}</p>
                      {faq.keywords && faq.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {faq.keywords.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-dark-600 text-gray-300 text-xs rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setEditingFaq({...faq, keywords: faq.keywords?.join(', ') || ''})}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq._id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Document Management Tab */}
      {activeTab === 'documents' && (
        <div>
          {/* Document Upload */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload PDF Document
            </h2>
            
            <form onSubmit={handleDocumentUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Document Title *</label>
                  <input
                    type="text"
                    value={newDocument.title}
                    onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                    placeholder="e.g., Admission Guidelines 2024"
                    className="input-field w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Category</label>
                  <select
                    value={newDocument.category}
                    onChange={(e) => setNewDocument({...newDocument, category: e.target.value})}
                    className="input-field w-full"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Language</label>
                  <select
                    value={newDocument.language}
                    onChange={(e) => setNewDocument({...newDocument, language: e.target.value})}
                    className="input-field w-full"
                  >
                    {languages.slice(1).map(lang => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">PDF File *</label>
                <input
                  id="document-file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setNewDocument({...newDocument, file: e.target.files[0]})}
                  className="input-field w-full"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Maximum file size: 10MB</p>
              </div>
              
              {isUploading && (
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isUploading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Uploading... {uploadProgress}%
                  </div>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Document List */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Uploaded Documents ({documents.length})
              </h2>
              
              <div className="flex space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Documents</h3>
                  <p className="text-gray-400">Upload your first PDF document to get started.</p>
                </div>
              ) : (
                filteredDocuments.map(doc => (
                  <div key={doc._id} className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{doc.title}</h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-400">
                          <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded">
                            {doc.category}
                          </span>
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                            {doc.language.toUpperCase()}
                          </span>
                          <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                          <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteDocument(doc._id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card text-center">
            <h3 className="text-lg font-medium text-white mb-2">Total FAQs</h3>
            <p className="text-3xl font-bold text-primary-400">{faqs.length}</p>
          </div>
          <div className="card text-center">
            <h3 className="text-lg font-medium text-white mb-2">Documents</h3>
            <p className="text-3xl font-bold text-blue-400">{documents.length}</p>
          </div>
          <div className="card text-center">
            <h3 className="text-lg font-medium text-white mb-2">Categories</h3>
            <p className="text-3xl font-bold text-green-400">{categories.length - 1}</p>
          </div>
          <div className="card text-center">
            <h3 className="text-lg font-medium text-white mb-2">Languages</h3>
            <p className="text-3xl font-bold text-yellow-400">{languages.length - 1}</p>
          </div>
        </div>
      )}

      {/* Add FAQ Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-800 rounded-lg p-6 w-full max-w-2xl mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">Add New FAQ</h2>
            
            <form onSubmit={handleAddFaq} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Category</label>
                  <select
                    value={newFaq.category}
                    onChange={(e) => setNewFaq({...newFaq, category: e.target.value})}
                    className="input-field w-full"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Language</label>
                  <select
                    value={newFaq.language}
                    onChange={(e) => setNewFaq({...newFaq, language: e.target.value})}
                    className="input-field w-full"
                  >
                    {languages.slice(1).map(lang => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Question</label>
                <input
                  type="text"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                  className="input-field w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Answer</label>
                <textarea
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                  className="input-field w-full h-24 resize-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={newFaq.keywords}
                  onChange={(e) => setNewFaq({...newFaq, keywords: e.target.value})}
                  placeholder="admission, requirements, eligibility"
                  className="input-field w-full"
                />
              </div>
              
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">Add FAQ</button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit FAQ Modal */}
      {editingFaq && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-800 rounded-lg p-6 w-full max-w-2xl mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">Edit FAQ</h2>
            
            <form onSubmit={handleEditFaq} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Category</label>
                  <select
                    value={editingFaq.category}
                    onChange={(e) => setEditingFaq({...editingFaq, category: e.target.value})}
                    className="input-field w-full"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Language</label>
                  <select
                    value={editingFaq.language}
                    onChange={(e) => setEditingFaq({...editingFaq, language: e.target.value})}
                    className="input-field w-full"
                  >
                    {languages.slice(1).map(lang => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Question</label>
                <input
                  type="text"
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({...editingFaq, question: e.target.value})}
                  className="input-field w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Answer</label>
                <textarea
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({...editingFaq, answer: e.target.value})}
                  className="input-field w-full h-24 resize-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={editingFaq.keywords}
                  onChange={(e) => setEditingFaq({...editingFaq, keywords: e.target.value})}
                  placeholder="admission, requirements, eligibility"
                  className="input-field w-full"
                />
              </div>
              
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">Update FAQ</button>
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard