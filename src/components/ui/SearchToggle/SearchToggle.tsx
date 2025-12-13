// components/ui/SearchToggle/SearchToggle.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchIcon } from '@/components/ui/icons/SearchIcon';
import Link from 'next/link';
import { categories, navLinks } from '@/constants';
import styles from './SearchToggle.module.scss';

// Social icons - өзүңдүн иконкаларыңды колдон
const socialLinks = [
  { icon: 'FB', href: 'https://facebook.com' },
  { icon: 'X', href: 'https://twitter.com' },
  { icon: 'IG', href: 'https://instagram.com' },
  { icon: 'YT', href: 'https://youtube.com' },
];

export default function SearchToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      inputRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Search Icon Button */}
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(true)}
        aria-label="Издөө"
      >
        <SearchIcon />
      </button>

      {/* Search Overlay */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.container} onClick={(e) => e.stopPropagation()}>
            {/* Search Section */}
            <div className={styles.searchSection}>
              {/* Search Icon */}
              <div className={styles.searchIconLarge}>
                <SearchIcon />
              </div>

              {/* Search Form */}
              <form className={styles.searchForm} onSubmit={handleSearch}>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>
                  Издөө
                </button>
              </form>
            </div>

            {/* Links Grid */}
            <div className={styles.linksGrid}>
              {/* Column 1 - Категориялар */}
              <div className={styles.linksColumn}>
                <h4 className={styles.columnTitle}>Категориялар</h4>
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.id}
                    href={cat.href}
                    className={styles.link}
                    onClick={() => setIsOpen(false)}
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>

              {/* Column 2 - Рубрикалар */}
              <div className={styles.linksColumn}>
                <h4 className={styles.columnTitle}>Рубрикалар</h4>
                <Link href="/section/breaking" className={styles.link} onClick={() => setIsOpen(false)}>Шашылыш кабар</Link>
                <Link href="/section/main" className={styles.link} onClick={() => setIsOpen(false)}>Башкы темалар</Link>
                <Link href="/section/spotlight" className={styles.link} onClick={() => setIsOpen(false)}>Көңүл чордонунда</Link>
                <Link href="/section/editor" className={styles.link} onClick={() => setIsOpen(false)}>Редактордун тандоосу</Link>
              </div>

              {/* Column 3 - Видео */}
              <div className={styles.linksColumn}>
                <h4 className={styles.columnTitle}>Видео</h4>
                <Link href="/video" className={styles.link} onClick={() => setIsOpen(false)}>Бардык видеолор</Link>
                <Link href="/video/interviews" className={styles.link} onClick={() => setIsOpen(false)}>Интервьюлар</Link>
                <Link href="/video/reports" className={styles.link} onClick={() => setIsOpen(false)}>Репортаждар</Link>
                <Link href="/video/live" className={styles.link} onClick={() => setIsOpen(false)}>Түз эфир</Link>
              </div>

              {/* Column 4 - Биз жөнүндө */}
              <div className={styles.linksColumn}>
                <h4 className={styles.columnTitle}>Биз жөнүндө</h4>
                {navLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    className={styles.link}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Icons */}
            <div className={styles.socialSection}>
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Footer Links */}
            <div className={styles.footerSection}>
              <div className={styles.footerLinks}>
                <Link href="/terms" onClick={() => setIsOpen(false)}>Колдонуу шарттары</Link>
                <Link href="/privacy" onClick={() => setIsOpen(false)}>Купуялык саясаты</Link>
                <Link href="/contact" onClick={() => setIsOpen(false)}>Байланыш</Link>
              </div>
              <p className={styles.copyright}>
                © 2025 Сокол Медиа. Бардык укуктар корголгон.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}