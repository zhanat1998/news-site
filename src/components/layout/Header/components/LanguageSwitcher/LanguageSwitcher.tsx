'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './LanguageSwitcher.module.scss';

const languages = [
  { code: 'ky', label: 'KG', fullName: 'Кыргызча' },
  { code: 'ru', label: 'RU', fullName: 'Русский' },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = (lang: typeof languages[0]) => {
    setCurrentLang(lang);
    handleClose();
  };

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <span className={styles.label}>{currentLang.label}</span>
      </button>

      {isOpen && (
        <div className={`${styles.dropdown} ${isClosing ? styles.closing : ''}`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.option} ${currentLang.code === lang.code ? styles.active : ''}`}
              onClick={() => handleSelect(lang)}
            >
              <span className={styles.optionLabel}>{lang.label}</span>
              <span className={styles.optionName}>{lang.fullName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}