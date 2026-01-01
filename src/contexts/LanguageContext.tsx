'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ky' | 'ru' | 'en' | 'tr';

interface LanguageContextType {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  isOriginalLang: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'sokol-media-lang';

// Браузер тилин аныктоо
function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'ky';

  const browserLang = navigator.language.toLowerCase().split('-')[0];

  switch (browserLang) {
    case 'ru': return 'ru';
    case 'en': return 'en';
    case 'tr': return 'tr';
    case 'ky': return 'ky';
    default: return 'ky'; // Демейки тил
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Language>('ky');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // localStorage'дан же браузер тилинен алуу
    const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;

    if (savedLang && ['ky', 'ru', 'en', 'tr'].includes(savedLang)) {
      setCurrentLang(savedLang);
    } else {
      const detectedLang = detectBrowserLanguage();
      setCurrentLang(detectedLang);
      localStorage.setItem(STORAGE_KEY, detectedLang);
    }

    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  // SSR үчүн
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        setLanguage,
        isOriginalLang: currentLang === 'ky'
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  // Эгер контекст жок болсо, демейки маанилерди кайтаруу
  if (!context) {
    return {
      currentLang: 'ky' as Language,
      setLanguage: () => {},
      isOriginalLang: true
    };
  }
  return context;
}