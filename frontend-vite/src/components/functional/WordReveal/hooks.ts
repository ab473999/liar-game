import { useState, useRef, useEffect } from 'react'
import { TIMING } from '@/constants'
import { logger } from '@/utils/logger'

interface UsePressAndHoldOptions {
  onComplete: () => void     // Called when held for required duration and released
  onHoldReached?: () => void  // Called when required duration is reached (while still holding)
  onPressStart?: () => void   // Called when press starts
  onPressEnd?: () => void     // Called when press ends (regardless of duration)
  onProgress?: (progress: number, elapsedMs: number) => void  // Called with progress (0 to 1) and elapsed time during hold
}

export const usePressAndHold = ({
  onComplete,
  onHoldReached,
  onPressStart,
  onPressEnd,
  onProgress
}: UsePressAndHoldOptions) => {
  const pressStartTime = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [isPressing, setIsPressing] = useState(false)
  const [progress, setProgress] = useState(0)  // Track progress from 0 to 1
  const holdReachedRef = useRef(false)  // Track if we've called onHoldReached
  
  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPressing) return // Prevent multiple simultaneous presses
    
    // Only prevent default for mouse events (touch events handled by touchAction: 'none')
    if ('button' in e) {
      e.preventDefault()
    }
    
    logger.log('⭕ Circle press started')
    setIsPressing(true)
    pressStartTime.current = Date.now()
    holdReachedRef.current = false  // Reset the flag
    setProgress(0)  // Reset progress
    
    // Call the onPressStart callback if provided
    if (onPressStart) {
      onPressStart()
    }
    
    // Animation frame loop for smooth progress updates
    const updateProgress = () => {
      if (!pressStartTime.current) return
      
      const elapsedMs = Date.now() - pressStartTime.current
      const currentProgress = Math.min(elapsedMs / TIMING.REVEAL_THRESHOLD, 1)
      
      setProgress(currentProgress)
      if (onProgress) {
        onProgress(currentProgress, elapsedMs)
      }
      
      // Check if we've reached the reveal threshold
      if (elapsedMs >= TIMING.REVEAL_THRESHOLD && !holdReachedRef.current) {
        logger.log(`✅ ${TIMING.REVEAL_THRESHOLD / 1000}s reached!`)
        holdReachedRef.current = true
        if (onHoldReached) {
          onHoldReached()
        }
      }
      
      // Continue animation if still pressing and not complete
      if (elapsedMs < TIMING.REVEAL_THRESHOLD) {
        animationFrameRef.current = requestAnimationFrame(updateProgress)
      }
    }
    
    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(updateProgress)
    
    // Log progress at specified intervals
    let elapsedCount = 0
    intervalRef.current = window.setInterval(() => {
      elapsedCount++
      const elapsed = elapsedCount * (TIMING.LOG_INTERVAL / 1000)
      logger.log(`⏱️ Holding... ${elapsed.toFixed(2)}s`)
    }, TIMING.LOG_INTERVAL)
  }
  
  const handlePressEnd = () => {
    if (!isPressing || !pressStartTime.current) return
    
    const holdDuration = Date.now() - pressStartTime.current
    logger.log(`⭕ Circle released after ${(holdDuration / 1000).toFixed(2)}s`)
    
    // Clear the interval
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    // Clear the animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    // Check if held for required duration
    if (holdDuration >= TIMING.REVEAL_THRESHOLD) {
      logger.log('✅ Advancing to next player!')
      onComplete()
    } else {
      logger.log(`❌ Not held long enough (${(holdDuration / 1000).toFixed(2)}s < ${TIMING.REVEAL_THRESHOLD / 1000}s)`)
    }
    
    // Reset state
    setIsPressing(false)
    pressStartTime.current = null
    setProgress(0)  // Reset progress
    
    // Call the onPressEnd callback if provided
    if (onPressEnd) {
      onPressEnd()
    }
  }
  
  const handlePressCancel = () => {
    if (!isPressing) return
    
    logger.log('❌ Circle press cancelled')
    
    // Clear the interval
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    // Clear the animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    // Reset state
    setIsPressing(false)
    pressStartTime.current = null
    setProgress(0)  // Reset progress
    
    // Call the onPressEnd callback if provided (treat cancel as an end)
    if (onPressEnd) {
      onPressEnd()
    }
  }
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])
  
  return {
    isPressing,
    progress,  // Return the progress value
    handlers: {
      onMouseDown: handlePressStart,
      onMouseUp: handlePressEnd,
      onMouseLeave: handlePressCancel,
      onTouchStart: handlePressStart,
      onTouchEnd: handlePressEnd,
      onTouchCancel: handlePressCancel
    }
  }
}
