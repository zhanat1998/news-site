import Link from 'next/link';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h3>NewsKG</h3>
            <p>Кыргызстандын көз карандысыз жаңылыктар булагы</p>
          </div>

          <div className={styles.links}>
            <h4>Категориялар</h4>
            <Link href="/category/politics">Саясат</Link>
            <Link href="/category/society">Коом</Link>
            <Link href="/category/economy">Экономика</Link>
            <Link href="/category/culture">Маданият</Link>
          </div>

          <div className={styles.links}>
            <h4>Байланыш</h4>
            <Link href="/about">Биз жөнүндө</Link>
            <Link href="/contact">Байланыш</Link>
            <a href="mailto:info@newskg.com">info@newskg.com</a>
          </div>

          <div className={styles.social}>
            <h4>Социалдык тармактар</h4>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="YouTube">▶️</a>
              <a href="#" aria-label="Telegram">✈️</a>
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