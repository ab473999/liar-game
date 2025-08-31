"use client";
import { useEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeContext';

export const ThemeSwitcher = ({ inHeader = false }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, changeTheme, themes, isLoading } = useTheme();

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
        value={theme} 
        onChange={(e) => changeTheme(e.target.value)}
        className="px-3 py-2 rounded transition-colors cursor-pointer w-32"
        style={{ 
          backgroundColor: 'var(--color-inputBg)', 
          color: 'var(--color-textPrimary)',
          border: '1px solid var(--color-borderSecondary)'
        }}
        aria-label="Theme selector"
      >
        {Object.entries(themes).map(([key, themeData]) => (
          <option key={key} value={key}>
            {themeData.name}
          </option>
        ))}
      </select>
    );
  }
  
  // Standalone version (if needed elsewhere)
  return (
    <div className="fixed top-4 left-4 z-50">
      <select 
        value={theme} 
        onChange={(e) => changeTheme(e.target.value)}
        className="px-3 py-2 rounded transition-colors cursor-pointer w-32"
        style={{ 
          backgroundColor: 'var(--color-inputBg)', 
          color: 'var(--color-textPrimary)',
          border: '1px solid var(--color-borderSecondary)'
        }}
        aria-label="Theme selector"
      >
        {Object.entries(themes).map(([key, themeData]) => (
          <option key={key} value={key}>
            {themeData.name}
          </option>
        ))}
      </select>
    </div>
  );
};
