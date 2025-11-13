import { translate } from '@vitalets/google-translate-api'

// Language code mapping for Google Translate
const languageMap = {
  'en': 'en',
  'hi': 'hi',
  'bn': 'bn',
  'ta': 'ta',
  'te': 'te',
  'mwr': 'hi'
}

export const translateText = async (text, fromLang, toLang) => {
  try {
    // If source and target languages are the same, return original text
    if (fromLang === toLang) {
      return text
    }

    // Map language codes
    const sourceCode = languageMap[fromLang] || fromLang
    const targetCode = languageMap[toLang] || toLang

    console.log(`🌐 Translating "${text.substring(0, 50)}..." from ${sourceCode} to ${targetCode}`)

    const result = await translate(text, { 
      from: sourceCode, 
      to: targetCode 
    })

    console.log(` Translation successful: "${result.text.substring(0, 50)}..."`)
    return result.text || text

  } catch (error) {
    console.error('❌ Translation error:', error.message)
    
    // Fallback: return original text if translation fails
    return text
  }
}

export const detectLanguage = async (text) => {
  try {
    console.log(`🔍 Detecting language for: "${text.substring(0, 50)}..."`)
    const result = await translate(text, { to: 'en' })
    let detectedLang = result.from?.language?.iso || 'en'
    
    // Normalize Marwari variants
    if (['raj', 'rwr', 'mwr'].includes(detectedLang)) {
      detectedLang = 'mwr'
    }
    
    const supportedLanguages = ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'mwr']
    const finalLang = supportedLanguages.includes(detectedLang) ? detectedLang : 'en'
    
    console.log(`🎯 Detected language: ${detectedLang} → Final: ${finalLang}`)
    return finalLang
  } catch (error) {
    console.error('❌ Language detection error:', error.message)
    return 'en'
  }
}

export const getSupportedLanguages = () => {
  // Return our supported languages for the chatbot
  return [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'mwr', name: 'Marwari (βeta)' }
  ]
}

// Batch translation for multiple texts
export const translateBatch = async (texts, fromLang, toLang) => {
  try {
    console.log(`🔄 Batch translating ${texts.length} texts from ${fromLang} to ${toLang}`)
    
    const translations = await Promise.all(
      texts.map(async (text, index) => {
        try {
          const result = await translateText(text, fromLang, toLang)
          console.log(` Batch item ${index + 1}/${texts.length} translated`)
          return result
        } catch (error) {
          console.error(`❌ Batch item ${index + 1} failed:`, error.message)
          return text // Return original on failure
        }
      })
    )
    
    console.log(`🎉 Batch translation completed: ${translations.length} items`)
    return translations

  } catch (error) {
    console.error('❌ Batch translation error:', error.message)
    return texts // Return original texts if batch translation fails
  }
}

// Test translation function for debugging
export const testTranslation = async () => {
  try {
    console.log('🧪 Testing Google Translate API...')
    
    const testText = "Hello, how are you?"
    const hindiResult = await translateText(testText, 'en', 'hi')
    const backToEnglish = await translateText(hindiResult, 'hi', 'en')
    
    console.log(' Translation test results:')
    console.log(`   Original: ${testText}`)
    console.log(`   Hindi: ${hindiResult}`)
    console.log(`   Back to English: ${backToEnglish}`)
    
    return true
  } catch (error) {
    console.error('❌ Translation test failed:', error.message)
    return false
  }
}

// Auto-detect and translate to target language
export const autoTranslate = async (text, targetLang = 'en') => {
  try {
    // First detect the language
    const detectedLang = await detectLanguage(text)
    
    // Then translate if needed
    if (detectedLang !== targetLang) {
      const translatedText = await translateText(text, detectedLang, targetLang)
      return {
        originalText: text,
        translatedText,
        detectedLanguage: detectedLang,
        targetLanguage: targetLang
      }
    }
    
    return {
      originalText: text,
      translatedText: text,
      detectedLanguage: detectedLang,
      targetLanguage: targetLang
    }
    
  } catch (error) {
    console.error('❌ Auto-translate error:', error.message)
    return {
      originalText: text,
      translatedText: text,
      detectedLanguage: 'en',
      targetLanguage: targetLang
    }
  }
}