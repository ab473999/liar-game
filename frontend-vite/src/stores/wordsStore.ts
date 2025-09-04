import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Word } from '@/types'
import { logger } from '@/utils/logger'

interface WordsStore {
  // State
  words: Word[]
  currentThemeType: string | null
  lastFetched: number | null
  lastSynced: number | null
  isLoading: boolean
  isSyncing: boolean
  
  // Actions
  setWords: (words: Word[], themeType: string) => void
  syncWords: (backendWords: Word[], themeType: string) => void
  addWord: (word: Word) => void
  updateWord: (id: number, word: Word) => void
  removeWord: (id: number) => void
  clearWords: () => void
  setLoading: (loading: boolean) => void
  setSyncing: (syncing: boolean) => void
  
  // Helpers
  getWordById: (id: number) => Word | undefined
}

export const useWordsStore = create<WordsStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        words: [],
        currentThemeType: null,
        lastFetched: null,
        lastSynced: null,
        isLoading: false,
        isSyncing: false,
        
        // Actions
        setWords: (words, themeType) => {
          logger.log('WordsStore: setWords', words.length, 'words for theme:', themeType)
          set({ 
            words,
            currentThemeType: themeType,
            lastFetched: Date.now(),
            lastSynced: Date.now()
          })
        },
        
        syncWords: (backendWords, themeType) => {
          logger.log('WordsStore: syncWords - comparing', backendWords.length, 'backend words with', get().words.length, 'local words')
          
          // If theme changed, replace entirely
          if (get().currentThemeType !== themeType) {
            logger.log('WordsStore: Theme changed, replacing words')
            set({
              words: backendWords,
              currentThemeType: themeType,
              lastSynced: Date.now()
            })
            return
          }
          
          const localWords = get().words
          const localWordIds = new Set(localWords.map(w => w.id))
          const backendWordIds = new Set(backendWords.map(w => w.id))
          
          // Find words that were deleted from backend
          const deletedIds = localWords
            .filter(w => !backendWordIds.has(w.id))
            .map(w => w.id)
          
          // Find words that were added to backend
          const addedWords = backendWords
            .filter(w => !localWordIds.has(w.id))
          
          // Find words that may have been updated
          const updatedWords = backendWords
            .filter(w => {
              const localWord = localWords.find(lw => lw.id === w.id)
              return localWord && localWord.word !== w.word
            })
          
          // Apply changes if any differences found
          if (deletedIds.length > 0 || addedWords.length > 0 || updatedWords.length > 0) {
            logger.log('WordsStore: Sync changes detected:', {
              deleted: deletedIds.length,
              added: addedWords.length,
              updated: updatedWords.length
            })
            
            // Build the new words array
            let newWords = localWords
              .filter(w => !deletedIds.includes(w.id)) // Remove deleted words
              .map(w => {
                // Update modified words
                const updatedWord = updatedWords.find(uw => uw.id === w.id)
                return updatedWord || w
              })
            
            // Add new words
            newWords = [...newWords, ...addedWords]
            
            // Sort by id to maintain consistent order
            newWords.sort((a, b) => a.id - b.id)
            
            set({ 
              words: newWords,
              lastSynced: Date.now()
            })
          } else {
            logger.log('WordsStore: No sync changes needed')
            set({ lastSynced: Date.now() })
          }
        },
        
        addWord: (word) => {
          logger.log('WordsStore: addWord', word)
          const words = get().words
          set({ 
            words: [...words, word],
            lastFetched: Date.now()
          })
        },
        
        updateWord: (id, updatedWord) => {
          logger.log('WordsStore: updateWord', id, updatedWord)
          const words = get().words
          set({
            words: words.map(word => 
              word.id === id ? updatedWord : word
            ),
            lastFetched: Date.now()
          })
        },
        
        removeWord: (id) => {
          logger.log('WordsStore: removeWord', id)
          const words = get().words
          set({
            words: words.filter(word => word.id !== id),
            lastFetched: Date.now()
          })
        },
        
        clearWords: () => {
          logger.log('WordsStore: clearWords')
          set({
            words: [],
            currentThemeType: null,
            lastFetched: null,
            lastSynced: null
          })
        },
        
        setLoading: (loading) => {
          set({ isLoading: loading })
        },
        
        setSyncing: (syncing) => {
          set({ isSyncing: syncing })
        },
        
        // Helpers
        getWordById: (id) => {
          return get().words.find(word => word.id === id)
        }
      }),
      {
        name: 'liar-words-storage', // Key in localStorage
        partialize: (state) => ({
          words: state.words,
          currentThemeType: state.currentThemeType,
          lastFetched: state.lastFetched,
          lastSynced: state.lastSynced,
        }),
      }
    ),
    {
      name: 'words-store', // Name for Redux DevTools
    }
  )
)

// Subscribe to all state changes for debugging in dev
if (import.meta.env.DEV) {
  useWordsStore.subscribe((state) => {
    logger.log('WordsStore State Updated:', {
      wordsCount: state.words.length,
      themeType: state.currentThemeType,
      lastFetched: state.lastFetched ? new Date(state.lastFetched).toISOString() : null,
      lastSynced: state.lastSynced ? new Date(state.lastSynced).toISOString() : null,
      isLoading: state.isLoading,
      isSyncing: state.isSyncing
    })
  })
}
