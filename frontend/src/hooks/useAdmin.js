import { useState } from 'react'
import { adminAPI } from '../services/api'

export const useAdmin = () => {
  const [faqs, setFaqs] = useState([])
  const [conversations, setConversations] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchFaqs = async () => {
    setIsLoading(true)
    try {
      const response = await adminAPI.getFaqs()
      setFaqs(response.data)
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchConversations = async () => {
    try {
      const response = await adminAPI.getConversations()
      setConversations(response.data)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }

  const addFaq = async (faqData) => {
    try {
      const response = await adminAPI.createFaq(faqData)
      setFaqs(prev => [...prev, response.data])
      return response.data
    } catch (error) {
      console.error('Error adding FAQ:', error)
      throw error
    }
  }

  const updateFaq = async (id, faqData) => {
    try {
      const response = await adminAPI.updateFaq(id, faqData)
      setFaqs(prev => prev.map(faq => faq._id === id ? response.data : faq))
      return response.data
    } catch (error) {
      console.error('Error updating FAQ:', error)
      throw error
    }
  }

  const deleteFaq = async (id) => {
    try {
      await adminAPI.deleteFaq(id)
      setFaqs(prev => prev.filter(faq => faq._id !== id))
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      throw error
    }
  }

  return {
    faqs,
    conversations,
    isLoading,
    fetchFaqs,
    fetchConversations,
    addFaq,
    updateFaq,
    deleteFaq
  }
}