import React from 'react'
import { Globe, MessageCircle, BookOpen, BarChart3 } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Sidebar = () => {
  const { translate } = useLanguage()

  const features = [
    {
      icon: Globe,
      title: 'Multi-language Support',
      description: 'Communicate in 5+ regional languages'
    },
    {
      icon: MessageCircle,
      title: 'Context Awareness',
      description: 'Maintains conversation context'
    },
    {
      icon: BookOpen,
      title: 'FAQ Knowledge Base',
      description: 'Comprehensive institutional information'
    },
    {
      icon: BarChart3,
      title: 'Interaction Logging',
      description: 'Track and analyze conversations'
    }
  ]

  return (
    <div className="fixed left-0 top-16 w-80 h-[calc(100vh-4rem)] bg-dark-800 border-r border-dark-700 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-primary-400 mb-4">Chat Features</h2>
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="sidebar-item">
              <feature.icon className="w-5 h-5 text-primary-500" />
              <div>
                <h3 className="font-medium text-white">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-dark-700 rounded-lg p-4">
        <h3 className="font-medium text-white mb-2">Conversation Context</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Status:</span>
            <span className="text-green-400">Ready to help with your questions</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Mode:</span>
            <span className="text-blue-400">Chatbot initialized and ready</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar