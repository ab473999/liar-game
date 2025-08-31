"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import { themes, defaultTheme } from '@/config/themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved theme or use default
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      setTheme(defaultTheme);
      applyTheme(defaultTheme);
      localStorage.setItem('theme', defaultTheme);
    }
    setIsLoading(false);
  }, []);

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    const themeColors = themes[themeName].colors;
    
    // Set CSS variables for the theme
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Add theme class to root for specific overrides if needed
    root.className = `theme-${themeName}`;
  };

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setTheme(themeName);
      applyTheme(themeName);
      localStorage.setItem('theme', themeName);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      changeTheme, 
      themes,
      isLoading,
      availableThemes: Object.keys(themes)
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
