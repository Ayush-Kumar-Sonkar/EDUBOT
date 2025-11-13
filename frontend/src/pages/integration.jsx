import React, { useState } from 'react'
import { MessageSquare, Send, Slack, Globe, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const Integration = () => {
  const [copiedCode, setCopiedCode] = useState(false)

  const integrations = [
    {
      name: 'WhatsApp Business',
      icon: MessageSquare,
      status: 'Connected',
      statusColor: 'text-green-400',
      endpoint: '/api/webhooks/whatsapp',
      method: 'POST',
      samplePayload: {
        "from": "+1234567890",
        "message": "What are your library hours?",
        "language": "auto-detect"
      }
    },
    {
      name: 'Telegram',
      icon: Send,
      status: 'Connected',
      statusColor: 'text-green-400',
      endpoint: '/api/webhooks/telegram',
      method: 'POST',
      samplePayload: {
        "update_id": 123456,
        "message": {
          "chat": {"id": 789, "type": "private"},
          "from": {"id": 456, "first_name": "John"},
          "text": "Tell me about scholarships"
        }
      }
    },
  ]

  const widgetCode = `<script src="https://your-domain.com/chatbot.js"></script>
<script>
  EduBot.init({
    apiKey: 'YOUR_API_KEY',
    language: 'auto-detect',
    theme: 'light'
  });
</script>`

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(true)
    toast.success('Code copied to clipboard!')
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🔗 Integration</h1>
        <p className="text-gray-400">Connect your chatbot to multiple messaging platforms</p>
      </div>

      {/* Messaging Platform Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {integrations.map((integration, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center">
                  <integration.icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{integration.name}</h3>
                  <span className={`text-sm ${integration.statusColor}`}>
                    {integration.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Endpoint:</span>
                <code className="block bg-dark-700 p-2 rounded mt-1 text-primary-300">
                  {integration.endpoint}
                </code>
              </div>
              
              <div>
                <span className="text-gray-400">Method:</span>
                <span className="ml-2 text-white">{integration.method}</span>
              </div>

              {integration.samplePayload && (
                <div>
                  <span className="text-gray-400">Sample Payload:</span>
                  <pre className="bg-dark-700 p-3 rounded mt-1 text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(integration.samplePayload, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {integration.action && (
              <button className="btn-primary w-full mt-4">
                {integration.action}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Website Widget */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Website Widget</h2>
            <span className="text-sm text-green-400">Active</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-2">Embed Code:</label>
          <div className="relative">
            <pre className="bg-dark-700 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
              {widgetCode}
            </pre>
            <button
              onClick={() => copyToClipboard(widgetCode)}
              className="absolute top-2 right-2 p-2 bg-dark-600 hover:bg-dark-500 rounded transition-colors"
            >
              {copiedCode ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Widget Theme:</span>
            <p className="text-white mt-1">Light/Dark Auto</p>
          </div>
          <div>
            <span className="text-gray-400">Default Language:</span>
            <p className="text-white mt-1">Auto-detect</p>
          </div>
          <div>
            <span className="text-gray-400">Position:</span>
            <p className="text-white mt-1">Bottom Right</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Integration