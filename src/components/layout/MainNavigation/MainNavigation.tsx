'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from '@/constants';
import styles from './MainNavigation.module.scss';

export default function MainNavigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        <div className={styles.mainLinks}>
          {categories.map((cat) => {
            const isActive = pathname === cat.href || pathname.startsWith(cat.href + '/');

            return (
              <Link
                key={cat.id}
                href={cat.href}
                className={`${styles.link} ${isActive ? styles.active : ''}`}
              >
                {cat.title}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}