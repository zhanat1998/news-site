'use client';

import Link from 'next/link';
import styles from './Header.module.scss';
import MobileMenu from '../MobileMenu/MobileMenu';
import SearchToggle from "@/components/ui/SearchToggle/SearchToggle";
import { paths } from "@/config/paths";
import Image from "next/image";
import LanguageSwitcher from "@/components/layout/Header/components/LanguageSwitcher/LanguageSwitcher";
import {usePathname} from "next/navigation";
import { socialLinks } from '@/constants';
import SocialIcons from "@/components/ui/SocialIcons/SocialIcons";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  return (
    <div className="container">
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Row 1 - Logo + Social + Search */}
          <div className={styles.topRow}>
            <div className={styles.left}>
              <div className={styles.burgerDesktop}>
                <MobileMenu />
              </div>
              <Link href={paths.HOME} className={styles.logo}>
                <Image
                  src="/images/logo.png"
                  alt="Сокол Медиа"
                  width={60}
                  height={60}
                  className={styles.logoImage}
                  priority
                />
                <span className={styles.logoText}>Сокол<span className={styles.logoDot}>.Медиа</span></span>
              </Link>
            </div>

            <div className={styles.centerSection}>
              <SocialIcons/>
              <LanguageSwitcher />
            </div>

            <div className={styles.searchDesktop}>
              <SearchToggle />
            </div>
          </div>

          {/* Row 2 - Слоган (Desktop) */}
          {isHomePage && (
            <div className={styles.sloganRow}>
              <p className={styles.slogan}>
                <span className={styles.sloganIcon}>✦</span>
                Канаттын кагылышы, мезгилдин чагылышы.
                <span className={styles.sloganIcon}>✦</span>
              </p>
            </div>
          )}

          {/* Row 2 Mobile - Burger + Search */}
          <div className={styles.mobileRow}>
            <MobileMenu />
            <SearchToggle />
          </div>

          {/* Row 3 Mobile - Слоган - ТОЛЬКО ГЛАВНАЯ */}
          {isHomePage && (
            <div className={styles.sloganRowMobile}>
              <p className={styles.slogan}>
                Канаттын кагылышы, мезгилдин чагылышы.
              </p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}