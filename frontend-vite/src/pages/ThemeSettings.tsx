import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
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
        <div className="flex flex-col items-center gap-4">
          <Link 
            to="/settings" 
            className="flex items-center gap-2 px-3 py-1 text-sm rounded-lg transition-opacity hover:opacity-80"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--color-textSecondary)',
              padding: '0.5rem 1rem',
            }}
          >
            <ArrowLeft size={16} />
            Back to Settings
          </Link>
          <AddWord 
            themeType={currentTheme.type}
            themeName={currentTheme.name}
            themeId={currentTheme.id}
          />
        </div>
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
