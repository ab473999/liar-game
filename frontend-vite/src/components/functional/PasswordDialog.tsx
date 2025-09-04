import { useState, useRef, useEffect } from 'react'
import { DialogPopup } from '@/components/ui/DialogPopup'
import { KeyRound } from 'lucide-react'

interface PasswordDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (password: string) => void
  title?: string
  errorMessage?: string
}

/**
 * Password dialog component
 * Prompts user to enter a password to access protected features
 */
export const PasswordDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  title = "Enter password",
  errorMessage
}: PasswordDialogProps) => {
  const [password, setPassword] = useState('')
  const [showError, setShowError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])
  
  // Show error message when provided
  useEffect(() => {
    if (errorMessage) {
      setShowError(true)
      // Clear error after 3 seconds
      const timer = setTimeout(() => setShowError(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])
  
  // Reset when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setPassword('')
      setShowError(false)
    }
  }, [isOpen])
  
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (password.trim()) {
      onSubmit(password)
    }
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }
  
  return (
    <DialogPopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="bg-opacity-95"
      showCloseButton={true}
    >
      <div className="w-full space-y-2">
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="..."
            className="flex-1 px-4 py-2.5 rounded-lg text-lg box-border"
            style={{
              backgroundColor: 'var(--mainbutton-bg)',
              color: 'var(--font-primary)',
              border: '1px solid var(--mainbutton-border)',
            }}
          />
          <button
            onClick={handleSubmit}
            className="p-3 rounded-lg transition-opacity hover:opacity-80 flex items-center justify-center"
            style={{
              backgroundColor: 'var(--mainbutton-font)',
              color: 'var(--mainbutton-bg)',
              width: '48px',
              height: '48px'
            }}
            disabled={!password.trim()}
            aria-label="Submit password"
          >
            <KeyRound size={20} />
          </button>
        </div>
        
        {showError && errorMessage && (
          <div 
            className="text-sm text-center animate-pulse"
            style={{ color: 'var(--circle-help)' }}
          >
            {errorMessage}
          </div>
        )}
      </div>
    </DialogPopup>
  )
}
