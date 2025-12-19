// src/components/search/Pagination/Pagination.tsx
'use client';

import Link from 'next/link';
import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchQuery: string;
}

export default function Pagination({ currentPage, totalPages, searchQuery }: PaginationProps) {
  const getPageUrl = (page: number) => {
    return `/search?q=${encodeURIComponent(searchQuery)}&page=${page}`;
  };

  // Көрсөтүлүүчү баракчалардын саны (мисалы: 1 ... 4 5 [6] 7 8 ... 20)
  const getPageNumbers = () => {
    const delta = 2; // Азыркы беттен канча барак көрсөтүү
    const pages: (number | string)[] = [];

    // Биринчи барак
    pages.push(1);

    // Азыркы беттин тегерегиндеги баракчалар
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      // Эгер алдыңкы барак менен ортосунда боштук болсо
      if (pages[pages.length - 1] !== i - 1) {
        pages.push('...');
      }
      pages.push(i);
    }

    // Акыркы барак
    if (totalPages > 1) {
      if (pages[pages.length - 1] !== totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      {/* Мурунку */}
      {currentPage > 1 && (
        <Link href={getPageUrl(currentPage - 1)} className={styles.arrow}>
          ← Мурунку
        </Link>
      )}

      {/* Баракчалар */}
      <div className={styles.pages}>
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <Link
              key={index}
              href={getPageUrl(page)}
              className={`${styles.page} ${page === currentPage ? styles.active : ''}`}
            >
              {page}
            </Link>
          ) : (
            <span key={index} className={styles.dots}>
              {page}
            </span>
          )
        ))}
      </div>

      {/* Кийинки */}
      {currentPage < totalPages && (
        <Link href={getPageUrl(currentPage + 1)} className={styles.arrow}>
          Кийинки →
        </Link>
      )}
    </div>
  );
}