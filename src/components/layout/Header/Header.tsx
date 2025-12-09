import Link from 'next/link';
import styles from './Header.module.scss';

const categories = [
  { title: 'САЯСАТ', slug: 'politics' },
  { title: 'КООМ', slug: 'society' },
  { title: 'ЭКОНОМИКА', slug: 'economy' },
  { title: 'ДҮЙНӨ', slug: 'world' },
  { title: 'МАДАНИЯТ', slug: 'culture' },
  { title: 'СПОРТ', slug: 'sport' },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>N</span>
          <span className={styles.logoText}>NewsKG</span>
        </Link>

        <nav className={styles.nav}>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={styles.navLink}
            >
              {cat.title}
            </Link>
          ))}
          <Link href="/video" className={styles.navLink}>
            ВИДЕО
          </Link>
        </nav>
      </div>
    </header>
  );
}