import { useEffect } from 'react'
import { MainContentTop } from '@/components/layout/MainContentTop'
import { MainContentBody } from '@/components/layout/MainContentBody'
import { PlayerCounter } from '@/components/functional/PlayerCounter'
import { ThemeGrid } from '@/components/functional/ThemeGrid'
import { useGameStore, useThemesStore } from '@/stores'
import { apiService } from '@/services/api'

export const Home = () => {
  const initializeHomeState = useGameStore((state) => state.initializeHomeState)
  const setThemes = useThemesStore((state) => state.setThemes)
  const setLoading = useThemesStore((state) => state.setLoading)
  
  // Initialize home state and fetch themes when component mounts
  // Note: In dev, React.StrictMode will run this twice - this is normal
  useEffect(() => {
    initializeHomeState()
    
    // Fetch and cache themes in the store
    const fetchThemes = async () => {
      try {
        setLoading(true)
        const themes = await apiService.getThemes()
        setThemes(themes)
      } catch (error) {
        console.error('Failed to fetch themes:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchThemes()
  }, [initializeHomeState, setThemes, setLoading])
  
  return (
    <>
      <MainContentTop>
        <PlayerCounter />
      </MainContentTop>
      <MainContentBody>
        <ThemeGrid />
      </MainContentBody>
    </>
  )
}