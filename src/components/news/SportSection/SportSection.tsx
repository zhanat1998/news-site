import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import styles from './SportSection.module.scss';

type NewsItem = {
  title: string;
  slug: { current: string };
  mainImage?: {
    asset: { url: string };
    alt?: string;
  };
  excerpt?: string;
  publishedAt: string;
  section?: string;
};

type Props = {
  banner?: {
    mainImage?: {
      asset: { url: string };
    };
  };
  mainNews?: NewsItem;
  sideNews?: NewsItem[];
};

function getDateSlug(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

export default function SportSection({ banner, mainNews, sideNews }: Props) {
  // Эгер маалымат жок болсо, көрсөтпөйбүз
  if (!mainNews || !sideNews || sideNews.length === 0) {
    return null;
  }

  const bannerImage = banner?.mainImage?.asset?.url || mainNews.mainImage?.asset?.url || '';

  // Section label (Breaking, Hero, ж.б.)
  const getSectionLabel = (section?: string) => {
    if (section === 'breaking') return 'ШАШЫЛЫШ';
    if (section === 'hero') return 'БАШКЫ';
    if (section === 'investigation') return 'ИЛИКТӨӨ';
    return null;
  };

  return (
    <section className={styles.section}>
      {/* Banner */}
      <div className={styles.banner}>
        {bannerImage && (
          <Image
            src={urlFor({ asset: { url: bannerImage } }).width(1400).height(300).url()}
            alt="Спорт"
            fill
            priority
          />
        )}
        <div className={styles.bannerOverlay} />
        <div className={styles.bannerTitle}>
          <span className={styles.bannerAccent}></span>
          Спорт
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Left - Main News */}
        <div className={styles.mainNews}>
          <Link
            href={`/news/${getDateSlug(mainNews.publishedAt)}/${mainNews.slug.current}`}
            className={styles.mainCard}
          >
            {mainNews.mainImage?.asset?.url && (
              <div className={styles.mainImage}>
                <Image
                  src={urlFor(mainNews.mainImage).width(600).height(400).url()}
                  alt={mainNews.mainImage.alt || mainNews.title}
                  fill
                />
              </div>
            )}

            {getSectionLabel(mainNews.section) && (
              <span className={styles.mainLabel}>
                {getSectionLabel(mainNews.section)}
              </span>
            )}

            <h2 className={styles.mainTitle}>{mainNews.title}</h2>

            {mainNews.excerpt && (
              <p className={styles.mainExcerpt}>{mainNews.excerpt}</p>
            )}
          </Link>
        </div>

        {/* Right - Side News */}
        <div className={styles.sideNews}>
          {sideNews.map((news) => (
            <Link
              key={news.slug.current}
              href={`/news/${getDateSlug(news.publishedAt)}/${news.slug.current}`}
              className={styles.sideCard}
            >
              {news.mainImage?.asset?.url && (
                <div className={styles.sideImage}>
                  <Image
                    src={urlFor(news.mainImage).width(200).height(130).url()}
                    alt={news.mainImage.alt || news.title}
                    fill
                  />
                </div>
              )}
              <h3 className={styles.sideTitle}>{news.title}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Link */}
      <div className={styles.footer}>
        <Link href="/category/wp-7" className={styles.footerLink}>
          Баарын көрүү
        </Link>
      </div>
    </section>
  );
}