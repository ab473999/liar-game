import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainContentTop } from '@/components/layout/MainContentTop'
import { MainContentBody } from '@/components/layout/MainContentBody'
import { ThemeGrid } from '@/components/functional/ThemeGrid'
import { AddTheme } from '@/components/functional/AddTheme'
import { useSettingsStore, useThemesStore } from '@/stores'
import { apiService } from '@/services/api'
import { logger } from '@/utils/logger'

export const Settings = () => {
  const navigate = useNavigate()
  const setSelectedTheme = useSettingsStore(state => state.setSelectedTheme)
  const themes = useThemesStore(state => state.themes)
  const setThemes = useThemesStore(state => state.setThemes)
  const syncThemes = useThemesStore(state => state.syncThemes)
  const setLoading = useThemesStore(state => state.setLoading)
  const setSyncing = useThemesStore(state => state.setSyncing)
  const lastSynced = useThemesStore(state => state.lastSynced)
  
  logger.log('Settings page render:', {
    themesCount: themes.length,
    lastSynced
  })
  
  // Initial load: if we have no themes at all, do a full fetch
  useEffect(() => {
    if (themes.length === 0 && !lastSynced) {
      const fetchThemes = async () => {
        try {
          setLoading(true)
          const fetchedThemes = await apiService.getThemes()
          setThemes(fetchedThemes)
        } catch (error) {
          logger.error('Failed to fetch themes:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchThemes()
    }
  }, [themes.length, lastSynced, setThemes, setLoading])
  
  // Background sync: always run this to catch backend changes
  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        setSyncing(true)
        logger.log('Settings: Starting background sync with backend')
        const backendThemes = await apiService.getThemes()
        syncThemes(backendThemes)
      } catch (error) {
        logger.error('Failed to sync themes with backend:', error)
      } finally {
        setSyncing(false)
      }
    }
    
    // Sync on mount
    syncWithBackend()
    
    // Optional: Set up periodic sync (every 30 seconds)
    const interval = setInterval(syncWithBackend, 30000)
    
    return () => clearInterval(interval)
  }, [syncThemes, setSyncing])
  
  // Handler for settings page - navigate to theme-specific settings
  const handleThemeClickSettings = (themeType: string, themeName: string) => {
    logger.log('Theme selected for settings:', themeName, '(type:', themeType, ')')
    
    // Store the selected theme in settings store
    setSelectedTheme({ type: themeType, name: themeName })
    
    // Navigate to theme-specific settings page using the theme type as the route param
    navigate(`/settings/${themeType}`)
  }
  
  return (
    <>
      <MainContentTop>
        <AddTheme />
      </MainContentTop>
      <MainContentBody>
        <ThemeGrid onThemeClick={handleThemeClickSettings} />
      </MainContentBody>
    </>
  )
}
