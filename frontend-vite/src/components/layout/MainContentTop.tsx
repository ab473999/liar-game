import type { ReactNode } from 'react'

interface MainContentTopProps {
  children: ReactNode
}

export const MainContentTop = ({ children }: MainContentTopProps) => {
  return (
    <div className="h-[169px] flex items-center justify-center">
      {children}
    </div>
  )
}
