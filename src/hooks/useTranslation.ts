'use client';

import { useState, useCallback } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';

interface TranslationCache {
  [key: string]: string;
}

// Глобалдык кэш (бир сессияда)
const translationCache: TranslationCache = {};

function getCacheKey(text: string, targetLang: Language): string {
  // Текстин хэши жана тил
  const hash = text.slice(0, 50).replace(/\s+/g, '_');
  return `${hash}_${targetLang}`;
}

export function useTranslation() {
  const { currentLang, isOriginalLang } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);

  const translate = useCallback(async (
    text: string,
    postId?: string
  ): Promise<string> => {
    // Эгер оригинал тилде болсо, которбойбуз
    if (isOriginalLang || !text) {
      return text;
    }

    const cacheKey = postId
      ? `${postId}_${currentLang}`
      : getCacheKey(text, currentLang);

    // Кэштен текшерүү
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    // localStorage'дан текшерүү
    const localCached = localStorage.getItem(`trans_${cacheKey}`);
    if (localCached) {
      translationCache[cacheKey] = localCached;
      return localCached;
    }

    setIsTranslating(true);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetLang: currentLang,
          sourceLang: 'ky'
        })
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      const translatedText = data.translatedText;

      // Кэшке сактоо
      translationCache[cacheKey] = translatedText;
      localStorage.setItem(`trans_${cacheKey}`, translatedText);

      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Ката болсо оригиналды кайтаруу
    } finally {
      setIsTranslating(false);
    }
  }, [currentLang, isOriginalLang]);

  return {
    translate,
    isTranslating,
    currentLang,
    isOriginalLang
  };
}