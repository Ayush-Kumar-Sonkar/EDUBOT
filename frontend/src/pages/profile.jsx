import React, { useState, useEffect } from 'react'
import { User, Settings, BarChart3, MessageCircle, Star } from 'lucide-react'
import { useAuth } from '../contexts/authcontext'
import { useLanguage } from '../contexts/LanguageContext'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updatePreferences, isAuthenticated } = useAuth()
  const { getAllLanguages } = useLanguage()
  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'dark',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    chatSettings: {
      showTimestamps: true,
      soundEnabled: true,
      autoTranslate: true
    }
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences)
    }
  }, [user])

  const handlePreferenceChange = (section, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const handleSavePreferences = async () => {
    setIsLoading(true)
    try {
      const result = await updatePreferences(preferences)
      if (result.success) {
        toast.success('Preferences updated successfully!')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Failed to update preferences')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Please log in to view your profile.</p>
      </div>
    )
  }

  const languages = getAllLanguages()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">👤 Profile</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">{user.name}</h2>
              <p className="text-gray-400">{user.rollNumber}</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Department:</span>
                <span className="text-white">{user.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Year:</span>
                <span className="text-white">{user.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white text-xs">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Chats:</span>
                <span className="text-white">{user.totalConversations || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Messages:</span>
                <span className="text-white">{user.totalMessages || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-dark-700 rounded">
                <MessageCircle className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{user.totalConversations || 0}</p>
                <p className="text-xs text-gray-400">Conversations</p>
              </div>
              <div className="text-center p-3 bg-dark-700 rounded">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">4.8</p>
                <p className="text-xs text-gray-400">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              Preferences
            </h2>

            <div className="space-y-6">
              {/* Language Settings */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Language & Localization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Preferred Language</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => handlePreferenceChange('', 'language', e.target.value)}
                      className="input-field w-full"
                    >
                      {Object.entries(languages).map(([code, lang]) => (
                        <option key={code} value={code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Theme</label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => handlePreferenceChange('', 'theme', e.target.value)}
                      className="input-field w-full"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={preferences.notifications?.email}
                      onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-gray-300">Email notifications</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={preferences.notifications?.push}
                      onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-gray-300">Push notifications</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={preferences.notifications?.sms}
                      onChange={(e) => handlePreferenceChange('notifications', 'sms', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-gray-300">SMS notifications</span>
                  </label>
                </div>
              </div>

              {/* Chat Settings */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Chat Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={preferences.chatSettings?.showTimestamps}
                      onChange={(e) => handlePreferenceChange('chatSettings', 'showTimestamps', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-gray-300">Show message timestamps</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={preferences.chatSettings?.soundEnabled}
                      onChange={(e) => handlePreferenceChange('chatSettings', 'soundEnabled', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-gray-300">Enable notification sounds</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={preferences.chatSettings?.autoTranslate}
                      onChange={(e) => handlePreferenceChange('chatSettings', 'autoTranslate', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-gray-300">Auto-translate messages</span>
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-dark-600">
                <button
                  onClick={handleSavePreferences}
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save Preferences'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile