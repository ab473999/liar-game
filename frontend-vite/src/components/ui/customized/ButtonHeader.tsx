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
 * - --color-buttonicon-bg: Background color
 * - --color-buttonicon-line: Icon/line color
 */
export const ButtonHeader = ({ onClick, children, ariaLabel, className = '' }: ButtonHeaderProps) => {
  return (
    <Button
      onClick={onClick}
      ariaLabel={ariaLabel}
      className={`p-1 rounded-lg ${className}`}
      style={{
        backgroundColor: 'var(--color-buttonicon-bg)',
        color: 'var(--color-buttonicon-line)',
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
