export interface SkinColors {
  // Header colors
  headerBg: string
  headerFontLogo: string
  // headerIcon is always same as headerFontLogo
  
  // Main button colors
  mainButtonBg: string
  mainButtonBorder: string
  mainButtonFont: string
  // mainButtonIcon is always same as mainButtonFont
  
  // Font colors
  fontPrimary: string
  fontSecondary: string
}

export interface Skin {
  id: string
  name: string
  colors: SkinColors
}

// Define available skins
export const SKINS: Record<string, Skin> = {
  original: {
    id: 'original',
    name: 'Original',
    colors: {
      // Header
      headerBg: '#FFEEEA',         // light peach/cream
      headerFontLogo: '#593C8F',   // purple
      
      // Main buttons
      mainButtonBg: '#ffffff',     // white
      mainButtonBorder: '#e5e7eb', // light gray
      mainButtonFont: '#593C8F',   // purple (matching header)
      
      // Fonts
      fontPrimary: '#000000',      // black
      fontSecondary: '#6b7280',    // gray
    }
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    colors: {
      // Header
      headerBg: '#0d0147',         // very dark blue
      headerFontLogo: '#00E4FF',   // bright cyan
      
      // Main buttons
      mainButtonBg: '#4D0056',     // dark aubergine
      mainButtonBorder: '#C20086', // darker pink
      mainButtonFont: '#FD1FC4',   // bright pink
      
      // Fonts
      fontPrimary: '#ffffff',      // white
      fontSecondary: '#FD1FC4',    // pink
    }
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    colors: {
      // Header
      headerBg: '#111827',         // gray-900
      headerFontLogo: '#60a5fa',   // blue-400
      
      // Main buttons
      mainButtonBg: '#374151',     // gray-700
      mainButtonBorder: '#4b5563', // gray-600
      mainButtonFont: '#ffffff',   // white
      
      // Fonts
      fontPrimary: '#ffffff',      // white
      fontSecondary: '#9ca3af',    // gray-400
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      // Header
      headerBg: '#0a2540',         // deep navy
      headerFontLogo: '#00d4aa',   // turquoise
      
      // Main buttons
      mainButtonBg: '#1e3a5f',     // ocean blue
      mainButtonBorder: '#2e5584', // lighter ocean blue
      mainButtonFont: '#66d9ef',   // light cyan
      
      // Fonts
      fontPrimary: '#e0f2fe',      // very light blue
      fontSecondary: '#7dd3c0',    // teal
    }
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    colors: {
      // Header
      headerBg: '#1a2e1a',         // dark forest green
      headerFontLogo: '#86efac',   // light green
      
      // Main buttons
      mainButtonBg: '#2d4a2b',     // moss green
      mainButtonBorder: '#4a6741', // lighter moss
      mainButtonFont: '#bef264',   // lime
      
      // Fonts
      fontPrimary: '#f0fdf4',      // very light green
      fontSecondary: '#86efac',    // light green
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      // Header
      headerBg: '#451a03',         // dark brown
      headerFontLogo: '#fbbf24',   // amber
      
      // Main buttons
      mainButtonBg: '#78350f',     // brown
      mainButtonBorder: '#92400e', // lighter brown
      mainButtonFont: '#fde047',   // yellow
      
      // Fonts
      fontPrimary: '#fef3c7',      // light amber
      fontSecondary: '#fb923c',    // orange
    }
  }
}

// Helper to get all available skins as an array
export const getAvailableSkins = (): Skin[] => Object.values(SKINS)

// Helper to get skin by ID
export const getSkinById = (id: string): Skin | undefined => SKINS[id]

// Default skin ID
export const DEFAULT_SKIN_ID = 'original'

// Constant colors that don't change with skins
export const CONSTANT_COLORS = {
  circleBg: '#ffffff',       // white
  circleBorder: '#4E937A',   // green
  circleHelp: '#DB5461',     // red
  wordReveal: '#4E937A',     // green (same as circleBorder)
}