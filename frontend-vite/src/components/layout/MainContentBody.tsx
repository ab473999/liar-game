import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface MainContentBodyProps {
  children: ReactNode
}

export const MainContentBody = ({ children }: MainContentBodyProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      console.log('🟪 MainContentBody (PINK) dimensions:', {
        height: rect.height,
        width: rect.width,
        top: rect.top,
        bottom: rect.bottom
      })
    }
  })
  
  return (
    <div ref={containerRef} className="flex-1 flex items-center justify-center border-4 border-pink-500 relative">
      {children}
    </div>
  )
}
