import { useState, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { ButtonSave } from '@/components/ui/customized/ButtonSave'
import { apiService } from '@/services/api'
import { useThemesStore } from '@/stores'

export const AddTheme = () => {
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
  
  // Check for duplicate themes as user types
  const checkForDuplicates = (name: string) => {
    if (!name.trim()) {
      setWarning(null)
      return
    }
    
    const trimmedName = name.trim()
    const type = generateTypeFromName(trimmedName)
    
    // Check if a theme with this name or type already exists
    const duplicateName = themes.some(theme => 
      theme.name.toLowerCase() === trimmedName.toLowerCase()
    )
    
    const duplicateType = themes.some(theme => 
      theme.type === type
    )
    
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
  
  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => setIsAdding(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
        style={{
          backgroundColor: 'var(--color-buttonBg)',
          color: 'var(--color-textPrimary)',
          border: '1px solid var(--color-borderPrimary)',
        }}
      >
        <Plus size={20} />
        <span>Add New Theme</span>
      </button>
    )
  }
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={themeName}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Enter theme name..."
          disabled={isLoading}
          className="flex-1 px-3 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor: 'var(--color-inputBg)',
            color: 'var(--color-textPrimary)',
            border: `1px solid ${warning ? 'var(--color-accentDanger)' : 'var(--color-borderPrimary)'}`,
            opacity: isLoading ? 0.5 : 1,
          }}
        />
        <ButtonSave 
          onClick={handleSave} 
          disabled={isLoading || !themeName.trim() || !!warning}
          ariaLabel="Save theme"
        />
      </div>
      {warning && (
        <p className="text-sm" style={{ color: 'var(--color-accentDanger)' }}>
          {warning}
        </p>
      )}
    </div>
  )
}
