import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ButtonSave } from '@/components/ui/customized/ButtonSave'
import { ButtonDelete } from '@/components/ui/customized/ButtonDelete'
import { useWordsStore, useAuthStore } from '@/stores'
import { apiService } from '@/services/api'
import type { Word } from '@/types'
import { logger } from '@/utils/logger'

interface RowProps {
  word: Word
}

export const Row = ({ word }: RowProps) => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(word.word)
  const [isLoading, setIsLoading] = useState(false)
  const [originalText, setOriginalText] = useState(word.word)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const updateWordInStore = useWordsStore((state) => state.updateWord)
  const removeWordFromStore = useWordsStore((state) => state.removeWord)
  const words = useWordsStore((state) => state.words)
  const clearPassword = useAuthStore((state) => state.clearPassword)
  
  // Update local state when word prop changes (e.g., from backend sync)
  useEffect(() => {
    setEditedText(word.word)
    setOriginalText(word.word)
    setIsEditing(false)
  }, [word.word])
  
  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])
  
  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setEditedText(newValue)
    
    // Check if different from original to show save button
    if (newValue !== originalText) {
      setIsEditing(true)
    } else {
      setIsEditing(false)
    }
  }
  
  const handleSave = async () => {
    if (!editedText.trim()) {
      // Reset to original if empty
      setEditedText(originalText)
      setIsEditing(false)
      return
    }
    
    // Check for duplicates (case-insensitive)
    const isDuplicate = words.some(w => 
      w.id !== word.id && w.word.toLowerCase() === editedText.trim().toLowerCase()
    )
    
    if (isDuplicate) {
      alert('This word already exists')
      setEditedText(originalText)
      setIsEditing(false)
      return
    }
    
    try {
      setIsLoading(true)
      
      const updatedWord = await apiService.updateWord(word.id, {
        word: editedText.trim()
      })
      
      // Update store with the new word
      updateWordInStore(word.id, updatedWord)
      setOriginalText(editedText.trim())
      setIsEditing(false)
    } catch (err) {
      logger.error('Error updating word:', err)
      const errorMessage = err instanceof Error ? err.message.toLowerCase() : ''
      
      if (errorMessage.includes('authentication required') || errorMessage.includes('invalid password')) {
        clearPassword()
        alert('Authentication required. Please try again.')
        navigate('/')
      } else {
        alert('Failed to update word. Please try again.')
        setEditedText(originalText)
        setIsEditing(false)
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDelete = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(`Are you sure you want to delete "${word.word}"?`)
    
    if (!confirmed) {
      return
    }
    
    try {
      setIsLoading(true)
      
      await apiService.deleteWord(word.id)
      
      // Remove from store
      removeWordFromStore(word.id)
    } catch (err) {
      logger.error('Error deleting word:', err)
      const errorMessage = err instanceof Error ? err.message.toLowerCase() : ''
      
      if (errorMessage.includes('authentication required') || errorMessage.includes('invalid password')) {
        clearPassword()
        alert('Authentication required. Please try again.')
        navigate('/')
      } else {
        alert('Failed to delete word. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isEditing) {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditedText(originalText)
      setIsEditing(false)
    }
  }
  
  const handleFocus = () => {
    // Select all text on focus for easy editing
    if (inputRef.current) {
      inputRef.current.select()
    }
  }
  
  return (
    <div 
      className="flex items-center"
      style={{
        opacity: isLoading ? 0.5 : 1,
        pointerEvents: isLoading ? 'none' : 'auto'
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={editedText}
        onChange={handleEdit}
        onKeyDown={handleKeyPress}
        onFocus={handleFocus}
        className="flex-1 px-2 py-1.5 rounded-lg transition-colors mr-1 text-sm"
        style={{
          backgroundColor: 'var(--mainbutton-bg)',
          color: 'var(--font-primary)',
          border: 'none',
        }}
        disabled={isLoading}
      />
      <div className="flex items-center">
        <ButtonSave 
          onClick={handleSave} 
          disabled={isLoading || !isEditing}
          ariaLabel={`Save changes to ${word.word}`}
        />
        <ButtonDelete 
          onClick={handleDelete} 
          disabled={isLoading}
          ariaLabel={`Delete ${word.word}`}
        />
      </div>
    </div>
  )
}
