import styles from './Footer.module.scss';
import {name_of_site} from "@/constants";
import NavLinksList from "@/components/ui/NavLinksList";
import SocialIcons from "@/components/ui/SocialIcons/SocialIcons";

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
            <h4>Байланыш</h4>
            <a href="mailto:info@newskg.com">info@newskg.com</a>
          </div>

          <div className={styles.social}>
            <h4>Социалдык тармактар</h4>
            <SocialIcons/>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2024 NewsKG. Бардык укуктар корголгон.</p>
        </div>
      </footer>
    </div>
  );
}