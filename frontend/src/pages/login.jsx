import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { User, Mail, Building, Calendar, Phone, LogIn } from 'lucide-react'
import { useAuth } from '../contexts/authcontext'
import toast from 'react-hot-toast'

const Login = () => {
  const [formData, setFormData] = useState({
    rollNumber: '',
    name: '',
    email: '',
    department: '',
    year: '',
    phoneNumber: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const departments = [
    'Computer Science Engineering',
    'Information Technology',
    'Electronics and Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Mathematics',
    'Physics',
    'Chemistry',
    'English',
    'Management Studies',
    'Other'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.rollNumber || !formData.name || !formData.email || !formData.department || !formData.year) {
      toast.error('Please fill in all required fields')
      return
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    setIsLoading(true)

    try {
      console.log('📝 Submitting login form:', formData)
      
      // Test API connection first with better error handling
      const healthCheck = await fetch('/api/health').catch(err => {
        console.error('❌ Health check failed:', err)
        throw new Error('Cannot connect to backend server')
      })
      
      if (!healthCheck.ok) {
        throw new Error(`Backend server returned ${healthCheck.status}`)
      }
      
      console.log(' Backend connection successful')
      
      const result = await login(formData)
      
      if (result.success) {
        toast.success(`Welcome, ${result.user.name}!`)
        
        // Redirect to intended page or home
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
      } else {
        console.error('❌ Login failed:', result.error)
        toast.error(result.error)
      }
    } catch (error) {
      console.error('❌ Login exception:', error)
      toast.error(`Login failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Student Login</h1>
            <p className="text-gray-400">Enter your details to access EduBot features</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Roll Number *
              </label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="e.g., 21CS001"
                className="input-field w-full uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@college.edu"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                <Building className="w-4 h-4 inline mr-2" />
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field w-full"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Year of Study *
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="input-field w-full"
                required
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="input-field w-full"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login / Register'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              New users will be automatically registered.<br />
              Existing users will be logged in with updated information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login