import type { ReactNode } from 'react'
import { Header } from './Header'
import { MainContent } from './MainContent'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: 'var(--page-bg)',
        color: 'var(--font-primary)'
      }}
    >
      <Header />
      <MainContent>
        {children}
      </MainContent>
    </div>
  )
}
