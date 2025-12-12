import Link from 'next/link';
import {categories, name_of_site, navLinks} from "@/constants";
import {paths} from "@/config/paths";
import styles from './Header.module.scss';
import NavLinksList from "@/components/ui/NavLinksList";

export default function Header() {
  const videoLink =
    navLinks.find(({ href }) => href === paths.VIDEO);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href={paths.HOME} className={styles.logo}>
          <span className={styles.logoIcon}>N</span>
          <span className={styles.logoText}>{name_of_site}</span>
        </Link>

        <nav className={styles.nav}>
          <NavLinksList className={styles.navLink}/>
          {videoLink && (
            <Link href={videoLink.href} className={styles.navLink}>
              {videoLink.title}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}