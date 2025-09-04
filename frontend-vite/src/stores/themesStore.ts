import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Theme } from '@/types'

interface ThemesStore {
  // State
  themes: Theme[]
  lastFetched: number | null
  isLoading: boolean
  
  // Actions
  setThemes: (themes: Theme[]) => void
  addTheme: (theme: Theme) => void
  updateTheme: (id: number, theme: Theme) => void
  removeTheme: (id: number) => void
  setLoading: (loading: boolean) => void
  
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
        isLoading: false,
        
        // Actions
        setThemes: (themes) => {
          console.log('ThemesStore: setThemes', themes.length, 'themes')
          set({ 
            themes,
            lastFetched: Date.now()
          })
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
