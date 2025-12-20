import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import styles from './CategoryColumns.module.scss';

type NewsItem = {
  title: string;
  slug: { current: string };
  publishedAt: string;
};

type MainNews = {
  title: string;
  excerpt: string;
  slug: { current: string };
  mainImage?: {
    asset: { url: string };
    alt?: string;
  };
  publishedAt: string;
};

type CategoryData = {
  title: string;
  slug: string;
  mainNews: MainNews;
  links: NewsItem[];
};

type Props = {
  categories: {
    politics?: CategoryData;
    society?: CategoryData;
    economy?: CategoryData;
    world?: CategoryData;
  };
};

function getDateSlug(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

export default function CategoryColumns({ categories }: Props) {
  // Object'ти array'га айландырабыз
  const categoriesArray = Object.values(categories).filter(Boolean);

  if (categoriesArray.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {categoriesArray.map((category) => (
          <div key={category.slug} className={styles.column}>
            {/* Category Header */}
            <Link href={`/category/${category.slug}`} className={styles.categoryHeader}>
              {category.title} <span className={styles.arrow}>›</span>
            </Link>

            {/* Main News */}
            {category.mainNews && (
              <Link
                href={`/news/${getDateSlug(category.mainNews.publishedAt)}/${category.mainNews.slug.current}`}
                className={styles.mainCard}
              >
                {category.mainNews.mainImage?.asset?.url && (
                  <div className={styles.mainImage}>
                    <Image
                      src={urlFor(category.mainNews.mainImage).width(400).height(250).url()}
                      alt={category.mainNews.mainImage.alt || category.mainNews.title}
                      fill
                    />
                  </div>
                )}
                <h3 className={styles.mainTitle}>{category.mainNews.title}</h3>
                <p className={styles.mainExcerpt}>{category.mainNews.excerpt}</p>
              </Link>
            )}

            {/* Links List */}
            {category.links && category.links.length > 0 && (
              <div className={styles.linksList}>
                {category.links.map((link) => (
                  <Link
                    key={link.slug.current}
                    href={`/news/${getDateSlug(link.publishedAt)}/${link.slug.current}`}
                    className={styles.linkItem}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}