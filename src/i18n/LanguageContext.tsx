'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { messages, languages, Language, Messages } from './messages';

interface LanguageContextType {
  language: Language;
  locale: Language;
  t: Messages;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>('zh');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null;
    if (saved && languages.some((l) => l.code === saved)) {
      setLang(saved);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  }, []);

  const value: LanguageContextType = {
    language,
    locale: language,
    t: messages[language],
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export type { Language, Messages };
