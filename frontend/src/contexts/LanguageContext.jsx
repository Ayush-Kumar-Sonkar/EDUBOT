import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const languages = {
  en: { name: 'English', code: 'en', flag: '🇺🇸', fontClass: '' },
  hi: { name: 'हिंदी (Hindi)', code: 'hi', flag: '🇮🇳', fontClass: 'font-hindi' },
  bn: { name: 'বাংলা (Bengali)', code: 'bn', flag: '🇮🇳', fontClass: 'font-bengali' },
  ta: { name: 'தமிழ் (Tamil)', code: 'ta', flag: '🇮🇳', fontClass: 'font-tamil' },
  te: { name: 'తెలుగు (Telugu)', code: 'te', flag: '🇮🇳', fontClass: 'font-telugu' },
  mwr: { name: 'मारवाड़ी (Marwari)', code: 'mwr', flag: '🇮🇳', fontClass: 'font-marwari' }
}

const translations = {
  en: {
    'chat.title': 'Educational Assistant',
    'chat.subtitle': 'Online & Ready',
    'chat.placeholder': 'Type your message...',
    'chat.send': 'Send',
    'chat.greeting': "Hello! I'm your multilingual educational assistant. I can help you with:",
    'chat.features.admissions': '📋 Admission information and requirements',
    'chat.features.academic': '🎓 Academic programs and course details',
    'chat.features.campus': '🏫 Campus facilities and services',
    'chat.features.financial': '💰 Financial aid and scholarships',
    'chat.features.technical': '💻 Technical support and LMS access',
    'chat.features.footer': 'Feel free to ask me anything in your preferred language!',
    'nav.chat': 'Chat Interface',
    'nav.admin': 'Admin Dashboard',
    'nav.analytics': 'Analytics',
    'nav.integration': 'Integration',
    'nav.environment': 'Environment Setup'
  },
  hi: {
    'chat.title': 'शैक्षिक सहायक',
    'chat.subtitle': 'ऑनलाइन और तैयार',
    'chat.placeholder': 'अपना संदेश टाइप करें...',
    'chat.send': 'भेजें',
    'chat.greeting': "नमस्ते! मैं आपका बहुभाषी शैक्षिक सहायक हूं। मैं आपकी मदद कर सकता हूं:",
    'chat.features.admissions': '📋 प्रवेश की जानकारी और आवश्यकताएं',
    'chat.features.academic': '🎓 शैक्षणिक कार्यक्रम और पाठ्यक्रम विवरण',
    'chat.features.campus': '🏫 परिसर की सुविधाएं और सेवाएं',
    'chat.features.financial': '💰 वित्तीय सहायता और छात्रवृत्ति',
    'chat.features.technical': '💻 तकनीकी सहायता और LMS पहुंच',
    'chat.features.footer': 'अपनी पसंदीदा भाषा में मुझसे कुछ भी पूछने में संकोच न करें!',
    'nav.chat': 'चैट इंटरफ़ेस',
    'nav.admin': 'व्यवस्थापक डैशबोर्ड',
    'nav.analytics': 'एनालिटिक्स',
    'nav.integration': 'एकीकरण',
    'nav.environment': 'पर्यावरण सेटअप'
  },
  // Add more translations for other languages
  bn: {
    'chat.title': 'শিক্ষামূলক সহকারী',
    'chat.subtitle': 'অনলাইন এবং প্রস্তুত',
    'chat.placeholder': 'আপনার বার্তা টাইপ করুন...',
    'chat.send': 'পাঠান',
    'chat.greeting': "হ্যালো! আমি আপনার বহুভাষিক শিক্ষামূলক সহকারী। আমি আপনাকে সাহায্য করতে পারি:",
    'chat.features.admissions': '📋 ভর্তি তথ্য এবং প্রয়োজনীয়তা',
    'chat.features.academic': '🎓 একাডেমিক প্রোগ্রাম এবং কোর্সের বিবরণ',
    'chat.features.campus': '🏫 ক্যাম্পাস সুবিধা এবং পরিষেবা',
    'chat.features.financial': '💰 আর্থিক সহায়তা এবং বৃত্তি',
    'chat.features.technical': '💻 প্রযুক্তিগত সহায়তা এবং LMS অ্যাক্সেস',
    'chat.features.footer': 'আপনার পছন্দের ভাষায় আমাকে কিছু জিজ্ঞাসা করতে দ্বিধা করবেন না!',
    'nav.chat': 'চ্যাট ইন্টারফেস',
    'nav.admin': 'অ্যাডমিন ড্যাশবোর্ড',
    'nav.analytics': 'বিশ্লেষণ',
    'nav.integration': 'ইন্টিগ্রেশন',
    'nav.environment': 'পরিবেশ সেটআপ'
  },
  ta: {
    'chat.title': 'கல்வி உதவியாளர்',
    'chat.subtitle': 'ஆன்லைனில் மற்றும் தயாராக உள்ளது',
    'chat.placeholder': 'உங்கள் செய்தியை தட்டச்சு செய்யவும்...',
    'chat.send': 'அனுப்பு',
    'chat.greeting': "வணக்கம்! நான் உங்கள் பன்மொழி கல்வி உதவியாளர். நான் உங்களுக்கு உதவ முடியும்:",
    'chat.features.admissions': '📋 சேர்க்கை தகவல் மற்றும் தேவைகள்',
    'chat.features.academic': '🎓 கல்வி திட்டங்கள் மற்றும் பாட விவரங்கள்',
    'chat.features.campus': '🏫 கல்லூரி வசதிகள் மற்றும் சேவைகள்',
    'chat.features.financial': '💰 நிதி உதவி மற்றும் ஸ்காலர்ஷிப்கள்',
    'chat.features.technical': '💻 தொழில்நுட்ப ஆதரவு மற்றும் LMS அணுகல்',
    'chat.features.footer': 'உங்கள் விருப்பமான மொழியில் என்னிடம் எதையும் கேட்க தயங்க வேண்டாம்!',
    'nav.chat': 'அரட்டை இடைமுகம்',
    'nav.admin': 'நிர்வாக டாஷ்போர்டு',
    'nav.analytics': 'பகுப்பாய்வு',
    'nav.integration': 'ஒருங்கிணைப்பு',
    'nav.environment': 'சுற்றுச்சூழல் அமைப்பு'
  },
  te: {
    'chat.title': 'విద్యా సహాయకుడు',
    'chat.subtitle': 'ఆన్లైన్ & రెడీ',
    'chat.placeholder': 'మీ సందేశాన్ని టైప్ చేయండి...',
    'chat.send': 'పంపించు',
    'chat.greeting': "హలో! నేను మీ బహుభాషా విద్యా సహాయకుడు. నేను మీకు సహాయం చేయగలను:",
    'chat.features.admissions': '📋 ప్రవేశ సమాచారం మరియు అవసరాలు',
    'chat.features.academic': '🎓 అకాడమిక్ ప్రోగ్రామ్స్ మరియు కోర్సు వివరాలు',
    'chat.features.campus': '🏫 క్యాంపస్ సదుపాయాలు మరియు సేవలు',
    'chat.features.financial': '💰 ఆర్థిక సహాయం మరియు స్కాలర్‌షిప్‌లు',
    'chat.features.technical': '💻 సాంకేతిక మద్దతు మరియు LMS యాక్సెస్',
    'chat.features.footer': 'మీ ఇష్టమైన భాషలో నన్ను ఏదైనా అడగడానికి సంకోచించకండి!',
    'nav.chat': 'చాట్ ఇంటర్ఫేస్',
    'nav.admin': 'అడ్మిన్ డాష్‌బోర్డ్',
    'nav.analytics': 'విశ్లేషణలు',
    'nav.integration': 'ఇంటిగ్రేషన్',
    'nav.environment': 'పర్యావరణ సెటప్'
  },
  mwr: {
    'chat.title': 'शैक्षणिक सहायक',
    'chat.subtitle': 'ऑनलाइन अर तैयार',
    'chat.placeholder': 'आपरो संदेश टाइप करो...',
    'chat.send': 'भेजणो',
    'chat.greeting': "नमस्कार! मैं थारो बहुभाषी शैक्षणिक सहायक हूं। मैं थारी मदद कर सकूं:",
    'chat.features.admissions': '📋 प्रवेश री जाणकारी अर शर्तां',
    'chat.features.academic': '🎓 शैक्षणिक कार्यक्रम अर पाठ्यक्रम री ब्यौरा',
    'chat.features.campus': '🏫 परिसर री सुविधावां अर सेवावां',
    'chat.features.financial': '💰 आर्थिक मदद अर छात्रवृत्ति',
    'chat.features.technical': '💻 तकनीकी सहायता अर एलएमएस पहुंच',
    'chat.features.footer': 'आपरी पसंद री भाषा मांय म्हानै कीं भी पूछबा तांई संकोच नीं करो!',
    'nav.chat': 'चैट इंटरफेस',
    'nav.admin': 'व्यवस्थापक डैशबोर्ड',
    'nav.analytics': 'विश्लेषण',
    'nav.integration': 'एकीकरण',
    'nav.environment': 'पर्यावरण री व्यवस्था'
  }
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [autoDetect, setAutoDetect] = useState(true)

  const translate = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key
  }

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode)
    localStorage.setItem('edubot-language', langCode)
  }

  const getCurrentLanguage = () => languages[currentLanguage]

  const getAllLanguages = () => languages

  useEffect(() => {
    const savedLanguage = localStorage.getItem('edubot-language')
    if (savedLanguage && languages[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const value = {
    currentLanguage,
    changeLanguage,
    translate,
    getCurrentLanguage,
    getAllLanguages,
    autoDetect,
    setAutoDetect
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}