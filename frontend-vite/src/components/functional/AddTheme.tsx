import { useState, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { ButtonSave } from '@/components/ui/customized/ButtonSave'
import { apiService } from '@/services/api'
import { useThemes } from '@/hooks/useApi'

export const AddTheme = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [themeName, setThemeName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { refetch } = useThemes() // To refresh themes list after adding
  
  // Focus input when entering add mode
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAdding])
  
  // Generate type from name (lowercase, replace spaces/special chars with underscores)
  const generateTypeFromName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_') // Replace non-alphanumeric with underscore
      .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
      .replace(/_+/g, '_') // Replace multiple underscores with single
  }
  
  const handleSave = async () => {
    if (!themeName.trim()) {
      setError('Theme name cannot be empty')
      return
    }
    
    try {
      setIsLoading(true)
      setError(null)
      
      const type = generateTypeFromName(themeName)
      
      // Check if type is valid
      if (!type) {
        setError('Invalid theme name')
        return
      }
      
      console.log('Creating theme:', { name: themeName, type })
      await apiService.createTheme({ name: themeName, type })
      
      // Success - reset and refresh
      setThemeName('')
      setIsAdding(false)
      await refetch() // Refresh the themes list
      
    } catch (err) {
      console.error('Error creating theme:', err)
      setError(err instanceof Error ? err.message : 'Failed to create theme')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleCancel = () => {
    setThemeName('')
    setIsAdding(false)
    setError(null)
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
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
          onChange={(e) => {
            setThemeName(e.target.value)
            setError(null) // Clear error on typing
          }}
          onKeyDown={handleKeyPress}
          placeholder="Enter theme name..."
          disabled={isLoading}
          className="flex-1 px-3 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor: 'var(--color-inputBg)',
            color: 'var(--color-textPrimary)',
            border: `1px solid ${error ? 'var(--color-accentDanger)' : 'var(--color-borderPrimary)'}`,
            opacity: isLoading ? 0.5 : 1,
          }}
        />
        <ButtonSave 
          onClick={handleSave} 
          disabled={isLoading || !themeName.trim()}
          ariaLabel="Save theme"
        />
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="px-3 py-2 text-sm rounded-lg transition-opacity hover:opacity-80"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--color-textSecondary)',
            border: '1px solid var(--color-borderPrimary)',
          }}
        >
          Cancel
        </button>
      </div>
      {error && (
        <p className="text-sm" style={{ color: 'var(--color-accentDanger)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
