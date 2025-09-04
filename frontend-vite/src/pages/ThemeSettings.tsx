import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MainContentTop } from '@/components/layout/MainContentTop'
import { MainContentBody } from '@/components/layout/MainContentBody'
import { useSettingsStore } from '@/stores'
import { useThemes } from '@/hooks/useApi'

export const ThemeSettings = () => {
  const { theme: themeType } = useParams<{ theme: string }>()
  const navigate = useNavigate()
  const { themes } = useThemes()
  const selectedTheme = useSettingsStore(state => state.selectedTheme)
  const setSelectedTheme = useSettingsStore(state => state.setSelectedTheme)
  
  // If we don't have the theme name in store (e.g., direct navigation or page refresh),
  // try to find it from the themes list
  useEffect(() => {
    if (!selectedTheme && themes.length > 0 && themeType) {
      const theme = themes.find(t => t.type === themeType)
      if (theme) {
        setSelectedTheme({ type: theme.type, name: theme.name })
      } else {
        // Theme not found, redirect back to settings
        console.error('Theme not found:', themeType)
        navigate('/settings')
      }
    }
  }, [selectedTheme, themes, themeType, setSelectedTheme, navigate])
  
  // Use the theme name from store if available, fallback to type for display
  const displayName = selectedTheme?.name || themeType || 'Unknown'
  
  return (
    <>
      <MainContentTop>
        <div>Theme Settings for: {displayName}</div>
      </MainContentTop>
      <MainContentBody>
        <div>Words management for {displayName} theme will go here...</div>
      </MainContentBody>
    </>
  )
}
