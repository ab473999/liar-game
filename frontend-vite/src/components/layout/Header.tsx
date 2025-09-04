import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { SquarePen, ArrowLeft, Blend, Info } from 'lucide-react'
import { ButtonHeader } from '@/components/ui/customized/ButtonHeader'
import { SkinSelector } from '@/components/functional/SkinSelector'
import { PasswordDialog } from '@/components/functional/PasswordDialog'
import { InstructionsDialog } from '@/components/functional/InstructionsDialog'
import { useGameStore, useSettingsStore, useThemesStore, useAuthStore } from '@/stores'
import { IS_AUTH_ENABLED } from '@/config/authConfig'
import { logger } from '@/utils/logger'

export const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme: themeType } = useParams<{ theme: string }>()
  const [isSkinSelectorOpen, setIsSkinSelectorOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  
  // Get theme information from stores
  const gameTheme = useGameStore(state => state.theme)
  const themes = useThemesStore(state => state.themes)
  const selectedTheme = useSettingsStore(state => state.selectedTheme)
  const { checkAuth, setPassword } = useAuthStore()
  
  const isHome = location.pathname === '/'
  const isGame = location.pathname === '/game'
  const isSettings = location.pathname.startsWith('/settings')
  const isThemeSettings = location.pathname.startsWith('/settings/') && location.pathname !== '/settings'
  const isSettingsRoot = location.pathname === '/settings'
  
  logger.log('Header render:', {
    pathname: location.pathname,
    isHome,
    isGame,
    isSettings,
    isSettingsRoot,
    isThemeSettings,
    isSkinSelectorOpen
  })
  
  // Determine where back button should navigate to
  const getBackDestination = () => {
    if (isThemeSettings) return '/settings'  // From theme settings -> settings
    if (isSettings) return '/'  // From settings -> home
    return '/'
  }
  
  // Determine what title to display
  const getHeaderTitle = () => {
    if (isGame && gameTheme) {
      return gameTheme
    }
    if (isSettingsRoot) {
      return 'Settings'
    }
    if (isThemeSettings) {
      // Try to get theme name from selectedTheme first, then from themes list
      if (selectedTheme?.name) {
        return `Settings/${selectedTheme.name}`
      }
      // Fallback to finding theme by type from URL
      const currentTheme = themes.find(t => t.type === themeType)
      if (currentTheme) {
        return `Settings/${currentTheme.name}`
      }
      return 'Settings/Theme'
    }
    return 'LIAR'
  }
  
  const headerTitle = getHeaderTitle()
  const isThemeSettingsTitle = headerTitle.startsWith('Settings/')
  
  const handleSettingsClick = () => {
    // If auth is disabled, go directly to settings
    if (!IS_AUTH_ENABLED) {
      navigate('/settings')
      return
    }
    
    // Check if already authenticated
    if (checkAuth()) {
      navigate('/settings')
    } else {
      // Show password dialog
      setIsPasswordDialogOpen(true)
    }
  }
  
  const handlePasswordSubmit = (password: string) => {
    // For now, we'll validate on the backend when making the first write request
    // Store the password and navigate to settings
    setPassword(password)
    setIsPasswordDialogOpen(false)
    setPasswordError('')
    navigate('/settings')
  }
  
  return (
    <header 
      className="sticky top-0 z-50"
      style={{
        backgroundColor: 'var(--header-bg)',
        borderBottom: '1px solid var(--header-bg)'
      }}
    >
      {/* Safe area padding for devices with notches */}
      <div className="h-16 pt-safe flex items-center justify-between relative">
        {/* Left side - Info button on Home page, Back button on Settings page */}
        <div className="pl-0">
          {isHome && (
            <ButtonHeader 
              onClick={() => setIsInstructionsOpen(true)}
              ariaLabel="Open game instructions"
            >
              <Info size={24} />
            </ButtonHeader>
          )}
          {isSettings && (
            <ButtonHeader 
              onClick={() => navigate(getBackDestination())}
              ariaLabel={isThemeSettings ? "Go back to settings" : "Go back to home"}
            >
              <ArrowLeft size={24} />
            </ButtonHeader>
          )}
        </div>
        
        {/* Center - Title (changes based on page) */}
        <h1 
          className={`${isThemeSettingsTitle ? 'text-lg' : 'text-3xl'} font-normal absolute left-1/2 transform -translate-x-1/2`}
          style={{ color: 'var(--header-font-logo)' }}
        >
          {headerTitle}
        </h1>
        
        {/* Right side - Settings button on Home page, Skin selector on Settings page */}
        <div className="pr-0">
          {isHome && (
            <ButtonHeader 
              onClick={handleSettingsClick}
              ariaLabel="Open settings"
            >
              <SquarePen size={24} />
            </ButtonHeader>
          )}
          {isSettingsRoot && (
            <ButtonHeader 
              onClick={() => {
                logger.log('SprayCan button clicked, opening skin selector')
                setIsSkinSelectorOpen(true)
              }}
              ariaLabel="Open theme selector"
            >
              <Blend size={24} />
            </ButtonHeader>
          )}
        </div>
      </div>
      
      {/* Skin Selector Dialog */}
      <SkinSelector 
        isOpen={isSkinSelectorOpen}
        onClose={() => setIsSkinSelectorOpen(false)}
      />
      
      {/* Password Dialog */}
      <PasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => {
          setIsPasswordDialogOpen(false)
          setPasswordError('')
        }}
        onSubmit={handlePasswordSubmit}
        errorMessage={passwordError}
      />
      
      {/* Instructions Dialog */}
      <InstructionsDialog 
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />
    </header>
  )
}