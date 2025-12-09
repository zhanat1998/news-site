import Link from 'next/link';
import Image from 'next/image';
import styles from './NewsCard.module.scss';

type Props = {
  title: string;
  slug: string;
  image: string;
  excerpt?: string;
  category?: string;
  date?: string;
  variant?: 'default' | 'small' | 'horizontal';
};

export default function NewsCard({
 title,
 slug,
 image,
 excerpt,
 category,
 date,
 variant = 'default'
}: Props) {
  return (
    <Link href={`/news/${slug}`} className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={title}
          fill
          className={styles.image}
        />
        {category && <span className={styles.category}>{category}</span>}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
        {date && <span className={styles.date}>{date}</span>}
      </div>
    </Link>
  );
}