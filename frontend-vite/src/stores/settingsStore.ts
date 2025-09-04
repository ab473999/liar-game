import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { logger } from '@/utils/logger'

interface SelectedTheme {
  type: string
  name: string
}

interface SettingsStore {
  // State
  selectedTheme: SelectedTheme | null  // The theme currently being edited in settings
  showAIThemes: boolean  // Toggle for showing/hiding AI-generated themes
  
  // Actions
  setSelectedTheme: (theme: SelectedTheme) => void
  clearSelectedTheme: () => void
  toggleShowAIThemes: () => void
  setShowAIThemes: (show: boolean) => void
}

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        selectedTheme: null,
        showAIThemes: true,  // Show all themes by default
        
        // Actions
        setSelectedTheme: (theme) => {
          logger.log('SettingsStore: setSelectedTheme', theme)
          set({ selectedTheme: theme })
        },
        
        clearSelectedTheme: () => {
          logger.log('SettingsStore: clearSelectedTheme')
          set({ selectedTheme: null })
        },
        
        toggleShowAIThemes: () => {
          const current = get().showAIThemes
          logger.log('SettingsStore: toggleShowAIThemes', { from: current, to: !current })
          set({ showAIThemes: !current })
        },
        
        setShowAIThemes: (show) => {
          logger.log('SettingsStore: setShowAIThemes', show)
          set({ showAIThemes: show })
        }
      }),
      {
        name: 'liar-settings-storage', // Key in localStorage
        partialize: (state) => ({
          // Only persist certain settings, not the selected theme navigation state
          showAIThemes: state.showAIThemes,
        }),
      }
    ),
    {
      name: 'settings-store', // Name for Redux DevTools
    }
  )
)

// Subscribe to all state changes for debugging in dev
if (import.meta.env.DEV) {
  useSettingsStore.subscribe((state) => {
    logger.log('SettingsStore State Updated:', {
      selectedTheme: state.selectedTheme,
      showAIThemes: state.showAIThemes
    })
  })
}
