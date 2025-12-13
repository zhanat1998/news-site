// components/news/NewsGrid/NewsGrid.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './NewsGrid.module.scss';

type NewsItem = {
  title: string;
  slug: string;
  image: string;
  date: string;
};

type Props = {
  title: string;
  items: NewsItem[];
};

export default function NewsGrid({ title, items }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        {title} <span className={styles.dot}>●</span>
      </h2>

      <div className={styles.grid}>
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/news/${item.date}/${item.slug}`}
            className={styles.card}
          >
            <h3 className={styles.title}>{item.title}</h3>
            <div className={styles.imageWrapper}>
              <Image src={item.image} alt={item.title} fill />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}