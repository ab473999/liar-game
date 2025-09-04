import { useLocation, useNavigate } from 'react-router-dom'
import { SquarePen, ArrowLeft } from 'lucide-react'
import { ButtonHeader } from '@/components/ui/customized/ButtonHeader'

export const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const isHome = location.pathname === '/'
  const isSettings = location.pathname.startsWith('/settings')
  const isThemeSettings = location.pathname.startsWith('/settings/') && location.pathname !== '/settings'
  
  // Determine where back button should navigate to
  const getBackDestination = () => {
    if (isThemeSettings) return '/settings'  // From theme settings -> settings
    if (isSettings) return '/'  // From settings -> home
    return '/'
  }
  
  return (
    <header className="sticky top-0 z-50 bg-gray-950 border-b border-gray-800">
      {/* Safe area padding for devices with notches */}
      <div className="h-16 pt-safe flex items-center justify-between relative">
        {/* Left side - Back button on Settings page */}
        <div className="pl-0">
          {isSettings && (
            <ButtonHeader 
              onClick={() => navigate(getBackDestination())}
              ariaLabel={isThemeSettings ? "Go back to settings" : "Go back to home"}
            >
              <ArrowLeft size={24} />
            </ButtonHeader>
          )}
        </div>
        
        {/* Center - LIAR title */}
        <h1 className="text-3xl font-normal text-blue-400 absolute left-1/2 transform -translate-x-1/2">LIAR</h1>
        
        {/* Right side - Settings button on Home page */}
        <div className="pr-0">
          {isHome && (
            <ButtonHeader 
              onClick={() => navigate('/settings')}
              ariaLabel="Open settings"
            >
              <SquarePen size={24} />
            </ButtonHeader>
          )}
        </div>
      </div>
    </header>
  )
}