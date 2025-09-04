import { useState, useRef, useEffect } from 'react'

interface UsePressAndHoldOptions {
  requiredDuration?: number  // Duration in ms (default: 1000)
  onComplete: () => void     // Called when held for required duration and released
  onHoldReached?: () => void  // Called when required duration is reached (while still holding)
  logInterval?: number        // Interval for progress logs in ms (default: 250)
  onPressStart?: () => void   // Called when press starts
  onPressEnd?: () => void     // Called when press ends (regardless of duration)
}

export const usePressAndHold = ({
  requiredDuration = 1000,
  onComplete,
  onHoldReached,
  logInterval = 250,
  onPressStart,
  onPressEnd
}: UsePressAndHoldOptions) => {
  const pressStartTime = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)
  const [isPressing, setIsPressing] = useState(false)
  const holdReachedRef = useRef(false)  // Track if we've called onHoldReached
  
  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPressing) return // Prevent multiple simultaneous presses
    
    // Only prevent default for mouse events (touch events handled by touchAction: 'none')
    if ('button' in e) {
      e.preventDefault()
    }
    
    console.log('⭕ Circle press started')
    setIsPressing(true)
    pressStartTime.current = Date.now()
    holdReachedRef.current = false  // Reset the flag
    
    // Call the onPressStart callback if provided
    if (onPressStart) {
      onPressStart()
    }
    
    // Log progress at specified intervals
    let elapsedCount = 0
    intervalRef.current = window.setInterval(() => {
      elapsedCount++
      const elapsed = elapsedCount * (logInterval / 1000)
      console.log(`⏱️ Holding... ${elapsed.toFixed(2)}s`)
      
      // Check if we've reached the required duration
      if (elapsed >= requiredDuration / 1000 && !holdReachedRef.current) {
        console.log('✅ 1 second reached!')
        holdReachedRef.current = true
        if (onHoldReached) {
          onHoldReached()  // Call the callback when duration is reached
        }
      }
    }, logInterval)
  }
  
  const handlePressEnd = () => {
    if (!isPressing || !pressStartTime.current) return
    
    const holdDuration = Date.now() - pressStartTime.current
    console.log(`⭕ Circle released after ${(holdDuration / 1000).toFixed(2)}s`)
    
    // Clear the interval
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    // Check if held for required duration
    if (holdDuration >= requiredDuration) {
      console.log('✅ Advancing to next player!')
      onComplete()
    } else {
      console.log(`❌ Not held long enough (${(holdDuration / 1000).toFixed(2)}s < ${requiredDuration / 1000}s)`)
    }
    
    // Reset state
    setIsPressing(false)
    pressStartTime.current = null
    
    // Call the onPressEnd callback if provided
    if (onPressEnd) {
      onPressEnd()
    }
  }
  
  const handlePressCancel = () => {
    if (!isPressing) return
    
    console.log('❌ Circle press cancelled')
    
    // Clear the interval
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    // Reset state
    setIsPressing(false)
    pressStartTime.current = null
    
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
    }
  }, [])
  
  return {
    isPressing,
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
