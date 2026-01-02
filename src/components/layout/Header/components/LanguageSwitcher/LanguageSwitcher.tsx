'use client';

import styles from './LanguageSwitcher.module.scss';

// TODO: Кийин тилдерди кошобуз
// const languages: { code: Language; label: string; fullName: string; flag: string }[] = [
//   { code: 'ky', label: 'KG', fullName: 'Кыргызча', flag: '🇰🇬' },
//   { code: 'ru', label: 'RU', fullName: 'Русский', flag: '🇷🇺' },
//   { code: 'en', label: 'EN', fullName: 'English', flag: '🇬🇧' },
//   { code: 'tr', label: 'TR', fullName: 'Türkçe', flag: '🇹🇷' },
// ];

export default function LanguageSwitcher() {
  // Азырынча disabled - кийин тил которуу функциясын кошобуз
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.trigger} ${styles.disabled}`}>
        <span className={styles.flag}>🇰🇬</span>
        <span className={styles.label}>KG</span>
      </div>
    </div>
  );
}