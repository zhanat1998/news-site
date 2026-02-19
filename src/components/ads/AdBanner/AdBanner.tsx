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
    { next: { revalidate: 3600, tags: ['ads'] } }
  );

  return ad;
}

export default async function AdBanner({ placement, className = '' }: AdBannerProps) {
  const ad = await getAd(placement);

  if (!ad || !ad.image) {
    return null;
  }

  const imageUrl = urlFor(ad.image).width(1200).height(200).quality(85).auto('format').url();

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
            width={1200}
            height={200}
            className={styles.adImage}
            priority={placement === 'home_top'}
          />
        </div>
      </Link>
    </div>
  );
}
