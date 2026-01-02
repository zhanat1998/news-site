import styles from './Footer.module.scss';
import {name_of_site} from "@/constants";
import NavLinksList from "@/components/ui/NavLinksList";
import SocialIcons from "@/components/ui/SocialIcons/SocialIcons";
import Link from 'next/link';

export default function Footer() {
  return (
    <div className="container">
      <footer className={styles.footer}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h3>{name_of_site}</h3>
            <p>Кыргызстандын көз карандысыз жаңылыктар булагы</p>
          </div>

          <div className={styles.links}>
            <h4>Категориялар</h4>
            <NavLinksList/>
          </div>

          <div className={styles.links}>
            <h4>Маалымат</h4>
            <Link href="/about">Биз жөнүндө</Link>
            <a href="mailto:info@sokol.media">info@sokol.media</a>
          </div>

          <div className={styles.social}>
            <h4>Социалдык тармактар</h4>
            <SocialIcons/>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2024 Сокол.Медиа. Бардык укуктар корголгон.</p>
        </div>
      </footer>
    </div>
  );
}