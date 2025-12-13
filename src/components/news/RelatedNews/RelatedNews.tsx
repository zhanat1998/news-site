import Link from 'next/link';
import Image from 'next/image';
import styles from './RelatedNews.module.scss';

type NewsItem = {
  title: string;
  slug: string;
  image: string;
  excerpt?: string;
  date: string;
  photoCount?: number;
  duration?: string;
  source?: string;
};

type Props = {
  items: NewsItem[];
};

export default function RelatedNews({ items }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        БАЙЛАНЫШТУУ <span className={styles.dot}>●</span>
      </h2>

      <div className={styles.list}>
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/news/${item.date}/${item.slug}`}
            className={styles.card}
          >
            <div className={styles.content}>
              {item.source && (
                <span className={styles.source}>From: {item.source}</span>
              )}
              <h3 className={styles.title}>{item.title}</h3>
              {item.excerpt && (
                <p className={styles.excerpt}>{item.excerpt}</p>
              )}
              <time className={styles.date}>{item.date}</time>
            </div>
            <div className={styles.imageWrapper}>
              <Image src={item.image} alt={item.title} fill />
              {item.photoCount && (
                <span className={styles.photoCount}>📷 {item.photoCount}</span>
              )}
              {item.duration && (
                <span className={styles.duration}>▶ {item.duration}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}