import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainContentTop } from '@/components/layout/MainContentTop'
import { MainContentBody } from '@/components/layout/MainContentBody'
import { ThemeGrid } from '@/components/functional/ThemeGrid'
import { AddTheme } from '@/components/functional/AddTheme'
import { useSettingsStore, useThemesStore } from '@/stores'
import { apiService } from '@/services/api'

export const Settings = () => {
  const navigate = useNavigate()
  const setSelectedTheme = useSettingsStore(state => state.setSelectedTheme)
  const themes = useThemesStore(state => state.themes)
  const setThemes = useThemesStore(state => state.setThemes)
  const setLoading = useThemesStore(state => state.setLoading)
  
  // Fetch themes if not already loaded (e.g., direct navigation to /settings)
  useEffect(() => {
    if (themes.length === 0) {
      const fetchThemes = async () => {
        try {
          setLoading(true)
          const fetchedThemes = await apiService.getThemes()
          setThemes(fetchedThemes)
        } catch (error) {
          console.error('Failed to fetch themes:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchThemes()
    }
  }, [themes.length, setThemes, setLoading])
  
  // Handler for settings page - navigate to theme-specific settings
  const handleThemeClickSettings = (themeType: string, themeName: string) => {
    console.log('Theme selected for settings:', themeName, '(type:', themeType, ')')
    
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
