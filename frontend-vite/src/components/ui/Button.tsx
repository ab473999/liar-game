import type { ReactNode, CSSProperties } from 'react'

interface ButtonProps {
  onClick?: () => void
  children: ReactNode
  ariaLabel?: string
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  style?: CSSProperties
}

/**
 * Base button component for all buttons in the app
 * Can be extended with custom styles and behaviors
 */
export const Button = ({ 
  onClick, 
  children, 
  ariaLabel, 
  className = '',
  disabled = false,
  type = 'button',
  style = {}
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'} ${className}`}
      style={style}
    >
      {children}
    </button>
  )
}
