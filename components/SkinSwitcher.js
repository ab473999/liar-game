"use client";
import { useEffect, useState } from 'react';
import { useSkin } from '@/components/SkinContext';

export const SkinSwitcher = ({ inHeader = false }) => {
  const [mounted, setMounted] = useState(false);
  const { skin, changeSkin, skins, isLoading } = useSkin();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return null; // Don't show anything while loading to prevent flicker
  }
  
  // If in header, return just the select without wrapper
  if (inHeader) {
    return (
      <select 
        value={skin} 
        onChange={(e) => changeSkin(e.target.value)}
        className="px-3 py-2 rounded transition-colors cursor-pointer w-32"
        style={{ 
          backgroundColor: 'var(--color-inputBg)', 
          color: 'var(--color-textPrimary)',
          border: '1px solid var(--color-borderSecondary)'
        }}
        aria-label="Skin selector"
      >
        {Object.entries(skins).map(([key, skinData]) => (
          <option key={key} value={key}>
            {skinData.name}
          </option>
        ))}
      </select>
    );
  }
  
  // Standalone version (if needed elsewhere)
  return (
    <div className="fixed top-4 left-4 z-50">
      <select 
        value={skin} 
        onChange={(e) => changeSkin(e.target.value)}
        className="px-3 py-2 rounded transition-colors cursor-pointer w-32"
        style={{ 
          backgroundColor: 'var(--color-inputBg)', 
          color: 'var(--color-textPrimary)',
          border: '1px solid var(--color-borderSecondary)'
        }}
        aria-label="Skin selector"
      >
        {Object.entries(skins).map(([key, skinData]) => (
          <option key={key} value={key}>
            {skinData.name}
          </option>
        ))}
      </select>
    </div>
  );
};
