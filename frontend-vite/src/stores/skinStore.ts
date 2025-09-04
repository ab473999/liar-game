import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { 
  SKINS, 
  DEFAULT_SKIN_ID, 
  getAvailableSkins, 
  getSkinById as getSkinByIdHelper,
  CONSTANT_COLORS,
  type Skin, 
  type SkinColors 
} from '@/constants/skins'
import { logger } from '@/utils/logger'

// Re-export types for convenience
export type { Skin, SkinColors }

interface SkinStore {
  // State
  selectedSkinId: string
  availableSkins: Skin[]
  
  // Actions
  setSelectedSkin: (skinId: string) => void
  applySkin: (skinId: string) => void
  
  // Getters
  getSelectedSkin: () => Skin
  getSkinById: (id: string) => Skin | undefined
}

export const useSkinStore = create<SkinStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        selectedSkinId: DEFAULT_SKIN_ID,
        availableSkins: getAvailableSkins(),
        
        // Actions
        setSelectedSkin: (skinId) => {
          logger.log('SkinStore: setSelectedSkin', skinId)
          const skin = get().getSkinById(skinId)
          if (skin) {
            set({ selectedSkinId: skinId })
            get().applySkin(skinId)
          }
        },
        
        applySkin: (skinId) => {
          const skin = get().getSkinById(skinId)
          if (!skin) return
          
          logger.log('SkinStore: applySkin', skinId)
          const root = document.documentElement
          const colors = skin.colors
          
          // Apply skin-specific colors
          root.style.setProperty('--header-bg', colors.headerBg)
          root.style.setProperty('--header-font-logo', colors.headerFontLogo)
          root.style.setProperty('--header-icon', colors.headerFontLogo) // Same as logo
          
          root.style.setProperty('--mainbutton-bg', colors.mainButtonBg)
          root.style.setProperty('--mainbutton-border', colors.mainButtonBorder)
          root.style.setProperty('--mainbutton-font', colors.mainButtonFont)
          root.style.setProperty('--mainbutton-icon', colors.mainButtonFont) // Same as font
          
          root.style.setProperty('--font-primary', colors.fontPrimary)
          root.style.setProperty('--font-secondary', colors.fontSecondary)
          
          // Apply constant colors (same for all skins)
          root.style.setProperty('--circle-bg', CONSTANT_COLORS.circleBg)
          root.style.setProperty('--circle-border', CONSTANT_COLORS.circleBorder)
          root.style.setProperty('--circle-help', CONSTANT_COLORS.circleHelp)
          root.style.setProperty('--word-reveal', CONSTANT_COLORS.wordReveal)
          
          // Also set a general page background based on header
          // Making it slightly lighter than header for contrast
          root.style.setProperty('--page-bg', colors.headerBg)
        },
        
        // Getters
        getSelectedSkin: () => {
          const selectedId = get().selectedSkinId
          return getSkinByIdHelper(selectedId) || SKINS[DEFAULT_SKIN_ID]
        },
        
        getSkinById: (id) => {
          return getSkinByIdHelper(id)
        }
      }),
      {
        name: 'liar-skin-storage',
        partialize: (state) => ({
          selectedSkinId: state.selectedSkinId
        })
      }
    ),
    {
      name: 'skin-store'
    }
  )
)

// Apply skin on initialization
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  const applySavedSkin = () => {
    const store = useSkinStore.getState()
    store.applySkin(store.selectedSkinId)
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applySavedSkin)
  } else {
    applySavedSkin()
  }
}