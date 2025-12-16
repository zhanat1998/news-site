'use client';

import { useState, useRef } from 'react';
import { SearchIcon } from '@/components/ui/icons/SearchIcon';
import styles from './SearchToggle.module.scss';

export default function SearchToggle() {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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