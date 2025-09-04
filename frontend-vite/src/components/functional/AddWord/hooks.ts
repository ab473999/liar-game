import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiService } from '@/services/api'
import { useWordsStore, useAuthStore } from '@/stores'
import { logger } from '@/utils/logger'

export const useAddWord = (themeType: string, themeId: number) => {
  const navigate = useNavigate()
  const [isAdding, setIsAdding] = useState(false)
  const [wordText, setWordText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const words = useWordsStore((state) => state.words)
  const addWordToStore = useWordsStore((state) => state.addWord)
  const clearPassword = useAuthStore((state) => state.clearPassword)
  
  // Focus input when entering add mode
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAdding])
  
  // Check for duplicate words as user types
  const checkForDuplicates = (text: string) => {
    if (!text.trim()) {
      setWarning(null)
      return
    }
    
    const trimmedText = text.trim().toLowerCase()
    
    // Check if word already exists (case-insensitive)
    const duplicate = words.some(word => 
      word.word.toLowerCase() === trimmedText
    )
    
    if (duplicate) {
      setWarning('This word already exists')
    } else {
      setWarning(null)
    }
  }
  
  // Handle input change with real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setWordText(value)
    checkForDuplicates(value)
  }
  
  const handleSave = async () => {
    if (!wordText.trim()) {
      setWarning('Please enter a word')
      return
    }
    
    // Don't save if there's a duplicate warning
    if (warning) {
      return
    }
    
    const trimmedWord = wordText.trim()
    
    try {
      setIsLoading(true)
      setWarning(null)
      
      logger.log('Creating word:', { word: trimmedWord, themeId })
      const newWord = await apiService.createWord({ 
        word: trimmedWord, 
        themeId 
      })
      
      // Success - update store and reset
      addWordToStore(newWord)
      setWordText('')
      setIsAdding(false)
      
    } catch (err) {
      logger.error('Error creating word:', err)
      
      // Handle different error cases with user-friendly messages
      const errorMessage = err instanceof Error ? err.message.toLowerCase() : ''
      
      if (errorMessage.includes('authentication required') || errorMessage.includes('invalid password')) {
        // Clear stored password and redirect to home
        clearPassword()
        alert('Authentication required. Please try again.')
        navigate('/')
      } else if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
        setWarning('This word already exists')
      } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
        setWarning('Unable to connect to the server. Please check your connection.')
      } else {
        setWarning('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !warning) {
      handleSave()
    } else if (e.key === 'Escape') {
      // Exit add mode on Escape
      setWordText('')
      setIsAdding(false)
      setWarning(null)
    }
  }
  
  const startAdding = () => {
    setIsAdding(true)
  }
  
  return {
    // State
    isAdding,
    wordText,
    isLoading,
    warning,
    inputRef,
    
    // Actions
    startAdding,
    handleInputChange,
    handleSave,
    handleKeyPress,
  }
}
