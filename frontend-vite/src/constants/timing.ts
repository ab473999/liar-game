/**
 * Centralized timing constants for the word reveal animation
 */

export const TIMING = {
  // Duration before help text disappears when pressing starts
  HELP_TEXT_HIDE_DELAY: 250, // 0.25s
  
  // Scale animation timing
  SCALE_START_DELAY: 250,    // 0.25s - when scale animation starts
  SCALE_DURATION: 500,        // 0.5s - how long scale animation lasts
  SCALE_END_TIME: 750,        // 0.75s - when scale animation ends (START + DURATION)
  
  // Word reveal and advancement threshold
  REVEAL_THRESHOLD: 750,      // 0.75s - when word is revealed and player can advance
  
  // Progress logging interval
  LOG_INTERVAL: 250,          // 0.25s - how often to log progress
  
  // Scale factors
  SCALE_MIN: 1.0,             // Starting scale (100%)
  SCALE_MAX: 2.1,             // Maximum scale (210%)
} as const

// Helper function to calculate scale based on progress
export const calculateScale = (elapsedMs: number): number => {
  // No scaling before SCALE_START_DELAY
  if (elapsedMs < TIMING.SCALE_START_DELAY) {
    return TIMING.SCALE_MIN
  }
  
  // Calculate progress within the scale animation window
  const scaleProgress = Math.min(
    (elapsedMs - TIMING.SCALE_START_DELAY) / TIMING.SCALE_DURATION,
    1.0
  )
  
  // Linear interpolation from SCALE_MIN to SCALE_MAX
  return TIMING.SCALE_MIN + (TIMING.SCALE_MAX - TIMING.SCALE_MIN) * scaleProgress
}
