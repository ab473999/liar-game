"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import { skins, defaultSkin } from '@/config/skins';

const SkinContext = createContext();

export const SkinProvider = ({ children }) => {
  const [skin, setSkin] = useState(defaultSkin);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved skin or use default
    const savedSkin = localStorage.getItem('skin');
    
    if (savedSkin && skins[savedSkin]) {
      setSkin(savedSkin);
      applySkin(savedSkin);
    } else {
      setSkin(defaultSkin);
      applySkin(defaultSkin);
      localStorage.setItem('skin', defaultSkin);
    }
    setIsLoading(false);
  }, []);

  const applySkin = (skinName) => {
    const root = document.documentElement;
    const skinColors = skins[skinName].colors;
    
    // Set CSS variables for the skin
    Object.entries(skinColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Add skin class to root for specific overrides if needed
    root.className = `skin-${skinName}`;
  };

  const changeSkin = (skinName) => {
    if (skins[skinName]) {
      setSkin(skinName);
      applySkin(skinName);
      localStorage.setItem('skin', skinName);
    }
  };

  return (
    <SkinContext.Provider value={{ 
      skin, 
      changeSkin, 
      skins,
      isLoading,
      availableSkins: Object.keys(skins)
    }}>
      {children}
    </SkinContext.Provider>
  );
};

export const useSkin = () => {
  const context = useContext(SkinContext);
  if (!context) {
    throw new Error('useSkin must be used within SkinProvider');
  }
  return context;
};
