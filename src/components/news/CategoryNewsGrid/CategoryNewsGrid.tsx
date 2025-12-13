// components/news/CategoryNewsGrid/CategoryNewsGrid.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './CategoryNewsGrid.module.scss';

type NewsItem = {
  title: string;
  slug: string;
  image: string;
};

type CategoryColumn = {
  title: string;
  slug: string;
  mainNews: NewsItem;
  smallNews: NewsItem[];
};

type Props = {
  categories: CategoryColumn[];
};

export default function CategoryNewsGrid({ categories }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {categories.map((category) => (
          <div key={category.slug} className={styles.column}>
            {/* Category Title */}
            <Link href={`/category/${category.slug}`} className={styles.categoryTitle}>
              {category.title}
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
            </Link>

            {/* Small News List */}
            <div className={styles.smallList}>
              {category.smallNews.map((news) => (
                <Link
                  key={news.slug}
                  href={`/news/${news.slug}`}
                  className={styles.smallCard}
                >
                  <p className={styles.smallTitle}>{news.title}</p>
                  <div className={styles.smallImage}>
                    <Image src={news.image} alt={news.title} fill />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}