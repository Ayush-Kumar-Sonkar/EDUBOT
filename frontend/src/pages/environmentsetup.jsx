import React, { useState } from 'react'
import { Server, Database, Globe, Key, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const EnvironmentSetup = () => {
  const [config, setConfig] = useState({
    mongoUri: 'your-mongo-uri',
    port: '5000',
    jwtSecret: 'your-jwt-secret',
    nodeEnv: 'development'
  })

  const [testResults, setTestResults] = useState({
    database: null,
    translation: null,
    server: null
  })

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const testConnection = async (service) => {
    // Simulate API calls to test connections
    setTestResults(prev => ({ ...prev, [service]: 'testing' }))
    
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% success rate for demo
      setTestResults(prev => ({ ...prev, [service]: success ? 'success' : 'error' }))
      
      if (success) {
        toast.success(`${service} connection successful`)
      } else {
        toast.error(`${service} connection failed`)
      }
    }, 2000)
  }

  const saveConfiguration = () => {
    // In a real app, this would save to backend
    toast.success('Configuration saved successfully')
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'testing':
        return <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
      default:
        return <div className="w-5 h-5 border-2 border-gray-600 rounded-full" />
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">⚙️ Environment Setup</h1>
        <p className="text-gray-400">Configure your chatbot environment and test connections</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="space-y-6">
          {/* Database Configuration */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-6 h-6 text-primary-400" />
              <h2 className="text-lg font-semibold text-white">Database Configuration</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">MongoDB URI</label>
                <input
                  type="text"
                  value={config.mongoUri}
                  onChange={(e) => handleConfigChange('mongoUri', e.target.value)}
                  placeholder="mongodb://localhost:27017/edubot"
                  className="input-field w-full"
                />
              </div>
              
              <button
                onClick={() => testConnection('database')}
                className="btn-secondary flex items-center space-x-2"
                disabled={testResults.database === 'testing'}
              >
                {getStatusIcon(testResults.database)}
                <span>Test Database Connection</span>
              </button>
            </div>
          </div>

          {/* Translation Service */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-6 h-6 text-primary-400" />
              <h2 className="text-lg font-semibold text-white">Google Translate API</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Google Translate API Active</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Using @vitalets/google-translate-api - No API key required!
                    Perfect for hackathons and development.
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => testConnection('translation')}
                className="btn-secondary flex items-center space-x-2"
                disabled={testResults.translation === 'testing'}
              >
                {getStatusIcon(testResults.translation)}
                <span>Test Translation Service</span>
              </button>
            </div>
          </div>

          {/* Server Configuration */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Server className="w-6 h-6 text-primary-400" />
              <h2 className="text-lg font-semibold text-white">Server Configuration</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">PORT</label>
                  <input
                    type="text"
                    value={config.port}
                    onChange={(e) => handleConfigChange('port', e.target.value)}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Environment</label>
                  <select
                    value={config.nodeEnv}
                    onChange={(e) => handleConfigChange('nodeEnv', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="development">Development</option>
                    <option value="production">Production</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={() => testConnection('server')}
                className="btn-secondary flex items-center space-x-2"
                disabled={testResults.server === 'testing'}
              >
                {getStatusIcon(testResults.server)}
                <span>Test Server Configuration</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="space-y-6">
          {/* System Status */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4">System Status</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-dark-700 rounded">
                <span className="text-gray-300">Database Connection</span>
                {getStatusIcon(testResults.database)}
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-700 rounded">
                <span className="text-gray-300">Translation Service</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-700 rounded">
                <span className="text-gray-300">Server Configuration</span>
                {getStatusIcon(testResults.server)}
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Key className="w-6 h-6 text-primary-400" />
              <h2 className="text-lg font-semibold text-white">Security</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">JWT Secret</label>
                <input
                  type="password"
                  value={config.jwtSecret}
                  onChange={(e) => handleConfigChange('jwtSecret', e.target.value)}
                  placeholder="Enter a secure secret key"
                  className="input-field w-full"
                />
              </div>
              
              <button className="btn-secondary w-full">
                Generate Random Secret
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4">Actions</h2>
            
            <div className="space-y-3">
              <button
                onClick={saveConfiguration}
                className="btn-primary w-full"
              >
                Save Configuration
              </button>
              
              <button className="btn-secondary w-full">
                Export Configuration
              </button>
              
              <button className="btn-secondary w-full">
                Reset to Defaults
              </button>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4">Environment Variables</h2>
            
            <div className="bg-dark-700 p-4 rounded text-sm">
              <pre className="text-gray-300">
{`MONGO_URI=${config.mongoUri}
PORT=${config.port}
LIBRETRANSLATE_URL=${config.libreTranslateUrl}
JWT_SECRET=${config.jwtSecret ? '***hidden***' : ''}
NODE_ENV=${config.nodeEnv}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnvironmentSetup
