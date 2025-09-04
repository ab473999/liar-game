import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useGameStore } from '@/stores'
import { usePressAndHold } from './hooks'

export const WordRevealCircle = () => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const circleButtonRef = useRef<HTMLButtonElement>(null)
  const [showHelpText, setShowHelpText] = useState(true)
  const helpTextTimerRef = useRef<number | null>(null)
  
  const { 
    currentPlayer, 
    playerNum,
    nextPlayer,
    revealWord
  } = useGameStore()
  
  const allPlayersRevealed = currentPlayer >= playerNum  // Show end buttons after all players have seen their words
  
  // Handle press start to hide help text after 250ms
  const handlePressStart = () => {
    if (helpTextTimerRef.current) {
      clearTimeout(helpTextTimerRef.current)
    }
    
    helpTextTimerRef.current = window.setTimeout(() => {
      setShowHelpText(false)
    }, 250)
  }
  
  // Handle press end to show help text again
  const handlePressEnd = () => {
    if (helpTextTimerRef.current) {
      clearTimeout(helpTextTimerRef.current)
      helpTextTimerRef.current = null
    }
    
    // Reset help text visibility for next interaction
    setShowHelpText(true)
  }
  
  // Use the press-and-hold hook
  const { handlers, progress } = usePressAndHold({
    requiredDuration: 1000,
    onComplete: nextPlayer,  // Called on release after 1s
    onHoldReached: revealWord,  // Called when 1s is reached
    logInterval: 250,
    onPressStart: handlePressStart,
    onPressEnd: handlePressEnd
  })
  
  // Calculate scale: from 1x to 2x based on progress (0 to 1)
  const scale = 1 + progress  // This will go from 1 to 2
  
  // Log dimensions whenever container renders/updates
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      console.log('🟦 WordRevealCircle dimensions:', {
        height: rect.height,
        width: rect.width,
        top: rect.top,
        bottom: rect.bottom,
        state: allPlayersRevealed ? 'all-revealed' : 'player-viewing'
      })
    }
    
    // Log circle button center position if it exists
    if (circleButtonRef.current && !allPlayersRevealed) {
      const buttonRect = circleButtonRef.current.getBoundingClientRect()
      const containerRect = containerRef.current?.getBoundingClientRect()
      console.log('🟢 Circle Button Center:', {
        centerX: buttonRect.left + buttonRect.width / 2,
        centerY: buttonRect.top + buttonRect.height / 2,
        width: buttonRect.width,
        height: buttonRect.height,
        relativeToContainer: containerRect ? {
          percentFromTop: ((buttonRect.top + buttonRect.height / 2 - containerRect.top) / containerRect.height * 100).toFixed(1) + '%',
          percentFromLeft: ((buttonRect.left + buttonRect.width / 2 - containerRect.left) / containerRect.width * 100).toFixed(1) + '%'
        } : null
      })
    }
  }) // Dependencies handled by React - this runs on every render
  
  // No auto-advance for last player - they need to see their word too!
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (helpTextTimerRef.current) {
        clearTimeout(helpTextTimerRef.current)
      }
    }
  }, [])
  
  // If all players have revealed, show the end game options
  if (allPlayersRevealed) {
    return (
      <div ref={containerRef} className="absolute inset-0 flex items-center justify-center border-4 border-blue-500">
        {/* Vertical dashed green line for design purposes */}
        <div 
          className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 border-l-2 border-dashed border-green-500"
          style={{ 
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        />
        <div className="flex gap-4 z-30">
          <button
            onClick={() => navigate('/')}
            className="p-4 bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg"
            aria-label="Back to Home"
          >
            <ArrowLeft size={24} />
          </button>
          
          <button
            onClick={() => {
              useGameStore.setState({ 
                currentPlayer: 0,
                revealedPlayers: [],
                isWordRevealed: false  // Reset reveal state for replay
              })
            }}
            className="p-4 bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg"
            aria-label="Repeat Reveal"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 flex items-center justify-center border-4 border-blue-500 pt-[100px] z-10"
      style={{ overflow: 'visible' }}  // Allow circle to overflow without clipping
    >
      {/* Vertical dashed green line for design purposes */}
      <div 
        className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 border-l-2 border-dashed border-green-500"
        style={{ 
          zIndex: 9999,
          pointerEvents: 'none'
        }}
      />
      
      {/* Next Player Button - Show for all players including last */}
      <button
        ref={circleButtonRef}
        {...handlers}
        className="w-64 h-64 rounded-full flex items-center justify-center z-30 select-none transition-transform"
        style={{ 
          backgroundColor: 'var(--color-circle-bg)',
          border: 'none',
          userSelect: 'none',
          touchAction: 'none',
          transform: `scale(${scale})`,  // Apply the scaling transform
          transformOrigin: 'center',  // Ensure it scales from center
          transition: 'none'  // No CSS transition, we're animating via JS
        }}
        aria-label="Next Player - Hold for 1 second"
      >
        {/* Help text that disappears after 0.25s of pressing */}
        {showHelpText && (
          <span 
            style={{ 
              color: 'var(--color-circlehelp-font)',
              fontSize: '1.5rem',
              fontWeight: 'normal',
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          >
            Press and hold
          </span>
        )}
      </button>
    </div>
  )
}
