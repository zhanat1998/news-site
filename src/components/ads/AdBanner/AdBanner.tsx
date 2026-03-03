import Image from 'next/image';
import Link from 'next/link';
import { getAdsByPlacement } from '@/lib/strapi/api';
import { getStrapiImageUrl } from '@/lib/strapi/client';
import styles from './AdBanner.module.scss';

interface AdBannerProps {
  placement: 'home_top' | 'home_middle' | 'home_bottom' | 'category_page';
  className?: string;
}

// Map frontend placement names to Strapi placement values
const placementMap: Record<string, string> = {
  'home_top': 'header',
  'home_middle': 'sidebar',
  'home_bottom': 'footer',
  'category_page': 'article',
};

export default async function AdBanner({ placement, className = '' }: AdBannerProps) {
  const strapiPlacement = placementMap[placement] || placement;
  const ads = await getAdsByPlacement(strapiPlacement);

  if (!ads || ads.length === 0) {
    return null;
  }

  const ad = ads[0];
  const imageUrl = getStrapiImageUrl(ad.image?.[0]);

  if (imageUrl === '/placeholder.jpg') {
    return null;
  }

  // home_top үчүн бир эле жарнаманы 3 жолу көрсөт (desktop)
  if (placement === 'home_top') {
    return (
      <div className={`${styles.adBannerRow} ${className}`} data-ad-placement={placement}>
        <span className={styles.adLabel}>Жарнама</span>
        <div className={styles.adGrid}>
          {[1, 2, 3].map((i) => (
            <Link
              key={i}
              href={ad.link || '#'}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className={styles.adGridItem}
            >
              <Image
                src={imageUrl}
                alt={ad.imageAlt || ad.title}
                width={600}
                height={400}
                className={styles.adGridImage}
              />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Башка placement үчүн 1 жарнама
  const placementClass = styles[placement] || '';

  return (
    <div
      className={`${styles.adBanner} ${placementClass} ${className}`}
      data-ad-placement={placement}
    >
      <span className={styles.adLabel}>Жарнама</span>
      <Link
        href={ad.link || '#'}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={styles.adLink}
      >
        <div className={styles.imageContainer}>
          <Image
            src={imageUrl}
            alt={ad.imageAlt || ad.title}
            width={1600}
            height={600}
            className={styles.adImage}
          />
        </div>
      </Link>
    </div>
  );
}
