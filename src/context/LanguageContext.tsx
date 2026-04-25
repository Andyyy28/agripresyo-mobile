import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations } from '../data/translations';

type Lang = 'en' | 'fil';
interface LanguageContextType {
  language: Lang;
  setLanguage: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const STORAGE_KEY = 'agripresyo_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'fil') return stored;
    } catch {}
    return 'en';
  });

  const setLanguage = useCallback((lang: Lang) => {
    setLangState(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }, []);

  const t = useCallback((key: string): string => {
    const val = translations[language]?.[key];
    if (val !== undefined) return val;
    const fallback = translations['en']?.[key];
    return fallback !== undefined ? fallback : key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
