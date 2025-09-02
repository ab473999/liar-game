"use client";
import Link from 'next/link';

/**
 * Reusable icon button component that can be either a button or a link
 * 
 * Props:
 * - icon: ReactElement - The icon component to display
 * - onClick?: Function - Click handler (for buttons)
 * - href?: string - Link destination (for links)
 * - ariaLabel: string - Accessibility label
 * - variant?: 'primary' | 'secondary' | 'danger' - Style variant
 * - size?: 'sm' | 'md' | 'lg' - Size variant
 */
export const IconButton = ({ 
  icon, 
  onClick, 
  href, 
  ariaLabel, 
  variant = 'secondary',
  size = 'md',
  className = '',
  ...props 
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-accentPrimary)',
      color: 'var(--color-textPrimary)',
      border: '1px solid var(--color-accentPrimary)'
    },
    secondary: {
      backgroundColor: 'var(--color-inputBg)',
      color: 'var(--color-textPrimary)',
      border: '1px solid var(--color-borderSecondary)'
    },
    danger: {
      backgroundColor: 'var(--color-accentDanger)',
      color: 'var(--color-textOnPrimary)',
      border: '1px solid var(--color-accentDanger)'
    }
  };

  const baseClasses = `${sizeClasses[size]} rounded-lg transition-colors hover:opacity-75 inline-flex items-center justify-center ${className}`;
  const style = variantStyles[variant];

  // If it's a link
  if (href) {
    return (
      <Link
        href={href}
        className={baseClasses}
        style={style}
        aria-label={ariaLabel}
        {...props}
      >
        {icon}
      </Link>
    );
  }

  // If it's a button
  return (
    <button
      onClick={onClick}
      className={baseClasses}
      style={style}
      aria-label={ariaLabel}
      {...props}
    >
      {icon}
    </button>
  );
};
