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
        backgroundColor: 'var(--color-layout-bg)',
        color: 'var(--color-layout-text)'
      }}
    >
      <Header />
      <MainContent>
        {children}
      </MainContent>
    </div>
  )
}
