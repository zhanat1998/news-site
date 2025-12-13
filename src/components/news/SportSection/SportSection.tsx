// components/news/SportSection/SportSection.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './SportSection.module.scss';

type NewsItem = {
  title: string;
  slug: string;
  image: string;
  excerpt?: string;
  label?: string;
};

type Props = {
  bannerImage: string;
  mainNews: NewsItem;
  sideNews: NewsItem[];
  link?: string;
};

export default function SportSection({ bannerImage, mainNews, sideNews, link }: Props) {
  return (
    <section className={styles.section}>
      {/* Banner */}
      <div className={styles.banner}>
        <Image src={bannerImage} alt="Спорт" fill priority />
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
          <Link href={`/news/${mainNews.slug}`} className={styles.mainCard}>
            <div className={styles.mainImage}>
              <Image src={mainNews.image} alt={mainNews.title} fill />
            </div>
            {mainNews.label && (
              <span className={styles.mainLabel}>{mainNews.label}</span>
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
              key={news.slug}
              href={`/news/${news.slug}`}
              className={styles.sideCard}
            >
              <div className={styles.sideImage}>
                <Image src={news.image} alt={news.title} fill />
              </div>
              <h3 className={styles.sideTitle}>{news.title}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Link */}
      {link && (
        <div className={styles.footer}>
          <Link href={link} className={styles.footerLink}>
            Баарын көрүү
          </Link>
        </div>
      )}
    </section>
  );
}