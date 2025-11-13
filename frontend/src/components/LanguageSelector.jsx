import React, { useState } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { currentLanguage, changeLanguage, getCurrentLanguage, getAllLanguages } = useLanguage()
  
  const languages = getAllLanguages()
  const current = getCurrentLanguage()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">{current.flag} {current.name.split(' ')[0]}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-600 rounded-lg shadow-lg z-50">
          {Object.entries(languages).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => {
                changeLanguage(code)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 hover:bg-dark-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                code === currentLanguage ? 'bg-primary-600' : ''
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span className={lang.fontClass}>{lang.name}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector