import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainContentTop } from '@/components/layout/MainContentTop'
import { MainContentBody } from '@/components/layout/MainContentBody'
import { GamePlayerCounter } from '@/components/functional/GamePlayerCounter'
import { WordRevealText, WordRevealCircle } from '@/components/functional/WordReveal'
import { useGameStore } from '@/stores'
import { TIMING } from '@/constants'

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
  
  // Reset UI states when component mounts to ensure clean state
  useEffect(() => {
    // Reset UI-only states that should not persist
    useGameStore.setState({ 
      isWordRevealed: false,
      circleScale: 1 
    })
    console.log('🔄 Game component mounted - UI states reset')
  }, []) // Only run on mount
  
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
    
    // Log theoretical positions (formulas only, no DOM measurements needed)
    console.log('🎨 === POSITIONING FORMULAS (on page load) ===')
    
    // Circle dimensions (in rem and px)
    const circleRadiusRem = 8  // w-64 = 16rem diameter, 8rem radius
    const circleRadiusPx = circleRadiusRem * 16  // 128px at default font size
    
    // Scales
    const scaleMin = 1.0
    const scaleMax = TIMING.SCALE_MAX  // 2.1
    
    // Calculate theoretical positions (relative to circle center as origin)
    console.log('📐 Position Formulas (relative to circle center):')
    console.log('1️⃣ Circle Center: Always at (0, 0) - this is our reference point')
    console.log(`2️⃣ Circle Top (before expand): Y = -${circleRadiusRem}rem = -${circleRadiusPx}px from center`)
    console.log(`3️⃣ Circle Top (after expand): Y = -${circleRadiusRem * scaleMax}rem = -${circleRadiusPx * scaleMax}px from center`)
    
    // Text position calculation
    const scaleIncrease = scaleMax - scaleMin
    const topMovementRem = scaleIncrease * circleRadiusRem
    const midpointRem = -circleRadiusRem - (topMovementRem / 2)
    const textHeightAdjustment = 0.75 // Adjustment to position TOP of text at midpoint
    const textOffsetRem = midpointRem + textHeightAdjustment
    const textOffsetPx = textOffsetRem * 16
    
    console.log(`4️⃣ Text TOP Position: Y = ${textOffsetRem}rem = ${textOffsetPx}px from center`)
    console.log(`   (TOP of text at midpoint between circle top at scale 1.0 and scale 2.1)`)
    console.log(`   Midpoint: ${midpointRem}rem, adjusted +${textHeightAdjustment}rem for text top`)
    
    console.log('\n📊 Summary:')
    console.log(`- Circle expands from ${scaleMin}x to ${scaleMax}x`)
    console.log(`- Circle top moves up by ${topMovementRem}rem (${topMovementRem * 16}px)`)
    console.log(`- Text TOP is positioned at the midpoint of this movement`)
    console.log(`- Text TOP offset from center: ${textOffsetRem}rem (${textOffsetPx}px)`)
    console.log('🎨 ================================')
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
