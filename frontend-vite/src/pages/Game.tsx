import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainContentTop } from '@/components/layout/MainContentTop'
import { MainContentBody } from '@/components/layout/MainContentBody'
import { GamePlayerCounter } from '@/components/functional/GamePlayerCounter'
import { WordRevealText } from '@/components/functional/WordRevealText'
import { WordRevealCircle } from '@/components/functional/WordRevealCircle'
import { useGameStore } from '@/stores'

export const Game = () => {
  const navigate = useNavigate()
  
  // Get all relevant state from gameStore
  const { 
    playerNum, 
    theme, 
    word, 
    liarPosition,
    currentPlayer
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
    console.log('Liar is Player:', liarPosition + 1) // Add 1 for human-readable number
    console.log('Current Player:', currentPlayer + 1)
    console.log('=====================')
  }, [playerNum, theme, word, liarPosition, currentPlayer, navigate])
  
  // Don't render game UI if we don't have valid state
  if (!theme || !word || liarPosition === -1) {
    return null // Will redirect in useEffect
  }
  
  return (
    <>
      <MainContentTop>
        <GamePlayerCounter />
      </MainContentTop>
      <MainContentBody>
        <WordRevealText />
        <WordRevealCircle />
      </MainContentBody>
    </>
  )
}
