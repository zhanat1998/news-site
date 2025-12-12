// components/layout/Header/Header.tsx
import Link from 'next/link';
import styles from './Header.module.scss';
import { name_of_site } from "@/constants";
import MobileMenu from '../MobileMenu/MobileMenu';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <MobileMenu />
        </div>

        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>С</span>
          <span className={styles.logoText}>{name_of_site}</span>
        </Link>

        <div className={styles.right}>
          {/* Бош же кийин кирүү баттону */}
        </div>
      </div>
    </header>
  );
}