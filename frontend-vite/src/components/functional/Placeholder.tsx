import { useEffect } from 'react'
import { useThemes, useWords } from '@/hooks/useApi'

/**
 * Placeholder component for initial development
 * Shows API connection status and basic app info
 * This will be replaced with actual game components
 */
export const Placeholder = () => {
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
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--color-header-title)' }}>LIAR Game</h1>
        <p style={{ color: 'var(--color-text-gray-400)' }}>Vite + React + TypeScript</p>
        <p className="text-sm mt-4" style={{ color: 'var(--color-text-gray-500)' }}>Check console for API status</p>
        
        {/* Optional: Show API status in UI */}
        <div className="mt-8 text-xs" style={{ color: 'var(--color-text-gray-600)' }}>
          {themesLoading ? (
            <p>Loading themes...</p>
          ) : themesError ? (
            <p style={{ color: 'var(--color-text-error)' }}>API Error: {themesError}</p>
          ) : (
            <p style={{ color: 'var(--color-text-success)' }}>API Connected: {themes.length} themes loaded</p>
          )}
        </div>
      </div>
    </div>
  )
}
