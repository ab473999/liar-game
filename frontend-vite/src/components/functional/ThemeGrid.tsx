import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemes } from '@/hooks/useApi'
import { ThemeBox } from '@/components/ui/ThemeBox'
import { useGameStore } from '@/stores'
import { apiService } from '@/services/api'

interface ThemeGridProps {
  onThemeClick?: (themeType: string, themeName: string) => void | Promise<void>
}

export const ThemeGrid = ({ onThemeClick }: ThemeGridProps = {}) => {
  const navigate = useNavigate()
  const { themes, loading } = useThemes()
  const [isSelecting, setIsSelecting] = useState(false)
  
  // Get store actions
  const { 
    playerNum,
    setTheme,
    setWord,
    setLiarPosition
  } = useGameStore()
  
  // Log when themes are loaded
  useEffect(() => {
    if (!loading && themes.length > 0) {
      console.log('Themes loaded:', themes)
    }
  }, [themes, loading])
  
  // Default handler for Home page (game start)
  const handleThemeClickHome = async (themeType: string, themeName: string) => {
    if (isSelecting) return // Prevent double clicks
    
    try {
      setIsSelecting(true)
      console.log('Theme selected for game:', themeName, '(type:', themeType, ')')
      
      // Set the selected theme in store (store the name for display)
      setTheme(themeName)
      
      // Fetch words for this theme using the type
      const words = await apiService.getWordsByTheme(themeType)
      
      if (words.length === 0) {
        console.error('No words available for theme:', themeName)
        setIsSelecting(false)
        return
      }
      
      // Select a random words 
      const randomWordIndex = Math.floor(Math.random() * words.length)
      const selectedWord = words[randomWordIndex].word
      console.log('Random word selected:', selectedWord, `(${randomWordIndex + 1}/${words.length})`)
      setWord(selectedWord)
      
      // Select a random player to be the liar (1-indexed for display)
      const liarPlayerNumber = Math.floor(Math.random() * playerNum) + 1
      console.log('Liar selected: Player', liarPlayerNumber, `(out of ${playerNum} players)`)
      setLiarPosition(liarPlayerNumber)
      
      // Navigate to game page
      navigate('/game')
      
    } catch (error) {
      console.error('Error selecting theme:', error)
      setIsSelecting(false)
    }
  }
  
  // Use provided handler or default based on current route
  const handleClick = async (themeType: string, themeName: string) => {
    if (onThemeClick) {
      // Custom handler provided
      await onThemeClick(themeType, themeName)
    } else {
      // Default to home behavior if no handler provided
      await handleThemeClickHome(themeType, themeName)
    }
  }
  
  // Don't render anything while loading
  if (loading) {
    return null
  }
  
  // Don't render empty grid if no themes
  if (themes.length === 0) {
    return null
  }
  
  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '1.25rem',
        alignContent: 'start',
        padding: '1rem',
        width: 'calc(100% - 0.5rem)',  // Compensate for increased gap
        maxWidth: '100%',
        margin: '0 auto',
        opacity: isSelecting ? 0.5 : 1,
        pointerEvents: isSelecting ? 'none' : 'auto'
      }}
    >
      {themes.map((theme) => (
        <ThemeBox 
          key={theme.id} 
          name={theme.name}
          onClick={() => handleClick(theme.type, theme.name)}
        />
      ))}
    </div>
  )
}
