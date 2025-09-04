import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Theme } from '@/types'

interface ThemesStore {
  // State
  themes: Theme[]
  lastFetched: number | null
  lastSynced: number | null
  isLoading: boolean
  isSyncing: boolean
  
  // Actions
  setThemes: (themes: Theme[]) => void
  syncThemes: (backendThemes: Theme[]) => void
  addTheme: (theme: Theme) => void
  updateTheme: (id: number, theme: Theme) => void
  removeTheme: (id: number) => void
  setLoading: (loading: boolean) => void
  setSyncing: (syncing: boolean) => void
  
  // Helpers
  getThemeByType: (type: string) => Theme | undefined
  getThemeByName: (name: string) => Theme | undefined
}

export const useThemesStore = create<ThemesStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        themes: [],
        lastFetched: null,
        lastSynced: null,
        isLoading: false,
        isSyncing: false,
        
        // Actions
        setThemes: (themes) => {
          console.log('ThemesStore: setThemes', themes.length, 'themes')
          set({ 
            themes,
            lastFetched: Date.now(),
            lastSynced: Date.now()
          })
        },
        
        syncThemes: (backendThemes) => {
          console.log('ThemesStore: syncThemes - comparing', backendThemes.length, 'backend themes with', get().themes.length, 'local themes')
          
          const localThemes = get().themes
          const localThemeIds = new Set(localThemes.map(t => t.id))
          const backendThemeIds = new Set(backendThemes.map(t => t.id))
          
          // Find themes that were deleted from backend
          const deletedIds = localThemes
            .filter(t => !backendThemeIds.has(t.id))
            .map(t => t.id)
          
          // Find themes that were added to backend
          const addedThemes = backendThemes
            .filter(t => !localThemeIds.has(t.id))
          
          // Find themes that may have been updated
          const updatedThemes = backendThemes
            .filter(t => {
              const localTheme = localThemes.find(lt => lt.id === t.id)
              return localTheme && (localTheme.name !== t.name || localTheme.type !== t.type)
            })
          
          // Apply changes if any differences found
          if (deletedIds.length > 0 || addedThemes.length > 0 || updatedThemes.length > 0) {
            console.log('ThemesStore: Sync changes detected:', {
              deleted: deletedIds.length,
              added: addedThemes.length,
              updated: updatedThemes.length
            })
            
            // Build the new themes array
            let newThemes = localThemes
              .filter(t => !deletedIds.includes(t.id)) // Remove deleted themes
              .map(t => {
                // Update modified themes
                const updatedTheme = updatedThemes.find(ut => ut.id === t.id)
                return updatedTheme || t
              })
            
            // Add new themes
            newThemes = [...newThemes, ...addedThemes]
            
            // Sort by id to maintain consistent order
            newThemes.sort((a, b) => a.id - b.id)
            
            set({ 
              themes: newThemes,
              lastSynced: Date.now()
            })
          } else {
            console.log('ThemesStore: No sync changes needed')
            set({ lastSynced: Date.now() })
          }
        },
        
        addTheme: (theme) => {
          console.log('ThemesStore: addTheme', theme)
          const themes = get().themes
          set({ 
            themes: [...themes, theme],
            lastFetched: Date.now()
          })
        },
        
        updateTheme: (id, updatedTheme) => {
          console.log('ThemesStore: updateTheme', id, updatedTheme)
          const themes = get().themes
          set({
            themes: themes.map(theme => 
              theme.id === id ? updatedTheme : theme
            ),
            lastFetched: Date.now()
          })
        },
        
        removeTheme: (id) => {
          console.log('ThemesStore: removeTheme', id)
          const themes = get().themes
          set({
            themes: themes.filter(theme => theme.id !== id),
            lastFetched: Date.now()
          })
        },
        
        setLoading: (loading) => {
          set({ isLoading: loading })
        },
        
        setSyncing: (syncing) => {
          set({ isSyncing: syncing })
        },
        
        // Helpers
        getThemeByType: (type) => {
          return get().themes.find(theme => theme.type === type)
        },
        
        getThemeByName: (name) => {
          return get().themes.find(theme => 
            theme.name.toLowerCase() === name.toLowerCase()
          )
        }
      }),
      {
        name: 'liar-themes-storage', // Key in localStorage
        partialize: (state) => ({
          themes: state.themes,
          lastFetched: state.lastFetched,
          lastSynced: state.lastSynced,
        }),
      }
    ),
    {
      name: 'themes-store', // Name for Redux DevTools
    }
  )
)

// Subscribe to all state changes for debugging in dev
if (import.meta.env.DEV) {
  useThemesStore.subscribe((state) => {
    console.log('ThemesStore State Updated:', {
      themesCount: state.themes.length,
      lastFetched: state.lastFetched ? new Date(state.lastFetched).toISOString() : null,
      isLoading: state.isLoading
    })
  })
}
