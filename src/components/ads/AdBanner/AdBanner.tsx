import { getAdsByPlacement } from '@/lib/sanity/api';
import { AdBannerClient } from './AdBannerClient';
import styles from './AdBanner.module.scss';

interface AdBannerProps {
  placement: 'home_top' | 'home_middle' | 'home_bottom' | 'category_page';
  className?: string;
}

export default async function AdBanner({ placement, className = '' }: AdBannerProps) {
  const ads = await getAdsByPlacement(placement);

  if (!ads || ads.length === 0) return null;

  const ad = ads[0];
  const imageUrl = ad?.image?.asset?.url || '/placeholder.jpg';
  if (imageUrl === '/placeholder.jpg') return null;

  const imageAlt = ad.imageAlt || ad.title;
  const href = ad.link || '#';

  // home_top үчүн бир эле жарнаманы 3 жолу көрсөт (desktop)
  if (placement === 'home_top') {
    return (
      <div className={`${styles.adBannerRow} ${className}`} data-ad-placement={placement}>
        <span className={styles.adLabel}>Жарнама</span>
        <div className={styles.adGrid}>
          {[1, 2, 3].map((i) => (
            <AdBannerClient
              key={i}
              href={href}
              imageUrl={imageUrl}
              imageAlt={imageAlt}
              advertiser={ad.title}
              placement={placement}
              adId={ad._id}
              linkClassName={styles.adGridItem}
              imageWidth={600}
              imageHeight={400}
              imageClassName={styles.adGridImage}
            />
          ))}
        </div>
      </div>
    );
  }

  const placementClass = styles[placement] || '';

  return (
    <div
      className={`${styles.adBanner} ${placementClass} ${className}`}
      data-ad-placement={placement}
    >
      <span className={styles.adLabel}>Жарнама</span>
      <div className={styles.imageContainer}>
        <AdBannerClient
          href={href}
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          advertiser={ad.title}
          placement={placement}
          adId={ad._id}
          linkClassName={styles.adLink}
          imageWidth={1600}
          imageHeight={600}
          imageClassName={styles.adImage}
        />
      </div>
    </div>
  );
}
