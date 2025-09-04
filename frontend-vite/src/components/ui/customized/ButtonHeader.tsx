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
 * - --color-iconbutton-bg: Background color
 * - --color-iconbutton-line: Icon/line color
 */
export const ButtonHeader = ({ onClick, children, ariaLabel, className = '' }: ButtonHeaderProps) => {
  return (
    <Button
      onClick={onClick}
      ariaLabel={ariaLabel}
      className={`p-2 rounded-lg ${className}`}
      style={{
        backgroundColor: 'var(--color-iconbutton-bg)',
        color: 'var(--color-iconbutton-line)',
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
