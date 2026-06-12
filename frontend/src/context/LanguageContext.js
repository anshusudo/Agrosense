import { createContext, useContext, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

const supportedLanguages = ['en', 'hi', 'mr'];

export function LanguageProvider({ children }) {
  const initialLanguage = localStorage.getItem('appLanguage') || 'en';
  const [language, setLanguage] = useState(
    supportedLanguages.includes(initialLanguage) ? initialLanguage : 'en'
  );

  const changeLanguage = (nextLanguage) => {
    const selected = supportedLanguages.includes(nextLanguage) ? nextLanguage : 'en';
    setLanguage(selected);
    localStorage.setItem('appLanguage', selected);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const value = useMemo(
    () => ({ language, changeLanguage, t }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
