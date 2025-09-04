import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MainContentTop } from '@/components/layout/MainContentTop'
import { MainContentBody } from '@/components/layout/MainContentBody'
import { AddWord } from '@/components/functional/AddWord'
import { WordList } from '@/components/functional/WordList'
import { useSettingsStore, useThemesStore } from '@/stores'

export const ThemeSettings = () => {
  const { theme: themeType } = useParams<{ theme: string }>()
  const navigate = useNavigate()
  const themes = useThemesStore(state => state.themes)
  const selectedTheme = useSettingsStore(state => state.selectedTheme)
  const setSelectedTheme = useSettingsStore(state => state.setSelectedTheme)
  
  // Find the theme object based on the type from URL
  const currentTheme = themes.find(t => t.type === themeType)
  
  // If we don't have the theme name in store (e.g., direct navigation or page refresh),
  // try to find it from the themes list
  useEffect(() => {
    if (!selectedTheme && themes.length > 0 && themeType) {
      if (currentTheme) {
        setSelectedTheme({ type: currentTheme.type, name: currentTheme.name })
      } else {
        // Theme not found, redirect back to settings
        console.error('Theme not found:', themeType)
        navigate('/settings')
      }
    }
  }, [selectedTheme, themes, themeType, currentTheme, setSelectedTheme, navigate])
  
  // If theme not found, don't render (will redirect in useEffect)
  if (!currentTheme) {
    return null
  }
  
  return (
    <>
      <MainContentTop>
        <AddWord 
          themeType={currentTheme.type}
          themeName={currentTheme.name}
          themeId={currentTheme.id}
        />
      </MainContentTop>
      <MainContentBody>
        <WordList 
          themeType={currentTheme.type}
          themeId={currentTheme.id}
        />
      </MainContentBody>
    </>
  )
}
