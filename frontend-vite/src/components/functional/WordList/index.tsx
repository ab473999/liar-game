import { useEffect } from 'react'
import { useWordsStore } from '@/stores'
import { apiService } from '@/services/api'
import { Row } from './Row'

interface WordListProps {
  themeType: string
  themeId: number
}

export const WordList = ({ themeType }: WordListProps) => {
  const words = useWordsStore((state) => state.words)
  const setWords = useWordsStore((state) => state.setWords)
  const syncWords = useWordsStore((state) => state.syncWords)
  const setLoading = useWordsStore((state) => state.setLoading)
  const setSyncing = useWordsStore((state) => state.setSyncing)
  const currentThemeType = useWordsStore((state) => state.currentThemeType)
  const lastSynced = useWordsStore((state) => state.lastSynced)
  const isLoading = useWordsStore((state) => state.isLoading)
  
  // Initial load: if we have no words or theme changed, do a full fetch
  useEffect(() => {
    if (words.length === 0 || currentThemeType !== themeType || !lastSynced) {
      const fetchWords = async () => {
        try {
          setLoading(true)
          const fetchedWords = await apiService.getWordsByTheme(themeType)
          setWords(fetchedWords, themeType)
        } catch (error) {
          console.error('Failed to fetch words:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchWords()
    }
  }, [themeType, currentThemeType, words.length, lastSynced, setWords, setLoading])
  
  // Background sync: always run this to catch backend changes
  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        setSyncing(true)
        console.log('WordList: Starting background sync with backend')
        const backendWords = await apiService.getWordsByTheme(themeType)
        syncWords(backendWords, themeType)
      } catch (error) {
        console.error('Failed to sync words with backend:', error)
      } finally {
        setSyncing(false)
      }
    }
    
    // Sync on mount
    syncWithBackend()
    
    // Optional: Set up periodic sync (every 30 seconds)
    const interval = setInterval(syncWithBackend, 30000)
    
    return () => clearInterval(interval)
  }, [themeType, syncWords, setSyncing])
  
  if (isLoading) {
    return (
      <div className="p-4 text-center" style={{ color: 'var(--font-secondary)' }}>
        Loading words...
      </div>
    )
  }
  
  if (words.length === 0) {
    return (
      <div className="p-4 text-center" style={{ color: 'var(--font-secondary)' }}>
        No words yet. Add your first word above!
      </div>
    )
  }
  
  return (
    <div className="w-full px-4">
      <div className="max-w-2xl mx-auto">
        {words.map((word) => (
          <Row key={word.id} word={word} />
        ))}
      </div>
    </div>
  )
}
