import { useState, useRef, useEffect } from 'react'
import { apiService } from '@/services/api'
import { useThemesStore } from '@/stores'

export const useAddTheme = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [themeName, setThemeName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const themes = useThemesStore((state) => state.themes)
  const addThemeToStore = useThemesStore((state) => state.addTheme)
  
  // Focus input when entering add mode
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAdding])
  
  // Generate type from name (lowercase, keep some punctuation, replace spaces with dashes)
  const generateTypeFromName = (name: string): string => {
    return name
      .toLowerCase()
      // Keep letters, numbers, and allowed punctuation (-, !, ?, ., ,)
      .replace(/[^a-z0-9\-!?.,]+/g, '-') // Replace disallowed chars and spaces with dash
      .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
      .replace(/-+/g, '-') // Replace multiple dashes with single
  }
  
  // Generate plural/singular variations for checking
  const generateVariations = (text: string): string[] => {
    const lower = text.toLowerCase()
    const variations = [lower]
    
    // Handle basic plural forms
    if (lower.endsWith('s')) {
      // Remove 's' for singular
      variations.push(lower.slice(0, -1))
      
      // Handle 'ies' -> 'y' (e.g., activities -> activity)
      if (lower.endsWith('ies')) {
        variations.push(lower.slice(0, -3) + 'y')
      }
      // Handle 'es' -> '' (e.g., places -> place)
      if (lower.endsWith('es')) {
        variations.push(lower.slice(0, -2))
      }
    } else {
      // Add 's' for plural
      variations.push(lower + 's')
      
      // Handle 'y' -> 'ies' (e.g., activity -> activities)
      if (lower.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(lower[lower.length - 2])) {
        variations.push(lower.slice(0, -1) + 'ies')
      }
      // Add 'es' for words ending in s, x, z, ch, sh
      if (lower.match(/(s|x|z|ch|sh)$/)) {
        variations.push(lower + 'es')
      }
    }
    
    return [...new Set(variations)] // Remove duplicates
  }
  
  // Check for duplicate themes as user types
  const checkForDuplicates = (name: string) => {
    if (!name.trim()) {
      setWarning(null)
      return
    }
    
    const trimmedName = name.trim()
    const nameVariations = generateVariations(trimmedName)
    const type = generateTypeFromName(trimmedName)
    const typeVariations = generateVariations(type)
    
    // Check if any variation of the name matches existing theme names
    const duplicateName = themes.some(theme => {
      const existingNameLower = theme.name.toLowerCase()
      return nameVariations.some(variation => 
        variation === existingNameLower || 
        generateVariations(theme.name).includes(variation)
      )
    })
    
    // Check if any variation of the type matches existing theme types
    const duplicateType = themes.some(theme => {
      return typeVariations.some(variation => 
        variation === theme.type.toLowerCase() ||
        generateVariations(theme.type).includes(variation)
      )
    })
    
    if (duplicateName || duplicateType) {
      setWarning('A theme with this name already exists')
    } else {
      setWarning(null)
    }
  }
  
  // Handle input change with real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setThemeName(value)
    checkForDuplicates(value)
  }
  
  const handleSave = async () => {
    if (!themeName.trim()) {
      setWarning('Please enter a theme name')
      return
    }
    
    // Don't save if there's a duplicate warning
    if (warning) {
      return
    }
    
    const trimmedName = themeName.trim()
    const type = generateTypeFromName(trimmedName)
    
    // Check if type is valid
    if (!type) {
      setWarning('Please enter a valid theme name')
      return
    }
    
    try {
      setIsLoading(true)
      setWarning(null)
      
      console.log('Creating theme:', { name: trimmedName, type })
      const newTheme = await apiService.createTheme({ name: trimmedName, type })
      
      // Success - update store and reset
      addThemeToStore(newTheme)
      setThemeName('')
      setIsAdding(false)
      
    } catch (err) {
      console.error('Error creating theme:', err)
      
      // Handle different error cases with user-friendly messages
      const errorMessage = err instanceof Error ? err.message.toLowerCase() : ''
      
      if (errorMessage.includes('already exists') || errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
        setWarning('A theme with this name already exists')
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
      setThemeName('')
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
    themeName,
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
