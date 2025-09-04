import { Save } from 'lucide-react'
import { IconButton } from './IconButton'

interface SaveButtonProps {
  onClick?: () => void
  ariaLabel?: string
  className?: string
  disabled?: boolean
}

/**
 * Save button component using the IconButton base
 * Displays a save/checkmark icon
 */
export const SaveButton = ({ 
  onClick, 
  ariaLabel = "Save", 
  className = '', 
  disabled = false 
}: SaveButtonProps) => {
  return (
    <IconButton
      onClick={onClick}
      ariaLabel={ariaLabel}
      className={`${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <Save size={20} />
    </IconButton>
  )
}
