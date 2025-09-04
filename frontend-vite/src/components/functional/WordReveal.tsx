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
      <div className="flex flex-col items-center">
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
    <div className="flex flex-col items-center gap-8">
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
      
      {/* Next Player Button */}
      {!isLastPlayer && (
        <button
          onClick={nextPlayer}
          className="px-8 py-4 bg-green-600 hover:bg-green-500 transition-colors rounded-lg text-lg"
        >
          Next Player
        </button>
      )}
    </div>
  )
}
