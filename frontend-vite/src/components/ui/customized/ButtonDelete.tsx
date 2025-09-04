import { Trash2 } from 'lucide-react'
import { Button } from '../Button'

interface ButtonDeleteProps {
  onClick?: () => void
  ariaLabel?: string
  className?: string
  disabled?: boolean
}

/**
 * Delete button component
 * Displays a trash icon in red
 * Uses circle-help color (red) for the icon
 */
export const ButtonDelete = ({ 
  onClick, 
  ariaLabel = "Delete", 
  className = '', 
  disabled = false 
}: ButtonDeleteProps) => {
  return (
    <Button
      onClick={disabled ? undefined : onClick}
      ariaLabel={ariaLabel}
      className={`p-1 rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={{
        backgroundColor: 'transparent',
        color: 'var(--circle-help)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Trash2 size={20} />
    </Button>
  )
}
