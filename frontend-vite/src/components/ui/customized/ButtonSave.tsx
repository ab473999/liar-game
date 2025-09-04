import { Save } from 'lucide-react'
import { Button } from '../Button'

interface ButtonSaveProps {
  onClick?: () => void
  ariaLabel?: string
  className?: string
  disabled?: boolean
}

/**
 * Save button component
 * Displays a save/checkmark icon
 * Uses gray color when disabled, blue when active
 */
export const ButtonSave = ({ 
  onClick, 
  ariaLabel = "Save", 
  className = '', 
  disabled = false 
}: ButtonSaveProps) => {
  return (
    <Button
      onClick={disabled ? undefined : onClick}
      ariaLabel={ariaLabel}
      className={`p-1 rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={{
        backgroundColor: 'transparent',
        color: disabled ? 'var(--color-buttonsave-line-inactive)' : 'var(--color-buttonicon-line)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Save size={20} />
    </Button>
  )
}
