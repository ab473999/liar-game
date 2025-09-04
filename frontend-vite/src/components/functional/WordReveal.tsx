import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useGameStore } from '@/stores'

export const WordReveal = () => {
  const navigate = useNavigate()
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
      <div className="relative flex flex-col items-center justify-center border-4 border-yellow-500 p-4 w-full h-full">
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
    <div className="relative flex flex-col items-center justify-center gap-8 border-4 border-yellow-500 p-4 w-full h-full">
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
          <div>
            <h2 className="text-3xl font-bold text-red-500 mb-2">You are the Liar!</h2>
            <p className="text-gray-400">Pretend you know the word</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-400 mb-2">The word is:</p>
            <h2 className="text-3xl font-bold">{word}</h2>
          </div>
        )}
      </div>
      
      {/* Next Player Button - Now a circle */}
      {!isLastPlayer && (
        <button
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
