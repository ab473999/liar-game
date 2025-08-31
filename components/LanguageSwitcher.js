"use client";
import { useTranslation } from '@/hooks/useTranslation';

export const LanguageSwitcher = ({ className = "" }) => {
  const { language, changeLanguage, isLoading } = useTranslation();

  if (isLoading) {
    return null; // Don't render until language is loaded to prevent flicker
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <select 
        value={language} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 hover:bg-gray-600 transition-colors cursor-pointer"
        aria-label="Language selector"
      >
        <option value="ko">한국어</option>
        <option value="en">English</option>
        <option value="it">Italiano</option>
      </select>
    </div>
  );
};
