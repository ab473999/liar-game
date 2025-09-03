import type { ReactNode } from 'react'

interface MainContentBodyProps {
  children: ReactNode
}

export const MainContentBody = ({ children }: MainContentBodyProps) => {
  return (
    <div className="flex-1 flex items-center justify-center border-2 border-yellow-500">
      {children}
    </div>
  )
}
