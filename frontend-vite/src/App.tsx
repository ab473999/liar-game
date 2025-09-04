import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { Game } from '@/pages/Game'
import { Settings } from '@/pages/Settings'
import { ThemeSettings } from '@/pages/ThemeSettings'

/**
 * Main App Component
 * Acts as the central router and orchestrator
 * Wraps all content in the Layout component
 */
function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/:theme" element={<ThemeSettings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App