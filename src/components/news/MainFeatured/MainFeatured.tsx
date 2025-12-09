import Link from 'next/link';
import Image from 'next/image';
import styles from './MainFeatured.module.scss';

type Props = {
  title: string;
  slug: string;
  image: string;
  category?: string;
};

export default function MainFeatured({ title, slug, image, category }: Props) {
  return (
    <Link href={`/news/${slug}`} className={styles.featured}>
      <div className={styles.imageWrapper}>
        <Image src={image} alt={title} fill priority />
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        {category && <span className={styles.category}>{category}</span>}
        <h2 className={styles.title}>{title}</h2>
      </div>
    </Link>
  );
}