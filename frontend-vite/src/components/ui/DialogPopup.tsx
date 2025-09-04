import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface DialogPopupProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
  showCloseButton?: boolean
}

/**
 * Reusable dialog/modal component
 * Provides a backdrop and centered dialog with optional close button
 */
export const DialogPopup = ({ 
  isOpen, 
  onClose, 
  title,
  children,
  className = '',
  showCloseButton = true
}: DialogPopupProps) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  
  console.log('DialogPopup render:', {
    isOpen,
    title,
    className,
    hasChildren: !!children
  })

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden'
      
      // Log dialog dimensions when opened
      setTimeout(() => {
        if (dialogRef.current) {
          const rect = dialogRef.current.getBoundingClientRect()
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight
          const centerX = viewportWidth / 2
          const centerY = viewportHeight / 2
          const dialogCenterX = rect.left + (rect.width / 2)
          const dialogCenterY = rect.top + (rect.height / 2)
          
          console.log('DialogPopup position & centering:', {
            dialog: {
              top: rect.top,
              left: rect.left,
              right: rect.right,
              bottom: rect.bottom,
              width: rect.width,
              height: rect.height,
              centerX: dialogCenterX,
              centerY: dialogCenterY
            },
            viewport: {
              width: viewportWidth,
              height: viewportHeight,
              centerX: centerX,
              centerY: centerY
            },
            centering: {
              horizontalOffset: dialogCenterX - centerX,
              verticalOffset: dialogCenterY - centerY,
              isHorizontallyCentered: Math.abs(dialogCenterX - centerX) < 2,
              isVerticallyCentered: Math.abs(dialogCenterY - centerY) < 2
            },
            className: dialogRef.current.className
          })
        }
      }, 0)
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Handle clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Dialog */}
      <div 
        ref={dialogRef}
        className={`relative w-[80%] max-w-sm max-h-[80vh] overflow-auto rounded-lg ${className}`}
        style={{
          backgroundColor: 'var(--header-bg)',
          border: '1px solid var(--mainbutton-border)',
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2 border-b"
            style={{
              backgroundColor: 'var(--header-bg)',
              borderColor: 'var(--mainbutton-border)'
            }}
          >
            {title && (
              <h2 className="text-base font-medium" style={{ color: 'var(--font-primary)' }}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto p-0.5 rounded-lg transition-colors hover:opacity-80"
                style={{
                  color: 'var(--font-secondary)',
                  backgroundColor: 'transparent'
                }}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-2" ref={(el) => {
          if (el && isOpen) {
            setTimeout(() => {
              const rect = el.getBoundingClientRect()
              console.log('DialogPopup content area:', {
                position: { top: rect.top, left: rect.left },
                size: { width: rect.width, height: rect.height },
                padding: window.getComputedStyle(el).padding
              })
            }, 50)
          }
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}
