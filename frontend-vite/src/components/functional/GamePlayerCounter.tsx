import { useGameStore } from '@/stores'

export const GamePlayerCounter = () => {
  const { currentPlayer, playerNum } = useGameStore()
  
  // If all players have revealed, don't show the counter
  const allPlayersRevealed = currentPlayer >= playerNum  // Changed from > to >=
  
  if (allPlayersRevealed) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-4xl">🤔</div>
        <h1 className="text-2xl">Who's the liar?</h1>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-sm text-gray-400">Player</div>
      <div className="text-4xl font-bold">
        {currentPlayer + 1}/{playerNum}
      </div>
    </div>
  )
}
