'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import { categories, navLinks } from '@/constants';
import styles from './MobileMenu.module.scss';
import {MenuIcon} from "@/components/ui/icons/menuIcon";
import {CloseIcon} from "@/components/ui/icons/CloseIcon";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div className={styles.triggers}>
        <MenuIcon onClick={() => setIsOpen(true)} className={styles.menuButton}/>
      </div>

      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}
      {isOpen && (
        <div className={styles.wrapper}>
          <div
            className={styles.overlay}
            onClick={() => setIsOpen(false)}
          />

          <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.header}>
              <button
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
              >
                <CloseIcon/>
              </button>
            </div>

            <nav className={styles.nav}>
              <Link
                href="/"
                className={styles.navItem}
                onClick={() => setIsOpen(false)}
              >
                Башкы бет
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className={styles.navItem}
                  onClick={() => setIsOpen(false)}
                >
                  {cat.title}
                </Link>
              ))}

              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={styles.navItem}
                  onClick={() => setIsOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}