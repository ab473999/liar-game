import { ChevronUp, ChevronDown } from 'lucide-react'
import { useGameStore, MIN_PLAYERS, MAX_PLAYERS } from '@/stores'

export const PlayerCounter = () => {
  const { playerNum, incrementPlayerNum, decrementPlayerNum } = useGameStore()

  const handleIncrease = () => {
    incrementPlayerNum()
  }

  const handleDecrease = () => {
    decrementPlayerNum()
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={handleIncrease}
          className={`p-1 transition-colors ${
            playerNum >= MAX_PLAYERS 
              ? 'cursor-not-allowed opacity-40' 
              : 'hover:opacity-75'
          }`}
          style={{ 
            color: playerNum >= MAX_PLAYERS ? 'var(--font-secondary)' : 'var(--font-primary)',
            border: 'none',
            background: 'transparent'
          }}
          disabled={playerNum >= MAX_PLAYERS}
          aria-label="Increase players"
        >
          <ChevronUp size={24} />
        </button>
        
        <div className="text-3xl px-2 py-0 min-w-[60px] text-center" style={{ color: 'var(--font-primary)' }}>
          {playerNum}
        </div>
        
        <button
          type="button"
          onClick={handleDecrease}
          className={`p-1 transition-colors ${
            playerNum <= MIN_PLAYERS 
              ? 'cursor-not-allowed opacity-40' 
              : 'hover:opacity-75'
          }`}
          style={{ 
            color: playerNum <= MIN_PLAYERS ? 'var(--font-secondary)' : 'var(--font-primary)',
            border: 'none',
            background: 'transparent'
          }}
          disabled={playerNum <= MIN_PLAYERS}
          aria-label="Decrease players"
        >
          <ChevronDown size={24} />
        </button>
      </div>
      
      <span className="text-xl" style={{ color: 'var(--font-primary)' }}>players</span>
    </div>
  )
}
