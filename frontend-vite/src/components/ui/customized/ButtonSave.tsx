import { Save } from 'lucide-react'
import { ButtonHeader } from './ButtonHeader'

interface ButtonSaveProps {
  onClick?: () => void
  ariaLabel?: string
  className?: string
  disabled?: boolean
}

/**
 * Save button component using the ButtonHeader base
 * Displays a save/checkmark icon
 */
export const ButtonSave = ({ 
  onClick, 
  ariaLabel = "Save", 
  className = '', 
  disabled = false 
}: ButtonSaveProps) => {
  return (
    <ButtonHeader
      onClick={disabled ? undefined : onClick}
      ariaLabel={ariaLabel}
      className={`${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <Save size={20} />
    </ButtonHeader>
  )
}
