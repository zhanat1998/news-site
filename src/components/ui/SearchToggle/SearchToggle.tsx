'use client';

import { Suspense } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { SearchIcon } from '@/components/ui/icons/SearchIcon';
import Link from 'next/link';
import styles from './SearchToggle.module.scss';
import { formatDateForUrl } from '@/utils/date';

interface Suggestion {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
}

function SearchToggleContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const queryFromUrl = searchParams.get('q');

    if (pathname === '/search' && queryFromUrl) {
      setSearchQuery(decodeURIComponent(queryFromUrl));
    } else {
      setSearchQuery('');
    }
  }, [searchParams, pathname]);

  // Сырттан басканда жабуу
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Сунуштарды алуу
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search-suggestions?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced издөө
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedIndex(-1);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length >= 2) {
      setShowSuggestions(true);
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Клавиатура менен башкаруу
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[selectedIndex];
      window.location.href = `/news/${formatDateForUrl(selected.publishedAt)}/${selected.slug}`;
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
  };

  return (
    <div className={styles.searchWrapper} ref={wrapperRef}>
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
          placeholder="Издөө..."
          className={styles.searchInput}
          autoComplete="off"
        />
        <button type="submit" className={styles.searchButton}>
          <SearchIcon />
        </button>
      </form>

      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className={styles.suggestions}>
          {isLoading ? (
            <div className={styles.loading}>Издөө...</div>
          ) : (
            suggestions.map((item, index) => (
              <Link
                key={item._id}
                href={`/news/${formatDateForUrl(item.publishedAt)}/${item.slug}`}
                className={`${styles.suggestionItem} ${index === selectedIndex ? styles.selected : ''}`}
                onClick={handleSuggestionClick}
              >
                <SearchIcon />
                <span>{item.title}</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchToggle() {
  return (
    <Suspense fallback={
      <div className={styles.searchWrapper}>
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
      </div>
    }>
      <SearchToggleContent />
    </Suspense>
  );
}