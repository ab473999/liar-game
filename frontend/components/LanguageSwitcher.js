"use client";
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export const LanguageSwitcher = ({ inHeader = false }) => {
  const [mounted, setMounted] = useState(false);
  const { language, changeLanguage, isLoading } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return null; // Don't show anything while loading to prevent flicker
  }
  
  // If in header, return just the select without wrapper
  // If standalone, include positioning wrapper
  if (inHeader) {
    return (
      <select 
        value={language} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="px-3 py-2 rounded transition-colors cursor-pointer w-20"
        style={{ 
          backgroundColor: 'var(--color-inputBg)', 
          color: 'var(--color-textPrimary)',
          border: '1px solid var(--color-borderSecondary)'
        }}
        aria-label="Language selector"
      >
        <option value="en">EN</option>
        <option value="it">IT</option>
        <option value="ko">한</option>
      </select>
    );
  }
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <select 
        value={language} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="px-3 py-2 rounded transition-colors cursor-pointer w-20"
        style={{ 
          backgroundColor: 'var(--color-inputBg)', 
          color: 'var(--color-textPrimary)',
          border: '1px solid var(--color-borderSecondary)'
        }}
        aria-label="Language selector"
      >
        <option value="en">EN</option>
        <option value="it">IT</option>
        <option value="ko">한</option>
      </select>
    </div>
  );
};
