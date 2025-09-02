import { useLanguage } from '@/components/contexts/LanguageContext';

export const useTranslation = () => {
  const { t, language, isLoading, availableLanguages } = useLanguage();
  
  return { 
    t, 
    language, 
    isLoading,
    availableLanguages
  };
};
