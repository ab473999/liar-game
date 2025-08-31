"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import translations from '@/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved language or default to English
    const savedLang = localStorage.getItem('language');
    
    if (savedLang && (savedLang === 'ko' || savedLang === 'en' || savedLang === 'it')) {
      setLanguage(savedLang);
    } else {
      // Default to English regardless of browser language
      const defaultLang = 'en';
      setLanguage(defaultLang);
      localStorage.setItem('language', defaultLang);
    }
    setIsLoading(false);
  }, []);

  const changeLanguage = (lang) => {
    if (lang === 'ko' || lang === 'en' || lang === 'it') {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    }
  };

  const t = (key, fallback = null) => {
    if (!key) return fallback || key;
    
    const keys = key.split('.');
    let value = translations;
    
    // Navigate through the nested structure
    for (let i = 0; i < keys.length; i++) {
      value = value?.[keys[i]];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return fallback || key;
      }
    }
    
    // Get the translation for the current language
    const translation = value?.[language] || value?.['ko'];
    
    if (translation === undefined) {
      console.warn(`Translation not found for key: ${key}, language: ${language}`);
      return fallback || key;
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      changeLanguage, 
      t, 
      isLoading,
      availableLanguages: ['ko', 'en', 'it']
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
