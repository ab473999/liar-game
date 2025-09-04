import { Plus } from 'lucide-react'
import { ButtonSave } from '@/components/ui/customized/ButtonSave'
import { useAddTheme } from './hooks'

export const AddTheme = () => {
  const {
    isAdding,
    themeName,
    isLoading,
    warning,
    inputRef,
    startAdding,
    handleInputChange,
    handleSave,
    handleKeyPress,
  } = useAddTheme()
  
  if (!isAdding) {
    return (
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={startAdding}
          className="flex items-center gap-2 px-2 py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{
            backgroundColor: 'var(--mainbutton-bg)',
            color: 'var(--font-primary)',
            border: 'none',
          }}
        >
          <Plus size={18} />
          <span className="text-sm">Add New Theme</span>
        </button>
        <p className="text-base opacity-60" style={{ color: 'var(--font-primary)' }}>
          Click on a theme to edit its word list
        </p>
      </div>
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
            backgroundColor: 'var(--mainbutton-bg)',
            color: 'var(--font-primary)',
            border: `1px solid ${warning ? 'var(--circle-help)' : 'var(--mainbutton-border)'}`,
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
        <p className="text-sm" style={{ color: 'var(--circle-help)' }}>
          {warning}
        </p>
      )}
    </div>
  )
}
