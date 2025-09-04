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
            backgroundColor: 'var(--color-buttonBg)',
            color: 'var(--color-textPrimary)',
            border: '1px solid var(--color-borderPrimary)',
          }}
        >
          <Plus size={18} />
          <span className="text-sm">Add New Theme</span>
        </button>
        <p className="text-xs opacity-60" style={{ color: 'var(--color-textSecondary)' }}>
          Or click on an existing theme to edit its word list
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
