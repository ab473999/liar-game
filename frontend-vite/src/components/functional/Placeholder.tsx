import { useEffect } from 'react'
import { useThemes, useWords } from '@/hooks/useApi'
import { logger } from '@/utils/logger'

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
      logger.log('✅ API Working - Themes loaded:', themes)
      logger.log(`Found ${themes.length} themes`)
    }
    if (themesError) {
      logger.error('❌ Themes API Error:', themesError)
    }
  }, [themes, themesLoading, themesError])

  useEffect(() => {
    if (!wordsLoading && words.length > 0) {
      logger.log('✅ API Working - Words loaded (animals):', words)
      logger.log(`Found ${words.length} words for animals theme`)
    }
    if (wordsError) {
      logger.error('❌ Words API Error:', wordsError)
    }
  }, [words, wordsLoading, wordsError])

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--header-font-logo)' }}>LIAR Game</h1>
        <p style={{ color: 'var(--font-secondary)' }}>Vite + React + TypeScript</p>
        <p className="text-sm mt-4" style={{ color: 'var(--font-secondary)' }}>Check console for API status</p>
        
        {/* Optional: Show API status in UI */}
        <div className="mt-8 text-xs" style={{ color: 'var(--font-secondary)' }}>
          {themesLoading ? (
            <p>Loading themes...</p>
          ) : themesError ? (
            <p style={{ color: 'var(--circle-help)' }}>API Error: {themesError}</p>
          ) : (
            <p style={{ color: 'var(--word-reveal)' }}>API Connected: {themes.length} themes loaded</p>
          )}
        </div>
      </div>
    </div>
  )
}
