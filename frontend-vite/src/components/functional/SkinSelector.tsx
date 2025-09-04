import { useEffect, useRef } from 'react'
import { DialogPopup } from '@/components/ui/DialogPopup'
import { SkinBox } from '@/components/ui/SkinBox'
import { useSkinStore } from '@/stores/skinStore'

interface SkinSelectorProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Skin selector dialog that displays available skins in a grid
 * Allows users to preview and select different color schemes
 */
export const SkinSelector = ({ isOpen, onClose }: SkinSelectorProps) => {
  const availableSkins = useSkinStore(state => state.availableSkins)
  const selectedSkinId = useSkinStore(state => state.selectedSkinId)
  const setSelectedSkin = useSkinStore(state => state.setSelectedSkin)
  const gridRef = useRef<HTMLDivElement>(null)
  
  console.log('SkinSelector render:', {
    isOpen,
    availableSkinsCount: availableSkins.length,
    selectedSkinId
  })
  
  useEffect(() => {
    if (isOpen && gridRef.current) {
      setTimeout(() => {
        if (gridRef.current) {
          const rect = gridRef.current.getBoundingClientRect()
          const parentRect = gridRef.current.parentElement?.getBoundingClientRect()
          const computedStyle = window.getComputedStyle(gridRef.current)
          console.log('SkinSelector grid position & layout:', {
            position: {
              top: rect.top,
              left: rect.left, 
              right: rect.right,
              bottom: rect.bottom
            },
            size: {
              width: rect.width,
              height: rect.height
            },
            style: {
              padding: computedStyle.padding,
              gap: computedStyle.gap,
              gridTemplateColumns: computedStyle.gridTemplateColumns
            },
            parent: parentRect ? {
              top: parentRect.top,
              left: parentRect.left,
              width: parentRect.width,
              height: parentRect.height,
              contentPadding: window.getComputedStyle(gridRef.current.parentElement!).padding
            } : null,
            relativeToParent: parentRect ? {
              offsetLeft: rect.left - parentRect.left,
              offsetTop: rect.top - parentRect.top,
              horizontalMargin: (parentRect.width - rect.width) / 2
            } : null
          })
        }
      }, 100)
    }
  }, [isOpen])
  
  const handleSkinSelect = (skinId: string) => {
    console.log('SkinSelector: Selecting skin', skinId)
    setSelectedSkin(skinId)
    // Optionally close the dialog after selection
    // onClose()
  }
  
  return (
    <DialogPopup
      isOpen={isOpen}
      onClose={onClose}
      title="Choose a theme"
      className="bg-opacity-95"
    >
      <div ref={gridRef} className="grid grid-cols-2 gap-2">
        {availableSkins.map(skin => (
          <SkinBox
            key={skin.id}
            skin={skin}
            isSelected={skin.id === selectedSkinId}
            onClick={() => handleSkinSelect(skin.id)}
          />
        ))}
      </div>
    </DialogPopup>
  )
}
