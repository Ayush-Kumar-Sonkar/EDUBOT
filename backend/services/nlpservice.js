// -----------------------------
// Preprocess + tokenizer
// -----------------------------
import natural from 'natural'
import stringSimilarity from 'string-similarity'
import FAQ from '../models/faq.js'
import { pipeline } from '@xenova/transformers'

const stemmer = natural.PorterStemmer
const preprocessText = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').trim()

// -----------------------------
// Word + bi-gram fuzzy similarity for typo-tolerance
// -----------------------------
const fuzzyWordLevelSimilarity = (query, text, threshold = 0.7) => {
  if (!query || !text) return 0

  const preprocess = (t) => t.toLowerCase().replace(/[^\w\s]/g, '').trim()
  const queryWords = preprocess(query).split(' ')
  const textWords = preprocess(text).split(' ')

  // 1️⃣ Word-level matching (existing)
  let matchCount = 0
  queryWords.forEach(qw => {
    for (const tw of textWords) {
      const sim = stringSimilarity.compareTwoStrings(qw, tw)
      const editDist = natural.LevenshteinDistance(qw, tw)
      const maxLen = Math.max(qw.length, tw.length)
      const editScore = (maxLen - editDist) / maxLen

      if (Math.max(sim, editScore) >= threshold) {
        matchCount++
        break
      }
    }
  })

  const wordScore = matchCount / queryWords.length

  // 2️⃣ Bi-gram matching
  const getBigrams = (arr) => {
    const bigrams = []
    for (let i = 0; i < arr.length - 1; i++) {
      bigrams.push(arr[i] + ' ' + arr[i + 1])
    }
    return bigrams
  }

  const queryBigrams = getBigrams(queryWords)
  const textBigrams = getBigrams(textWords)

  let bigramMatch = 0
  queryBigrams.forEach(qb => {
    for (const tb of textBigrams) {
      const sim = stringSimilarity.compareTwoStrings(qb, tb)
      const editDist = natural.LevenshteinDistance(qb, tb)
      const maxLen = Math.max(qb.length, tb.length)
      const editScore = (maxLen - editDist) / maxLen

      if (Math.max(sim, editScore) >= threshold) {
        bigramMatch++
        break
      }
    }
  })

  const bigramScore = queryBigrams.length > 0 ? bigramMatch / queryBigrams.length : 0

  // Combine word + bi-gram score (weighted)
  return (wordScore * 0.6) + (bigramScore * 0.4)
}

// Extract keywords from text
export const extractKeywords = (text, count = 5) => {
  try {
    const tokens = tokenizer.tokenize(preprocessText(text))
    if (!tokens) return []
    
    // Remove common stop words
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 
      'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
      'what', 'when', 'where', 'why', 'how', 'who', 'which'
    ])
    
    const filteredTokens = tokens.filter(token => 
      token.length > 2 && !stopWords.has(token.toLowerCase())
    )
    
    // Count frequency
    const frequency = {}
    filteredTokens.forEach(token => {
      const stemmed = stemmer.stem(token.toLowerCase())
      frequency[stemmed] = (frequency[stemmed] || 0) + 1
    })
    
    // Sort by frequency and return top keywords
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([word]) => word)
  } catch (error) {
    console.error('Extract keywords error:', error)
    return []
  }
}


// -----------------------------
// Embedding setup
// -----------------------------
let embedder = null
let faqEmbeddings = [] // { faq, embedding, expandedKeywords }

// -----------------------------
// Initialize NLP
// -----------------------------
export const initializeNLP = async () => {
  embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

  const faqs = await FAQ.find({ isActive: true })
  faqEmbeddings = []

  for (const faq of faqs) {
    const doc = `${faq.question} ${faq.answer} ${faq.keywords?.join(' ') || ''}`
    const embedding = await getEmbedding(doc)
    const expandedKeywords = faq.keywords?.map(k => k.toLowerCase()) || []

    faqEmbeddings.push({ faq, embedding, expandedKeywords })
  }

  console.log(` NLP initialized with ${faqs.length} FAQs`)
}

const getEmbedding = async (text) => {
  const result = await embedder(preprocessText(text), { pooling: 'mean', normalize: true })
  return result.data
}

const cosineSimilarity = (a, b) => {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

// -----------------------------
// Main: Find best match (embedding + fuzzy)
export const findBestMatch = async (query, language = 'en') => {
  if (!embedder || faqEmbeddings.length === 0) return await findBestMatchFallback(query, language)

  const queryEmbedding = await getEmbedding(query)
  let bestMatch = null
  let highestScore = 0

  for (const { faq, embedding, expandedKeywords } of faqEmbeddings) {
    if (!faq || !embedding) continue
    if (faq.language !== language && language !== 'en') continue

    // 1️⃣ Embedding similarity
    const sim = cosineSimilarity(queryEmbedding, embedding)

    // 2️⃣ Fuzzy keyword similarity
    let keywordSim = 0
    if (expandedKeywords.length > 0) {
      const combinedKeywords = expandedKeywords.join(' ')
      keywordSim = fuzzyWordLevelSimilarity(query, combinedKeywords)
    }

    // 3️⃣ Fuzzy question similarity
    const questionSim = fuzzyWordLevelSimilarity(query, faq.question)

    // Combine scores: embeddings + keywords + question
    const totalScore = (sim * 0.5) + (keywordSim * 0.4) + (questionSim * 0.1)

    if (totalScore > highestScore) {
      highestScore = totalScore
      bestMatch = faq
    }
  }

  if (highestScore >= 0.6) {
    return { faq: bestMatch, confidence: Math.min(highestScore, 1.0), score: highestScore }
  } else {
    // fallback
    return { ...(await findBestMatchFallback(query, language)), lowConfidence: true }
  }
}

// -----------------------------
// Fallback also uses fuzzyWordLevelSimilarity
// -----------------------------
const findBestMatchFallback = async (query, language = 'en') => {
  const faqs = await FAQ.find({ isActive: true, language })
  if (faqs.length === 0 && language !== 'en') return await findBestMatchFallback(query, 'en')
  if (!faqs.length) return null

  let bestMatch = null, highestScore = 0
  for (const faq of faqs) {
    const questionScore = fuzzyWordLevelSimilarity(query, faq.question)
    const keywordScore = faq.keywords?.length > 0
      ? fuzzyWordLevelSimilarity(query, faq.keywords.join(' '))
      : 0
    const answerScore = fuzzyWordLevelSimilarity(query, faq.answer)

    const totalScore = (questionScore * 0.6) + (keywordScore * 0.3) + (answerScore * 0.1)

    if (totalScore > highestScore) {
      highestScore = totalScore
      bestMatch = faq
    }
  }

  return { faq: bestMatch, confidence: highestScore, score: highestScore }
}
