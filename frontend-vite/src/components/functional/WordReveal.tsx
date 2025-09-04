import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useGameStore } from '@/stores'

export const WordReveal = () => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const circleButtonRef = useRef<HTMLButtonElement>(null)
  const { 
    currentPlayer, 
    liarPosition, 
    word, 
    playerNum,
    nextPlayer
  } = useGameStore()
  
  const isLiar = currentPlayer === liarPosition
  const isLastPlayer = currentPlayer === playerNum - 1
  const allPlayersRevealed = currentPlayer > playerNum - 1
  
  // Log dimensions whenever container renders/updates
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const parentRect = containerRef.current.parentElement?.getBoundingClientRect()
      console.log('🟨 WordReveal (YELLOW) dimensions:', {
        height: rect.height,
        width: rect.width,
        top: rect.top,
        bottom: rect.bottom,
        state: allPlayersRevealed ? 'all-revealed' : 'player-viewing'
      })
      if (parentRect) {
        console.log('📊 Height comparison:', {
          yellowHeight: rect.height,
          pinkHeight: parentRect.height,
          heightDiff: Math.abs(rect.height - parentRect.height),
          matchesParent: Math.abs(rect.height - parentRect.height) < 1 ? '✅ YES' : '❌ NO'
        })
      }
    }
    
    // Log circle button center position if it exists
    if (circleButtonRef.current && !isLastPlayer && !allPlayersRevealed) {
      const buttonRect = circleButtonRef.current.getBoundingClientRect()
      const containerRect = containerRef.current?.getBoundingClientRect()
      console.log('🟢 Green Circle Button Center:', {
        centerX: buttonRect.left + buttonRect.width / 2,
        centerY: buttonRect.top + buttonRect.height / 2,
        width: buttonRect.width,
        height: buttonRect.height,
        relativeToContainer: containerRect ? {
          centerXRelative: (buttonRect.left + buttonRect.width / 2) - containerRect.left,
          centerYRelative: (buttonRect.top + buttonRect.height / 2) - containerRect.top,
          percentFromTop: ((buttonRect.top + buttonRect.height / 2 - containerRect.top) / containerRect.height * 100).toFixed(1) + '%',
          percentFromLeft: ((buttonRect.left + buttonRect.width / 2 - containerRect.left) / containerRect.width * 100).toFixed(1) + '%'
        } : null
      })
    }
  }) // Dependencies handled by React - this runs on every render
  
  // Auto-advance after 1 second for the last player
  useEffect(() => {
    if (isLastPlayer) {
      const timer = setTimeout(() => {
        console.log('Last player timer complete, advancing to end game')
        nextPlayer() // This will increment currentPlayer to playerNum, making allPlayersRevealed true
      }, 1000) // 1 second delay
      
      return () => clearTimeout(timer)
    }
  }, [isLastPlayer, nextPlayer])
  
  // If all players have revealed, show the end game options
  if (allPlayersRevealed) {
    return (
      <div ref={containerRef} className="relative flex flex-col items-center border-4 border-yellow-400 self-stretch w-full pt-[50px]">
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
            onClick={() => {
              // Navigate back to home
              navigate('/')
            }}
            className="p-4 bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg"
            aria-label="Back to Home"
          >
            <ArrowLeft size={24} />
          </button>
          
          <button
            onClick={() => {
              // Reset to first player but keep same setup
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
    <div ref={containerRef} className="relative flex flex-col items-center gap-8 border-4 border-yellow-400 self-stretch w-full pt-[50px]">
      {/* Vertical dashed green line for design purposes */}
      <div 
        className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 border-l-2 border-dashed border-green-500"
        style={{ 
          zIndex: 9999,
          pointerEvents: 'none'
        }}
      />
      
      {/* Word/Liar Display */}
      <div className="text-center">
        {isLiar ? (
          <h2 className="text-3xl text-red-500">You're the liar</h2>
        ) : (
          <h2 className="text-2xl">{word}</h2>
        )}
      </div>
      
      {/* Next Player Button - Now a circle */}
      {!isLastPlayer && (
        <button
          ref={circleButtonRef}
          onClick={nextPlayer}
          className="w-20 h-20 bg-green-600 hover:bg-green-500 transition-colors rounded-full flex items-center justify-center"
          aria-label="Next Player"
        >
          {/* Empty circle - no text */}
        </button>
      )}
    </div>
  )
}
