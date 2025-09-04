import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { logger } from '@/utils/logger'

interface MainContentBodyProps {
  children: ReactNode
}

export const MainContentBody = ({ children }: MainContentBodyProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      logger.log('🟪 MainContentBody (PINK) dimensions:', {
        height: rect.height,
        width: rect.width,
        top: rect.top,
        bottom: rect.bottom
      })
    }
  })
  
  return (
    <div ref={containerRef} className="flex-1 flex items-center justify-center relative">
      {children}
    </div>
  )
}
