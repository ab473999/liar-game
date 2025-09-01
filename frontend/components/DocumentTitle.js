"use client";
import { useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';

export const DocumentTitle = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    // Update document title based on selected language
    let title;
    switch (language) {
      case 'ko':
        title = '라이어 게임';
        break;
      case 'it':
        title = 'Liar';
        break;
      case 'en':
      default:
        title = 'Liar';
        break;
    }
    
    document.title = title;
  }, [language]);
  
  return null; // This component doesn't render anything
};
