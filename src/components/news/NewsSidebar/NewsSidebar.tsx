import Link from 'next/link';
import styles from './NewsSidebar.module.scss';
import {SectionTitles} from "@/constants";
import {paths} from "@/config/paths";

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
  const maxItems = 9;
  const hasMore = items.length > maxItems;

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
        {items.slice(0, maxItems).map((item) => (
          <Link key={item.slug} href={`/news/${item.slug}`} className={styles.item}>
            {item.title}
          </Link>
        ))}
      </div>
      {hasMore && (
        <Link href={paths.NEWS} className={styles.allNews}>
          Бардык жаңылыктар
        </Link>
      )}
    </div>
  );
}