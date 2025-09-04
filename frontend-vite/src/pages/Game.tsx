import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainContentTop } from '@/components/layout/MainContentTop'
import { MainContentBody } from '@/components/layout/MainContentBody'
import { GamePlayerCounter } from '@/components/functional/GamePlayerCounter'
import { WordRevealText, WordRevealCircle } from '@/components/functional/WordReveal'
import { useGameStore } from '@/stores'
import { logger } from '@/utils/logger'
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
    logger.log('🔄 Game component mounted - UI states reset')
  }, []) // Only run on mount
  
  // Check if we have valid game state, redirect to home if not
  useEffect(() => {
    // If any required game state is missing, redirect to home
    if (!theme || !word || liarPosition === -1) {
      logger.log('Missing game state, redirecting to home...')
      logger.log('Theme:', theme, 'Word:', word, 'Liar:', liarPosition)
      navigate('/', { replace: true }) // Replace history so back button doesn't come back here
      return
    }
    
    // Log game state when we have valid state
    logger.log('===== GAME STATE =====')
    logger.log('Player Count:', playerNum)
    logger.log('Selected Theme:', theme)
    logger.log('Selected Word:', word)
    logger.log('Liar is Player:', liarPosition + 1) // Add 1 for human-readable number
    logger.log('Current Player:', currentPlayer + 1)
    logger.log('=====================')
    
    // Log theoretical positions (formulas only, no DOM measurements needed)
    logger.log('🎨 === POSITIONING FORMULAS (on page load) ===')
    
    // Circle dimensions (in rem and px)
    const circleRadiusRem = 8  // w-64 = 16rem diameter, 8rem radius
    const circleRadiusPx = circleRadiusRem * 16  // 128px at default font size
    
    // Scales
    const scaleMin = 1.0
    const scaleMax = TIMING.SCALE_MAX  // 2.1
    
    // Calculate theoretical positions (relative to circle center as origin)
    logger.log('📐 Position Formulas (relative to circle center):')
    logger.log('1️⃣ Circle Center: Always at (0, 0) - this is our reference point')
    logger.log(`2️⃣ Circle Top (before expand): Y = -${circleRadiusRem}rem = -${circleRadiusPx}px from center`)
    logger.log(`3️⃣ Circle Top (after expand): Y = -${circleRadiusRem * scaleMax}rem = -${circleRadiusPx * scaleMax}px from center`)
    
    // Text position calculation
    const scaleIncrease = scaleMax - scaleMin
    const topMovementRem = scaleIncrease * circleRadiusRem
    const positionFraction = 0.3  // Position at 30% of the movement (closer to original)
    const offsetFromOriginal = topMovementRem * positionFraction
    const textPositionFromCenter = -circleRadiusRem - offsetFromOriginal
    const textHeightAdjustment = 0.75 // Adjustment to position TOP of text
    const textOffsetRem = textPositionFromCenter + textHeightAdjustment
    const textOffsetPx = textOffsetRem * 16
    
    logger.log(`4️⃣ Text TOP Position: Y = ${textOffsetRem}rem = ${textOffsetPx}px from center`)
    logger.log(`   (TOP of text at 30% between circle top at scale 1.0 and scale 2.1)`)
    logger.log(`   Position: ${textPositionFromCenter}rem, adjusted +${textHeightAdjustment}rem for text top`)
    
    logger.log('\n📊 Summary:')
    logger.log(`- Circle expands from ${scaleMin}x to ${scaleMax}x`)
    logger.log(`- Circle top moves up by ${topMovementRem}rem (${topMovementRem * 16}px)`)
    logger.log(`- Text TOP is positioned at 30% of this movement (closer to original circle)`)
    logger.log(`- Text TOP offset from center: ${textOffsetRem}rem (${textOffsetPx}px)`)
    logger.log('🎨 ================================')
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
