import { useState, useEffect, useRef } from 'react'
import { ButtonSave } from '@/components/ui/customized/ButtonSave'
import { ButtonDelete } from '@/components/ui/customized/ButtonDelete'
import { useWordsStore } from '@/stores'
import { apiService } from '@/services/api'
import type { Word } from '@/types'

interface WordItemProps {
  word: Word
}

const WordItem = ({ word }: WordItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(word.word)
  const [isLoading, setIsLoading] = useState(false)
  const [originalText, setOriginalText] = useState(word.word)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const updateWordInStore = useWordsStore((state) => state.updateWord)
  const removeWordFromStore = useWordsStore((state) => state.removeWord)
  const words = useWordsStore((state) => state.words)
  
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
      console.error('Error updating word:', err)
      alert('Failed to update word. Please try again.')
      setEditedText(originalText)
      setIsEditing(false)
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
      console.error('Error deleting word:', err)
      alert('Failed to delete word. Please try again.')
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
      className="flex items-center py-2"
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
        className="flex-1 px-3 py-2 rounded-lg transition-colors mr-3"
        style={{
          backgroundColor: 'var(--color-inputBg)',
          color: 'var(--color-textPrimary)',
          border: '1px solid var(--color-borderPrimary)',
        }}
        disabled={isLoading}
      />
      <div className="flex items-center gap-1">
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

interface WordListProps {
  themeType: string
  themeId: number
}

export const WordList = ({ themeType }: WordListProps) => {
  const words = useWordsStore((state) => state.words)
  const setWords = useWordsStore((state) => state.setWords)
  const syncWords = useWordsStore((state) => state.syncWords)
  const setLoading = useWordsStore((state) => state.setLoading)
  const setSyncing = useWordsStore((state) => state.setSyncing)
  const currentThemeType = useWordsStore((state) => state.currentThemeType)
  const lastSynced = useWordsStore((state) => state.lastSynced)
  const isLoading = useWordsStore((state) => state.isLoading)
  
  // Initial load: if we have no words or theme changed, do a full fetch
  useEffect(() => {
    if (words.length === 0 || currentThemeType !== themeType || !lastSynced) {
      const fetchWords = async () => {
        try {
          setLoading(true)
          const fetchedWords = await apiService.getWordsByTheme(themeType)
          setWords(fetchedWords, themeType)
        } catch (error) {
          console.error('Failed to fetch words:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchWords()
    }
  }, [themeType, currentThemeType, words.length, lastSynced, setWords, setLoading])
  
  // Background sync: always run this to catch backend changes
  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        setSyncing(true)
        console.log('WordList: Starting background sync with backend')
        const backendWords = await apiService.getWordsByTheme(themeType)
        syncWords(backendWords, themeType)
      } catch (error) {
        console.error('Failed to sync words with backend:', error)
      } finally {
        setSyncing(false)
      }
    }
    
    // Sync on mount
    syncWithBackend()
    
    // Optional: Set up periodic sync (every 30 seconds)
    const interval = setInterval(syncWithBackend, 30000)
    
    return () => clearInterval(interval)
  }, [themeType, syncWords, setSyncing])
  
  if (isLoading) {
    return (
      <div className="p-4 text-center" style={{ color: 'var(--color-textSecondary)' }}>
        Loading words...
      </div>
    )
  }
  
  if (words.length === 0) {
    return (
      <div className="p-4 text-center" style={{ color: 'var(--color-textSecondary)' }}>
        No words yet. Add your first word above!
      </div>
    )
  }
  
  return (
    <div className="w-full px-4 py-4">
      <div className="max-w-2xl mx-auto">
        {words.map((word) => (
          <WordItem key={word.id} word={word} />
        ))}
      </div>
    </div>
  )
}
