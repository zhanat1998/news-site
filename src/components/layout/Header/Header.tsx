import Link from 'next/link';
import styles from './Header.module.scss';
import { name_of_site } from "@/constants";
import MobileMenu from '../MobileMenu/MobileMenu';
import SearchToggle from "@/components/ui/SearchToggle/SearchToggle";
import {paths} from "@/config/paths";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <MobileMenu />
        </div>

        <Link href={paths.HOME} className={styles.logo}>
          <span className={styles.logoIcon}>С</span>
          <span className={styles.logoText}>{name_of_site}</span>
        </Link>

        <div className={styles.right}>
          <SearchToggle />
        </div>
      </div>
    </header>
  );
}