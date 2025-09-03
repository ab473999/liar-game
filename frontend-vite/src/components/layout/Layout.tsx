import type { ReactNode } from 'react'
import { Header } from './Header'
import { MainContent } from './MainContent'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <MainContent>
        {children}
      </MainContent>
    </div>
  )
}
