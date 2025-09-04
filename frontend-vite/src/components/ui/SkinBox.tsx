import { Check } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Skin } from '@/constants/skins'

interface SkinBoxProps {
  skin: Skin
  isSelected: boolean
  onClick: () => void
}

/**
 * Simple skin selection box - a square with a colored circle and skin name
 */
export const SkinBox = ({ skin, isSelected, onClick }: SkinBoxProps) => {
  const colors = skin.colors
  const boxRef = useRef<HTMLButtonElement>(null)
  
  useEffect(() => {
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect()
      const parentRect = boxRef.current.parentElement?.getBoundingClientRect()
      console.log(`SkinBox ${skin.name} position & dimensions:`, {
        position: { x: rect.x, y: rect.y, top: rect.top, left: rect.left },
        size: { width: rect.width, height: rect.height },
        aspectRatio: rect.width / rect.height,
        isSelected,
        parent: parentRect ? {
          x: parentRect.x,
          y: parentRect.y,
          width: parentRect.width,
          height: parentRect.height
        } : null,
        relativeToParent: parentRect ? {
          offsetLeft: rect.left - parentRect.left,
          offsetTop: rect.top - parentRect.top
        } : null
      })
    }
  }, [skin.name, isSelected])
  
  return (
    <div className="relative w-full" style={{ paddingBottom: '100%' }}>
      <button
        ref={boxRef}
        onClick={onClick}
        className={`absolute inset-0 rounded-lg flex flex-col items-center justify-center transition-all ${
          isSelected ? 'ring-2 ring-offset-2 ring-offset-transparent' : 'hover:scale-105'
        }`}
        style={{
          backgroundColor: colors.mainButtonBg,
          borderColor: isSelected ? colors.mainButtonFont : colors.mainButtonBorder,
          borderWidth: '2px',
          borderStyle: 'solid',
        } as React.CSSProperties}
        aria-label={`Select ${skin.name} skin`}
        aria-pressed={isSelected}
      >
        {/* Colored circle preview */}
        <div className="flex gap-1 mb-2">
          <div 
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: colors.headerFontLogo }}
            title="Header color"
          />
          <div 
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: colors.mainButtonFont }}
            title="Button color"
          />
        </div>
        
        {/* Skin name */}
        <span 
          className="text-sm font-medium"
          style={{ color: colors.fontPrimary }}
        >
          {skin.name}
        </span>
        
        {/* Selected checkmark */}
        {isSelected && (
          <div 
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: colors.mainButtonFont,
              color: colors.mainButtonBg 
            }}
          >
            <Check size={16} strokeWidth={3} />
          </div>
        )}
      </button>
    </div>
  )
}