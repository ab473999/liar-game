import { useLanguage } from '@/components/LanguageContext';

export const useTranslation = () => {
  const { t, language, changeLanguage, isLoading, availableLanguages } = useLanguage();
  
  return { 
    t, 
    language, 
    changeLanguage, 
    isLoading,
    availableLanguages
  };
};
