import { useThemes } from '@/hooks/useApi'

export const ThemeGrid = () => {
  const { themes } = useThemes()
  
  // Console log the themes when they're fetched
  console.log('Themes fetched:', themes)
  
  return (
    <div>this is theme grid component</div>
  )
}
