import Link from 'next/link';
import styles from './Footer.module.scss';
import {name_of_site, navLinks} from "@/constants";
import NavLinksList from "@/components/ui/NavLinksList";
import {paths} from "@/config/paths";
import TelegramWhiteIcon from "@/components/ui/icons/TelegramLogoIcon";
import FaceBookLogoIcon from "@/components/ui/icons/FaceBookLogoIcon";
import YoutubeIcon from "@/components/ui/icons/YoutubeLogoIcon";
import InstagramIcon from "@/components/ui/icons/InstagramLogoIcon";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
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
            {navLinks.filter(({ href }) => href !== paths.VIDEO)
              .map(({ id, href, title }) => (
              <Link key={id} href={href}>
                {title}
              </Link>
            ))}
            <a href="mailto:info@newskg.com">info@newskg.com</a>
          </div>

          <div className={styles.social}>
            <h4>Социалдык тармактар</h4>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Facebook"><FaceBookLogoIcon/></a>
              <a href="#" aria-label="Instagram"><InstagramIcon/></a>
              <a href="#" aria-label="YouTube"><YoutubeIcon/></a>
              <a href="#" aria-label="Telegram"><TelegramWhiteIcon/></a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2024 NewsKG. Бардык укуктар корголгон.</p>
        </div>
      </div>
    </footer>
  );
}