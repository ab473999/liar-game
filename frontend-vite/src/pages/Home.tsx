import { useEffect } from 'react'
import { MainContentTop } from '@/components/layout/MainContentTop'
import { MainContentBody } from '@/components/layout/MainContentBody'
import { PlayerCounter } from '@/components/functional/PlayerCounter'
import { ThemeGrid } from '@/components/functional/ThemeGrid'
import { useGameStore } from '@/stores'

export const Home = () => {
  const initializeHomeState = useGameStore((state) => state.initializeHomeState)
  
  // Initialize home state when component mounts
  // Note: In dev, React.StrictMode will run this twice - this is normal
  useEffect(() => {
    initializeHomeState()
  }, [initializeHomeState])
  
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