'use client';

import { Suspense } from 'react';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { SearchIcon } from '@/components/ui/icons/SearchIcon';
import styles from './SearchToggle.module.scss';

function SearchToggleContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const queryFromUrl = searchParams.get('q');

    if (pathname === '/search' && queryFromUrl) {
      setSearchQuery(decodeURIComponent(queryFromUrl));
    } else {
      setSearchQuery('');
    }
  }, [searchParams, pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSearch}>
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Издөө..."
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton}>
        <SearchIcon />
      </button>
    </form>
  );
}

export default function SearchToggle() {
  return (
    <Suspense fallback={
      <form className={styles.searchForm}>
        <input
          type="text"
          placeholder="Издөө..."
          className={styles.searchInput}
          disabled
        />
        <button type="submit" className={styles.searchButton} disabled>
          <SearchIcon />
        </button>
      </form>
    }>
      <SearchToggleContent />
    </Suspense>
  );
}