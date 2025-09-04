import { useEffect } from 'react'
import { MainContentTop } from '@/components/layout/MainContentTop'
import { MainContentBody } from '@/components/layout/MainContentBody'
import { PlayerCounter } from '@/components/functional/PlayerCounter'
import { ThemeGrid } from '@/components/functional/ThemeGrid'
import { useGameStore, useThemesStore } from '@/stores'
import { apiService } from '@/services/api'
import { logger } from '@/utils/logger'

export const Home = () => {
  const initializeHomeState = useGameStore((state) => state.initializeHomeState)
  const themes = useThemesStore((state) => state.themes)
  const setThemes = useThemesStore((state) => state.setThemes)
  const syncThemes = useThemesStore((state) => state.syncThemes)
  const setLoading = useThemesStore((state) => state.setLoading)
  const setSyncing = useThemesStore((state) => state.setSyncing)
  const lastSynced = useThemesStore((state) => state.lastSynced)
  
  // Initialize home state when component mounts
  useEffect(() => {
    initializeHomeState()
  }, [initializeHomeState])
  
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
        logger.log('Home: Starting background sync with backend')
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