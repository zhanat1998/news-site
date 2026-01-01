'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TranslatedTextProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  postId?: string;
}

// Кэш
const translationCache: Record<string, string> = {};

export default function TranslatedText({
  text,
  as: Component = 'span',
  className,
  postId
}: TranslatedTextProps) {
  const { currentLang, isOriginalLang } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Эгер оригинал тилде болсо, которбойбуз
    if (isOriginalLang || !text) {
      setTranslatedText(text);
      return;
    }

    const cacheKey = postId
      ? `${postId}_${currentLang}_${text.slice(0, 20)}`
      : `${text.slice(0, 50)}_${currentLang}`;

    // Кэштен текшерүү
    if (translationCache[cacheKey]) {
      setTranslatedText(translationCache[cacheKey]);
      return;
    }

    // localStorage'дан текшерүү
    const localCached = typeof window !== 'undefined'
      ? localStorage.getItem(`trans_${cacheKey}`)
      : null;

    if (localCached) {
      translationCache[cacheKey] = localCached;
      setTranslatedText(localCached);
      return;
    }

    // API чакыруу
    const translateText = async () => {
      setIsLoading(true);
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

        if (response.ok) {
          const data = await response.json();
          translationCache[cacheKey] = data.translatedText;
          localStorage.setItem(`trans_${cacheKey}`, data.translatedText);
          setTranslatedText(data.translatedText);
        }
      } catch (error) {
        console.error('Translation error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    translateText();
  }, [text, currentLang, isOriginalLang, postId]);

  return (
    <Component className={className} style={{ opacity: isLoading ? 0.7 : 1 }}>
      {translatedText}
    </Component>
  );
}