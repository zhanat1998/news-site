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

type VideoItem = {
  title: string;
  slug: { current: string };
  thumbnail?: {
    asset: { url: string };
  };
  bunnyVideoId?: string;
  duration?: string;
  publishedAt: string;
};

type CategoryColumn = {
  title: string;
  slug: string;
  mainNews?: NewsItem;
  smallNews?: NewsItem[];
  mainVideo?: VideoItem;
  smallVideos?: VideoItem[];
};

type Props = {
  categories: {
    culture?: CategoryColumn;
    crime?: CategoryColumn;
    reportage?: CategoryColumn;
    video?: CategoryColumn;
  };
};

function getDateSlug(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

function getVideoThumbnail(video: VideoItem) {
  if (video.thumbnail?.asset?.url) {
    return video.thumbnail.asset.url;
  }
  if (video.bunnyVideoId) {
    return `https://vz-0a81affa-d72.b-cdn.net/${video.bunnyVideoId}/thumbnail.jpg`;
  }
  return '/placeholder-video.jpg';
}

export default function CategoryNewsGrid({ categories }: Props) {
  // Object'ти array'га айландырабыз
  const categoriesArray = Object.values(categories).filter(Boolean);

  if (categoriesArray.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {categoriesArray.map((category) => {
          const isVideo = category.slug === 'video';
          const mainItem = isVideo ? category.mainVideo : category.mainNews;
          const smallItems = isVideo ? category.smallVideos : category.smallNews;

          if (!mainItem) return null;

          return (
            <div key={category.slug} className={styles.column}>
              {/* Category Title */}
              <Link
                href={isVideo ? '/video' : `/category/${category.slug}`}
                className={styles.categoryTitle}
              >
                {category.title}
              </Link>

              {/* Main Item */}
              <Link
                href={
                  isVideo
                    ? `/video/${mainItem.slug.current}`
                    : `/news/${getDateSlug(mainItem.publishedAt)}/${mainItem.slug.current}`
                }
                className={styles.mainCard}
              >
                <div className={styles.mainImage}>
                  {isVideo ? (
                    <>
                      <Image
                        src={getVideoThumbnail(mainItem as VideoItem)}
                        alt={mainItem.title}
                        fill
                      />
                      {(mainItem as VideoItem).duration && (
                        <span className={styles.duration}>
                          ▶ {(mainItem as VideoItem).duration}
                        </span>
                      )}
                    </>
                  ) : (
                    (mainItem as NewsItem).mainImage?.asset?.url && (
                      <Image
                        src={urlFor((mainItem as NewsItem).mainImage!).width(400).height(250).url()}
                        alt={(mainItem as NewsItem).mainImage?.alt || mainItem.title}
                        fill
                      />
                    )
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
                      href={
                        isVideo
                          ? `/video/${item.slug.current}`
                          : `/news/${getDateSlug(item.publishedAt)}/${item.slug.current}`
                      }
                      className={styles.smallCard}
                    >
                      <p className={styles.smallTitle}>{item.title}</p>
                      <div className={styles.smallImage}>
                        {isVideo ? (
                          <>
                            <Image
                              src={getVideoThumbnail(item as VideoItem)}
                              alt={item.title}
                              fill
                            />
                            {(item as VideoItem).duration && (
                              <span className={styles.smallDuration}>
                                ▶ {(item as VideoItem).duration}
                              </span>
                            )}
                          </>
                        ) : (
                          (item as NewsItem).mainImage?.asset?.url && (
                            <Image
                              src={urlFor((item as NewsItem).mainImage!).width(120).height(80).url()}
                              alt={(item as NewsItem).mainImage?.alt || item.title}
                              fill
                            />
                          )
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