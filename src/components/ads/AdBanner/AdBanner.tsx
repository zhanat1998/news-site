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
  image: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  link: string;
}

interface AdBannerProps {
  placement: 'home_top' | 'home_middle' | 'home_bottom' | 'category_page';
  className?: string;
}

async function getAd(placement: string): Promise<Ad | null> {
  const ad = await client.fetch<Ad | null>(
    groq`*[_type == "ad" && placement == $placement][0] {
      _id,
      title,
      placement,
      image,
      link
    }`,
    { placement },
    { next: { revalidate: 60, tags: ['ads'] } }
  );

  return ad;
}

async function getAds(placement: string, limit: number = 3): Promise<Ad[]> {
  const ads = await client.fetch<Ad[]>(
    groq`*[_type == "ad" && placement == $placement][0...$limit] {
      _id,
      title,
      placement,
      image,
      link
    }`,
    { placement, limit: limit - 1 },
    { next: { revalidate: 60, tags: ['ads'] } }
  );

  return ads || [];
}

export default async function AdBanner({ placement, className = '' }: AdBannerProps) {
  // home_top үчүн бир эле жарнаманы 3 жолу көрсөт (desktop)
  if (placement === 'home_top') {
    const ad = await getAd(placement);

    if (!ad || !ad.image) {
      return null;
    }

    const imageUrl = urlFor(ad.image).width(600).quality(85).auto('format').url();

    return (
      <div className={`${styles.adBannerRow} ${className}`} data-ad-placement={placement}>
        <span className={styles.adLabel}>Жарнама</span>
        <div className={styles.adGrid}>
          {[1, 2, 3].map((i) => (
            <Link
              key={i}
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className={styles.adGridItem}
            >
              <Image
                src={imageUrl}
                alt={ad.image.alt || ad.title}
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
  const ad = await getAd(placement);

  if (!ad || !ad.image) {
    return null;
  }

  const imageUrl = urlFor(ad.image).width(1600).quality(90).auto('format').url();
  const placementClass = styles[placement] || '';

  return (
    <div
      className={`${styles.adBanner} ${placementClass} ${className}`}
      data-ad-placement={placement}
    >
      <span className={styles.adLabel}>Жарнама</span>
      <Link
        href={ad.link}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={styles.adLink}
      >
        <div className={styles.imageContainer}>
          <Image
            src={imageUrl}
            alt={ad.image.alt || ad.title}
            width={1600}
            height={600}
            className={styles.adImage}
          />
        </div>
      </Link>
    </div>
  );
}
