import Link from 'next/link';
import Image from 'next/image';
import styles from './NewsHero.module.scss';

type Props = {
  title: string;
  slug: string;
  image: string;
  excerpt: string;
  category: string;
  date: string;
};

export default function NewsHero({ title, slug, image, excerpt, category, date }: Props) {
  return (
    <Link href={`/news/${slug}`} className={styles.hero}>
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={title}
          fill
          priority
          className={styles.image}
        />
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        <span className={styles.category}>{category}</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.excerpt}>{excerpt}</p>
        <span className={styles.date}>{date}</span>
      </div>
    </Link>
  );
}