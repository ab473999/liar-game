import { useNavigate } from 'react-router-dom'
import { MainContentTop } from '@/components/layout/MainContentTop'
import { MainContentBody } from '@/components/layout/MainContentBody'
import { ThemeGrid } from '@/components/functional/ThemeGrid'
import { AddTheme } from '@/components/functional/AddTheme'
import { useSettingsStore } from '@/stores'

export const Settings = () => {
  const navigate = useNavigate()
  const setSelectedTheme = useSettingsStore(state => state.setSelectedTheme)
  
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
