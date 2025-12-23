import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { urlFor } from '@/sanity/lib/image';
import styles from './AdBanner.module.scss';

interface Ad {
  _id: string;
  title: string;
  placement: string;
  adType: 'image' | 'html';
  image?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  link?: string;
  htmlCode?: string;
  size?: string;
  isActive: boolean;
}

interface AdBannerProps {
  placement: 'home_top' | 'home_middle' | 'sidebar' | 'in_article' | 'video_section' | 'category_page' | 'above_footer';
  className?: string;
}

const sizeMap: Record<string, { width: number; height: number }> = {
  '728x90': { width: 728, height: 90 },
  '970x90': { width: 970, height: 90 },
  '468x60': { width: 468, height: 60 },
  '300x250': { width: 300, height: 250 },
  '160x600': { width: 160, height: 600 },
  '300x600': { width: 300, height: 600 },
  '970x250': { width: 970, height: 250 },
  '320x50': { width: 320, height: 50 },
  '320x100': { width: 320, height: 100 },
  'responsive': { width: 1200, height: 200 },
};

async function getAd(placement: string): Promise<Ad | null> {
  const now = new Date().toISOString();

  const ad = await client.fetch<Ad | null>(
    groq`*[_type == "ad" && placement == $placement && isActive == true &&
      (startDate == null || startDate <= $now) &&
      (endDate == null || endDate >= $now)
    ] | order(priority desc) [0] {
      _id,
      title,
      placement,
      adType,
      image,
      link,
      htmlCode,
      size,
      isActive
    }`,
    { placement, now },
    { next: { revalidate: 60 } }
  );

  return ad;
}

export default async function AdBanner({ placement, className = '' }: AdBannerProps) {
  const ad = await getAd(placement);

  if (!ad) {
    return null;
  }

  const size = sizeMap[ad.size || 'responsive'];

  const placementClass = styles[placement] || '';

  if (ad.adType === 'html' && ad.htmlCode) {
    return (
      <div
        className={`${styles.adBanner} ${placementClass} ${className}`}
        data-ad-placement={placement}
      >
        <span className={styles.adLabel}>Жарнама</span>
        <div
          className={styles.htmlContainer}
          dangerouslySetInnerHTML={{ __html: ad.htmlCode }}
        />
      </div>
    );
  }

  if (ad.adType === 'image' && ad.image) {
    const imageUrl = urlFor(ad.image).width(size.width).height(size.height).url();

    const content = (
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={ad.image.alt || ad.title}
          width={size.width}
          height={size.height}
          className={styles.adImage}
          priority={placement === 'home_top'}
        />
      </div>
    );

    return (
      <div
        className={`${styles.adBanner} ${placementClass} ${className}`}
        data-ad-placement={placement}
      >
        <span className={styles.adLabel}>Жарнама</span>
        {ad.link ? (
          <Link
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={styles.adLink}
          >
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    );
  }

  return null;
}