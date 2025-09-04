import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useGameStore } from '@/stores'
import { usePressAndHold } from './hooks'
import { TIMING, calculateScale } from '@/constants'
import { logger } from '@/utils/logger'

export const WordRevealCircle = () => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const circleButtonRef = useRef<HTMLButtonElement>(null)
  const [showHelpText, setShowHelpText] = useState(true)
  const helpTextTimerRef = useRef<number | null>(null)
  const [scale, setScale] = useState(1)  // Track the scale value
  
  const { 
    currentPlayer, 
    playerNum,
    nextPlayer,
    revealWord,
    setCircleScale
  } = useGameStore()
  
  const allPlayersRevealed = currentPlayer >= playerNum  // Show end buttons after all players have seen their words
  
  // Handle press start to hide help text after TIMING.HELP_TEXT_HIDE_DELAY
  const handlePressStart = () => {
    if (helpTextTimerRef.current) {
      clearTimeout(helpTextTimerRef.current)
    }
    
    helpTextTimerRef.current = window.setTimeout(() => {
      setShowHelpText(false)
    }, TIMING.HELP_TEXT_HIDE_DELAY)
  }
  
  // Handle press end to show help text again
  const handlePressEnd = () => {
    if (helpTextTimerRef.current) {
      clearTimeout(helpTextTimerRef.current)
      helpTextTimerRef.current = null
    }
    
    // Reset help text visibility and scale for next interaction
    setShowHelpText(true)
    setScale(1)
    setCircleScale(1)  // Reset scale in store too
  }
  
  // Handle progress updates for scale animation
  const handleProgress = (_progress: number, elapsedMs: number) => {
    const newScale = calculateScale(elapsedMs)
    setScale(newScale)
    setCircleScale(newScale)  // Update store for WordRevealText to use
  }
  
  // Use the press-and-hold hook
  const { handlers } = usePressAndHold({
    onComplete: nextPlayer,  // Called on release after threshold
    onHoldReached: revealWord,  // Called when threshold is reached
    onPressStart: handlePressStart,
    onPressEnd: handlePressEnd,
    onProgress: handleProgress
  })
  
  // Log dimensions whenever container renders/updates
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      logger.log('🟦 WordRevealCircle dimensions:', {
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
      
      // Circle dimensions
      const circleRadius = buttonRect.width / 2  // 128px at default (256px diameter)
      const circleCenterX = buttonRect.left + circleRadius
      const circleCenterY = buttonRect.top + circleRadius
      
      // Calculate positions at different scales
      const scaleMin = 1.0
      const scaleMax = TIMING.SCALE_MAX  // 2.1
      
      // At scale 1.0 (before expanding)
      const circleTopBeforeExpanding = circleCenterY - circleRadius
      
      // At scale 2.1 (after expanding)
      const expandedRadius = circleRadius * scaleMax
      const circleTopAfterExpanding = circleCenterY - expandedRadius
      
      // Movement of the top
      const topMovement = circleTopBeforeExpanding - circleTopAfterExpanding
      
      logger.log('🎯 Circle Positioning Calculations:', {
        '1. Circle Center': {
          x: circleCenterX,
          y: circleCenterY,
          description: 'Center point stays fixed during scale'
        },
        '2. Circle Top (before expanding)': {
          y: circleTopBeforeExpanding,
          radius: circleRadius,
          scale: scaleMin,
          description: `Top at scale ${scaleMin}x`
        },
        '3. Circle Top (after expanding)': {
          y: circleTopAfterExpanding,
          radius: expandedRadius,
          scale: scaleMax,
          description: `Top at scale ${scaleMax}x`
        },
        'Movement': {
          topMovesUpBy: topMovement,
          description: `Top moves up ${topMovement}px when scaling from ${scaleMin}x to ${scaleMax}x`
        }
      })
      
      logger.log('🟢 Circle Button Center:', {
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
      <div ref={containerRef} className="absolute inset-0 flex items-center justify-center">
        <div className="flex gap-4 z-30">
          <button
            onClick={() => navigate('/')}
            className="p-4 transition-colors rounded-lg"
            style={{
              backgroundColor: 'var(--mainbutton-bg)',
              color: 'var(--mainbutton-icon)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            aria-label="Back to Home"
          >
            <ArrowLeft size={24} />
          </button>
          
          <button
            onClick={() => {
              useGameStore.setState({ 
                currentPlayer: 0,
                revealedPlayers: [],
                isWordRevealed: false,  // Reset reveal state for replay
                circleScale: 1  // Reset circle scale for replay
              })
            }}
            className="p-4 transition-colors rounded-lg"
            style={{
              backgroundColor: 'var(--mainbutton-bg)',
              color: 'var(--mainbutton-icon)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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
      className="absolute inset-0 flex items-center justify-center pt-[100px] z-10"
      style={{ overflow: 'visible' }}  // Allow circle to overflow without clipping
    >
      {/* Next Player Button - Show for all players including last */}
      <button
        ref={circleButtonRef}
        {...handlers}
        className="w-64 h-64 rounded-full flex items-center justify-center z-30 select-none transition-transform"
        style={{ 
          backgroundColor: 'var(--circle-bg)',
          border: scale >= TIMING.SCALE_MAX ? '1px solid var(--circle-border)' : 'none',
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
              color: 'var(--circle-help)',
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
