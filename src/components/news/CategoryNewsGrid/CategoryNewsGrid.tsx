import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import styles from './CategoryNewsGrid.module.scss';

type NewsItem = {
  title: string;
  slug: { current: string };
  mainImage?: {
    asset: { url: string };
    alt?: string;
  };
  publishedAt: string;
};

type CategoryColumn = {
  title: string;
  slug: string;
  mainNews?: NewsItem;
  smallNews?: NewsItem[];
};

type Props = {
  categories: {
    culture?: CategoryColumn;
    crime?: CategoryColumn;
    ilimBilim?: CategoryColumn;
    sokoldunReportazhdary?: CategoryColumn;
  };
};

function getDateSlug(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

export default function CategoryNewsGrid({ categories }: Props) {
  const categoriesArray = Object.values(categories).filter(Boolean);

  if (categoriesArray.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {categoriesArray.map((category) => {
          const mainItem = category.mainNews;
          const smallItems = category.smallNews;

          if (!mainItem) return null;

          return (
            <div key={category.slug} className={styles.column}>
              {/* Category Title */}
              <Link
                href={`/category/${category.slug}`}
                className={styles.categoryTitle}
              >
                {category.title}
              </Link>

              {/* Main Item */}
              <Link
                href={`/news/${getDateSlug(mainItem.publishedAt)}/${mainItem.slug.current}`}
                className={styles.mainCard}
              >
                <div className={styles.mainImage}>
                  {mainItem.mainImage?.asset?.url && (
                    <Image
                      src={urlFor(mainItem.mainImage).width(500).height(313).quality(75).auto('format').url()}
                      alt={mainItem.mainImage?.alt || mainItem.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  )}
                </div>
                <h3 className={styles.mainTitle}>{mainItem.title}</h3>
              </Link>

              {/* Small Items List */}
              {smallItems && smallItems.length > 0 && (
                <div className={styles.smallList}>
                  {smallItems.map((item) => (
                    <Link
                      key={item.slug.current}
                      href={`/news/${getDateSlug(item.publishedAt)}/${item.slug.current}`}
                      className={styles.smallCard}
                    >
                      <p className={styles.smallTitle}>{item.title}</p>
                      <div className={styles.smallImage}>
                        {item.mainImage?.asset?.url && (
                          <Image
                            src={urlFor(item.mainImage).width(180).height(120).quality(70).auto('format').url()}
                            alt={item.mainImage?.alt || item.title}
                            fill
                            sizes="80px"
                          />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}