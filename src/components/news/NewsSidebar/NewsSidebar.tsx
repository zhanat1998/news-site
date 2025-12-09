import Link from 'next/link';
import styles from './NewsSidebar.module.scss';

type NewsItem = {
  title: string;
  slug: string;
};

type Props = {
  title: string;
  items: NewsItem[];
  link?: string;
};

export default function NewsSidebar({ title, items, link }: Props) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {link && (
          <Link href={link} className={styles.more}>
            →
          </Link>
        )}
      </div>
      <div className={styles.list}>
        {items.map((item) => (
          <Link key={item.slug} href={`/news/${item.slug}`} className={styles.item}>
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}