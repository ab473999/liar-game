import { useEffect, useRef } from 'react'
import { useGameStore } from '@/stores'

export const WordRevealText = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { 
    currentPlayer, 
    liarPosition, 
    word, 
    playerNum,
    isWordRevealed,
    circleScale
  } = useGameStore()
  
  const isLiar = currentPlayer === liarPosition
  const allPlayersRevealed = currentPlayer >= playerNum  // Changed from > to >=
  
  // Calculate text position based on circle scale
  // Circle radius is 8rem (128px at default font size)
  // At scale 1.0 to SCALE_MAX, the top of circle moves up by (scale - 1) * 8rem
  const calculateTextOffset = () => {
    // How much the circle radius increases
    const scaleIncrease = circleScale - 1
    // How much the top of the circle moves up (in rem units)
    const topMovement = scaleIncrease * 8
    
    // Instead of midpoint (0.5), position text at 30% of the movement
    // This places text closer to the original circle position (lower)
    const positionFraction = 0.3  // 30% of the way from original to expanded
    const offsetFromOriginal = topMovement * positionFraction
    
    // Position where we want the text (from center)
    const textPositionFromCenter = -8 - offsetFromOriginal
    
    // Adjust for text TOP positioning (text appears below the position line)
    const textHeightAdjustment = 0.75 // Approximate half height of text in rem
    return textPositionFromCenter + textHeightAdjustment
  }
  
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
      
      // Calculate and log text position when not all players revealed
      if (!allPlayersRevealed) {
        // Get center of the container (same as circle center)
        const containerCenterY = rect.top + rect.height / 2
        
        // Calculate text position based on formula
        // We're using rem units in the component: translateY(${calculateTextOffset()}rem)
        // The text offset calculation returns the Y translation in rem
        // Convert rem to px (1rem = 16px by default)
        const remToPx = 16
        const textOffsetRem = calculateTextOffset()
        const textPositionY = containerCenterY + (textOffsetRem * remToPx)
        
        console.log('📝 Text Positioning Calculation:', {
          '4. Text Position (TOP of text)': {
            y: textPositionY,
            offsetFromCenter: textOffsetRem + 'rem (' + (textOffsetRem * remToPx) + 'px)',
            circleScale: circleScale,
            description: `TOP of text positioned at 30% between circle top at scale 1.0 and scale ${circleScale.toFixed(1)}`
          },
          'Formula Details': {
            containerCenterY: containerCenterY,
            scaleIncrease: circleScale - 1,
            circleRadiusRem: 8,
            topMovementRem: (circleScale - 1) * 8,
            positionFraction: 0.3,
            offsetFromOriginal: (circleScale - 1) * 8 * 0.3,
            textHeightAdjustment: '+0.75rem (to position TOP of text)',
            finalTextOffset: textOffsetRem,
            description: 'Text TOP = Center + (-8rem - 30% of movement) + 0.75rem adjustment'
          }
        })
      }
    }
  })
  
  // Don't show text after all players revealed
  if (allPlayersRevealed) {
    return <div ref={containerRef} className="absolute inset-0 z-20 pointer-events-none" />
  }
  
  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      {/* Word/Liar Display - Only shown after 1s hold */}
      {isWordRevealed && (
        <div 
          className="absolute text-center"
          style={{ 
            transform: `translateY(${calculateTextOffset()}rem)`,
            transition: 'none'  // No transition since we're animating via the scale updates
          }}
        >
          {isLiar ? (
            <h2 className="text-2xl font-light" style={{ color: 'var(--word-reveal)' }}>You're the liar</h2>
          ) : (
            <h2 className="text-2xl font-light" style={{ color: 'var(--word-reveal)' }}>{word}</h2>
          )}
        </div>
      )}
    </div>
  )
}
