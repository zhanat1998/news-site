'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import styles from './LanguageSwitcher.module.scss';

const languages: { code: Language; label: string; fullName: string; flag: string }[] = [
  { code: 'ky', label: 'KG', fullName: 'Кыргызча', flag: '🇰🇬' },
  { code: 'ru', label: 'RU', fullName: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'EN', fullName: 'English', flag: '🇬🇧' },
  { code: 'tr', label: 'TR', fullName: 'Türkçe', flag: '🇹🇷' },
];

export default function LanguageSwitcher() {
  const { currentLang, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  };

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    handleClose();
  };

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <span className={styles.flag}>{currentLanguage.flag}</span>
        <span className={styles.label}>{currentLanguage.label}</span>
        <svg
          className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={`${styles.dropdown} ${isClosing ? styles.closing : ''}`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.option} ${currentLang === lang.code ? styles.active : ''}`}
              onClick={() => handleSelect(lang.code)}
            >
              <span className={styles.optionFlag}>{lang.flag}</span>
              <span className={styles.optionLabel}>{lang.label}</span>
              <span className={styles.optionName}>{lang.fullName}</span>
              {currentLang === lang.code && (
                <svg className={styles.check} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}