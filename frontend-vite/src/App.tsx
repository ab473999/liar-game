import { useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { useThemes, useWords } from '@/hooks/useApi'

function App() {
  const { themes, loading: themesLoading, error: themesError } = useThemes()
  const { words, loading: wordsLoading, error: wordsError } = useWords('animals')

  // Log API results to console
  useEffect(() => {
    if (!themesLoading && themes.length > 0) {
      console.log('✅ API Working - Themes loaded:', themes)
      console.log(`Found ${themes.length} themes`)
    }
    if (themesError) {
      console.error('❌ Themes API Error:', themesError)
    }
  }, [themes, themesLoading, themesError])

  useEffect(() => {
    if (!wordsLoading && words.length > 0) {
      console.log('✅ API Working - Words loaded (animals):', words)
      console.log(`Found ${words.length} words for animals theme`)
    }
    if (wordsError) {
      console.error('❌ Words API Error:', wordsError)
    }
  }, [words, wordsLoading, wordsError])

  return (
    <Layout>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-blue-400 mb-4">LIAR Game</h1>
          <p className="text-gray-400">Vite + React + TypeScript</p>
          <p className="text-sm text-gray-500 mt-4">Check console for API status</p>
        </div>
      </div>
    </Layout>
  )
}

export default App