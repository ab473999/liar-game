import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useGameStore } from '@/stores'

export const WordRevealCircle = () => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const circleButtonRef = useRef<HTMLButtonElement>(null)
  const pressStartTime = useRef<number | null>(null)
  const logInterval = useRef<number | null>(null)
  const [isPressing, setIsPressing] = useState(false)
  
  const { 
    currentPlayer, 
    playerNum,
    nextPlayer
  } = useGameStore()
  
  const isLastPlayer = currentPlayer === playerNum - 1
  const allPlayersRevealed = currentPlayer > playerNum - 1
  
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
    if (circleButtonRef.current && !isLastPlayer && !allPlayersRevealed) {
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
  })
  
  // Auto-advance after 1 second for the last player
  useEffect(() => {
    if (isLastPlayer) {
      const timer = setTimeout(() => {
        console.log('Last player timer complete, advancing to end game')
        nextPlayer()
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [isLastPlayer, nextPlayer])
  
  // Press-and-hold handlers
  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPressing) return // Prevent multiple simultaneous presses
    
    // Prevent default to avoid any scrolling or text selection
    e.preventDefault()
    
    console.log('⭕ Circle press started')
    setIsPressing(true)
    pressStartTime.current = Date.now()
    
    // Log progress every 250ms
    let elapsedCount = 0
    logInterval.current = window.setInterval(() => {
      elapsedCount++
      const elapsed = elapsedCount * 0.25
      console.log(`⏱️ Holding... ${elapsed.toFixed(2)}s`)
      
      if (elapsed >= 1) {
        console.log('✅ 1 second reached!')
      }
    }, 250)
  }
  
  const handlePressEnd = () => {
    if (!isPressing || !pressStartTime.current) return
    
    const holdDuration = Date.now() - pressStartTime.current
    console.log(`⭕ Circle released after ${(holdDuration / 1000).toFixed(2)}s`)
    
    // Clear the interval
    if (logInterval.current) {
      window.clearInterval(logInterval.current)
      logInterval.current = null
    }
    
    // Check if held for at least 1 second
    if (holdDuration >= 1000) {
      console.log('✅ Advancing to next player!')
      nextPlayer()
    } else {
      console.log(`❌ Not held long enough (${(holdDuration / 1000).toFixed(2)}s < 1s)`)
    }
    
    // Reset state
    setIsPressing(false)
    pressStartTime.current = null
  }
  
  const handlePressCancel = () => {
    if (!isPressing) return
    
    console.log('❌ Circle press cancelled')
    
    // Clear the interval
    if (logInterval.current) {
      window.clearInterval(logInterval.current)
      logInterval.current = null
    }
    
    // Reset state
    setIsPressing(false)
    pressStartTime.current = null
  }
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (logInterval.current) {
        window.clearInterval(logInterval.current)
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
        <div className="flex gap-4">
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
                revealedPlayers: []
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
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center border-4 border-blue-500 pt-[100px]">
      {/* Vertical dashed green line for design purposes */}
      <div 
        className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 border-l-2 border-dashed border-green-500"
        style={{ 
          zIndex: 9999,
          pointerEvents: 'none'
        }}
      />
      
      {/* Next Player Button - Circle centered horizontally, pushed 100px down */}
      {!isLastPlayer && (
        <button
          ref={circleButtonRef}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressCancel}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          onTouchCancel={handlePressCancel}
          className="w-20 h-20 rounded-full flex items-center justify-center z-10 select-none"
          style={{ 
            backgroundColor: 'var(--color-circle-bg)',
            border: 'none',
            userSelect: 'none',
            touchAction: 'none'
          }}
          aria-label="Next Player - Hold for 1 second"
        >
          {/* Empty circle - no text */}
        </button>
      )}
    </div>
  )
}
