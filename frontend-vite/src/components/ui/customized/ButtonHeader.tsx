import type { ReactNode } from 'react'
import { Button } from '../Button'

interface ButtonHeaderProps {
  onClick?: () => void
  children: ReactNode
  ariaLabel?: string
  className?: string
}

/**
 * Header button component for navigation icons in the header
 * Uses CSS variables for theming:
 * - --header-icon: Icon color (same as header-font-logo)
 */
export const ButtonHeader = ({ onClick, children, ariaLabel, className = '' }: ButtonHeaderProps) => {
  return (
    <Button
      onClick={onClick}
      ariaLabel={ariaLabel}
      className={`p-1 rounded-lg ${className}`}
      style={{
        backgroundColor: 'transparent',
        color: 'var(--header-icon)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </Button>
  )
}
