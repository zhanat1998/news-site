// components/news/CategoryColumns/CategoryColumns.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './CategoryColumns.module.scss';

type NewsItem = {
  title: string;
  slug: string;
  isVideo?: boolean;
};

type CategoryData = {
  title: string;
  slug: string;
  mainNews: {
    title: string;
    slug: string;
    image: string;
    excerpt: string;
  };
  links: NewsItem[];
};

type Props = {
  categories: CategoryData[];
};

export default function CategoryColumns({ categories }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {categories.map((category) => (
          <div key={category.slug} className={styles.column}>
            {/* Category Header */}
            <Link href={`/category/${category.slug}`} className={styles.categoryHeader}>
              {category.title} <span className={styles.arrow}>›</span>
            </Link>

            {/* Main News */}
            <Link href={`/news/${category.mainNews.slug}`} className={styles.mainCard}>
              <div className={styles.mainImage}>
                <Image
                  src={category.mainNews.image}
                  alt={category.mainNews.title}
                  fill
                />
              </div>
              <h3 className={styles.mainTitle}>{category.mainNews.title}</h3>
              <p className={styles.mainExcerpt}>{category.mainNews.excerpt}</p>
            </Link>

            {/* Links List */}
            <div className={styles.linksList}>
              {category.links.map((link) => (
                <Link
                  key={link.slug}
                  href={`/news/${link.slug}`}
                  className={styles.linkItem}
                >
                  {link.isVideo && (
                    <span className={styles.videoIcon}>▶</span>
                  )}
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}