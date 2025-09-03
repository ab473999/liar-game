import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

export const PlayerCounter = () => {
  const [playerNum, setPlayerNum] = useState(4)
  const min = 3
  const max = 20

  const handleIncrease = () => {
    const newPlayerNum = Math.min(max, playerNum + 1)
    setPlayerNum(newPlayerNum)
  }

  const handleDecrease = () => {
    const newPlayerNum = Math.max(min, playerNum - 1)
    setPlayerNum(newPlayerNum)
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={handleIncrease}
          className={`p-1 transition-colors ${
            playerNum >= max 
              ? 'cursor-not-allowed opacity-40' 
              : 'hover:opacity-75'
          }`}
          style={{ 
            color: playerNum >= max ? 'var(--color-textMuted)' : 'var(--color-textPrimary)',
            border: 'none',
            background: 'transparent'
          }}
          disabled={playerNum >= max}
          aria-label="Increase players"
        >
          <ChevronUp size={24} />
        </button>
        
        <div className="text-3xl px-2 py-0 min-w-[60px] text-center">
          {playerNum}
        </div>
        
        <button
          type="button"
          onClick={handleDecrease}
          className={`p-1 transition-colors ${
            playerNum <= min 
              ? 'cursor-not-allowed opacity-40' 
              : 'hover:opacity-75'
          }`}
          style={{ 
            color: playerNum <= min ? 'var(--color-textMuted)' : 'var(--color-textPrimary)',
            border: 'none',
            background: 'transparent'
          }}
          disabled={playerNum <= min}
          aria-label="Decrease players"
        >
          <ChevronDown size={24} />
        </button>
      </div>
      
      <span className="text-xl">players</span>
    </div>
  )
}
