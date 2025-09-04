import { useEffect, useRef } from 'react'
import { useGameStore } from '@/stores'

export const WordRevealText = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { 
    currentPlayer, 
    liarPosition, 
    word, 
    playerNum,
    isWordRevealed
  } = useGameStore()
  
  const isLiar = currentPlayer === liarPosition
  const allPlayersRevealed = currentPlayer >= playerNum  // Changed from > to >=
  
  // Log dimensions whenever container renders/updates
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      console.log('🟨 WordRevealText dimensions:', {
        height: rect.height,
        width: rect.width,
        top: rect.top,
        bottom: rect.bottom,
        state: allPlayersRevealed ? 'all-revealed' : 'player-viewing'
      })
    }
  })
  
  // Don't show text after all players revealed
  if (allPlayersRevealed) {
    return <div ref={containerRef} className="absolute inset-0 border-4 border-yellow-400 z-20 pointer-events-none" />
  }
  
  return (
    <div ref={containerRef} className="absolute inset-0 flex flex-col items-center border-4 border-yellow-400 pt-[60px] z-20 pointer-events-none">
      {/* Word/Liar Display - Only shown after 1s hold */}
      {isWordRevealed && (
        <div className="text-center">
          {isLiar ? (
            <h2 className="text-2xl font-light" style={{ color: 'var(--color-revealedtext-font)' }}>You're the liar</h2>
          ) : (
            <h2 className="text-2xl font-light" style={{ color: 'var(--color-revealedtext-font)' }}>{word}</h2>
          )}
        </div>
      )}
    </div>
  )
}
