import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/stores'

export const Game = () => {
  const navigate = useNavigate()
  
  // Get all relevant state from gameStore
  const { 
    playerNum, 
    theme, 
    word, 
    liarPosition 
  } = useGameStore()
  
  // Check if we have valid game state, redirect to home if not
  useEffect(() => {
    // If any required game state is missing, redirect to home
    if (!theme || !word || liarPosition === -1) {
      console.log('Missing game state, redirecting to home...')
      console.log('Theme:', theme, 'Word:', word, 'Liar:', liarPosition)
      navigate('/', { replace: true }) // Replace history so back button doesn't come back here
      return
    }
    
    // Log game state when we have valid state
    console.log('===== GAME STATE =====')
    console.log('Player Count:', playerNum)
    console.log('Selected Theme:', theme)
    console.log('Selected Word:', word)
    console.log('Liar is Player:', liarPosition)
    console.log('=====================')
  }, [playerNum, theme, word, liarPosition, navigate])
  
  // Don't render game UI if we don't have valid state
  if (!theme || !word || liarPosition === -1) {
    return null // Will redirect in useEffect
  }
  
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl mb-4">Game Ready!</h2>
        <p className="text-gray-400 mb-2">Theme: {theme}</p>
        <p className="text-gray-400 mb-2">Players: {playerNum}</p>
        <p className="text-xs text-gray-600 mt-8">
          (Game interface will be implemented here)
        </p>
      </div>
    </div>
  )
}
