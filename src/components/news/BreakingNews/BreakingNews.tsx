import Link from 'next/link';
import styles from './BreakingNews.module.scss';

type BreakingNewsItem = {
  title: string;
  slug: string;
};

type Props = {
  items: BreakingNewsItem[];
};

export default function BreakingNews({ items }: Props) {
  return (
    <div className={styles.breaking}>
      <div className={styles.container}>
        {items.map((item) => (
          <Link key={item.slug} href={`/news/${item.slug}`} className={styles.item}>
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}