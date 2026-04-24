// app/category/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import styles from './page.module.scss';
import CategorySkeleton from "@/components/category/CategorySkeleton";
import ShowMoreButton from "@/components/ui/ShowMoreButton/ShowMoreButton";
import AdBanner from "@/components/ads/AdBanner";
import MainContainer from "@/components/ui/MainContainer/MainContainer";
import VideoCarousel from "@/components/video/VideoCarousel/VideoCarousel";
import InstagramCarousel from "@/components/video/InstagramCarousel/InstagramCarousel";

// Sanity imports
import {
  getCategoryBySlug,
  getPostsByCategory,
  getVideosByCategory,
} from '@/lib/sanity/api';
import { adaptPosts, adaptVideos, formatVideosForCarousel } from '@/lib/sanity/adapters';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getCategoryPageData(categorySlug: string) {
  const [category, postsRaw, videosRaw] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getPostsByCategory(categorySlug, 15),
    getVideosByCategory(categorySlug, 10),
  ]);

  if (!category) {
    return null;
  }

  const posts = adaptPosts(postsRaw);
  const videos = adaptVideos(videosRaw);

  // Split videos by type
  const youtubeVideos = videosRaw.filter(v =>
    v.videoSource === 'youtube' || (v.youtubeUrl && v.youtubeUrl.length > 0)
  );
  const instagramVideos = videosRaw.filter(v =>
    v.videoSource === 'instagram' || (v.instagramUrl && v.instagramUrl.length > 0)
  );

  return {
    category: {
      _id: category.documentId,
      title: category.title,
      slug: category.slug,
    },
    hero: posts[0] || null,
    centerTop: posts[1] || null,
    centerList: posts.slice(2, 5),
    rightTop: posts[5] || null,
    rightList: posts.slice(6, 9),
    moreNews: posts.slice(9, 15),
    youtubeVideos: formatVideosForCarousel(youtubeVideos),
    instagramVideos: adaptVideos(instagramVideos),
  };
}

function formatDate(dateString: string) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getDateSlug(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

function getImageUrl(item: any): string {
  if (item.mainImage?.asset?.url) {
    return item.mainImage.asset.url;
  }
  return '/og-image.png';
}

function getSlug(item: any): string {
  return typeof item.slug === 'string' ? item.slug : item.slug?.current || '';
}

// Main Content Component
async function CategoryContent({ slug }: { slug: string }) {
  const news = await getCategoryPageData(slug);

  if (!news) {
    return (
      <MainContainer>
        <div className={styles.page}>
          <div className="container">
            <h1 className={styles.categoryTitle}>Категория табылган жок</h1>
            <p>Slug: {slug}</p>
          </div>
        </div>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <div className={styles.page}>
        <div className="container">
          <h1 className={styles.categoryTitle}>{news.category.title}</h1>
          <AdBanner placement="category_page" />
          <div className={styles.mainGrid}>
          {/* Hero */}
          {news.hero && (
            <div className={styles.heroColumn}>
              <Link
                href={`/news/${getDateSlug(news.hero.publishedAt)}/${getSlug(news.hero)}`}
                className={styles.heroCard}
              >
                {getImageUrl(news.hero) !== '/og-image.png' && (
                  <div className={styles.heroImage}>
                    <Image
                      src={getImageUrl(news.hero)}
                      alt={news.hero.mainImage?.alt || news.hero.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className={styles.heroAccent}></div>
                <h2 className={styles.heroTitle}>{news.hero.title}</h2>
                <p className={styles.heroExcerpt}>{news.hero.excerpt}</p>
                <time className={styles.heroDate}>{formatDate(news.hero.publishedAt)}</time>
              </Link>
            </div>
          )}

          {/* Center */}
          <div className={styles.centerColumn}>
            {news.centerTop && (
              <Link
                href={`/news/${getDateSlug(news.centerTop.publishedAt)}/${getSlug(news.centerTop)}`}
                className={styles.topCard}
              >
                {getImageUrl(news.centerTop) !== '/og-image.png' && (
                  <div className={styles.topImage}>
                    <Image
                      src={getImageUrl(news.centerTop)}
                      alt={news.centerTop.mainImage?.alt || news.centerTop.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                )}
                <h3 className={styles.topTitle}>{news.centerTop.title}</h3>
                <time className={styles.topDate}>{formatDate(news.centerTop.publishedAt)}</time>
              </Link>
            )}

            {news.centerList && news.centerList.length > 0 && (
              <div className={styles.newsList}>
                {news.centerList.map((item: any) => (
                  <Link
                    key={getSlug(item)}
                    href={`/news/${getDateSlug(item.publishedAt)}/${getSlug(item)}`}
                    className={styles.listCard}
                  >
                    <div className={styles.listContent}>
                      <h4 className={styles.listTitle}>{item.title}</h4>
                      <time className={styles.listDate}>{formatDate(item.publishedAt)}</time>
                    </div>
                    {getImageUrl(item) !== '/og-image.png' && (
                      <div className={styles.listImage}>
                        <Image
                          src={getImageUrl(item)}
                          alt={item.mainImage?.alt || item.title}
                          fill
                          sizes="(max-width: 768px) 80px, 100px"
                        />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right */}
          <div className={styles.rightColumn}>
            {news.rightTop && (
              <Link
                href={`/news/${getDateSlug(news.rightTop.publishedAt)}/${getSlug(news.rightTop)}`}
                className={styles.topCard}
              >
                {getImageUrl(news.rightTop) !== '/og-image.png' && (
                  <div className={styles.topImage}>
                    <Image
                      src={getImageUrl(news.rightTop)}
                      alt={news.rightTop.mainImage?.alt || news.rightTop.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                )}
                <h3 className={styles.topTitle}>{news.rightTop.title}</h3>
                <time className={styles.topDate}>{formatDate(news.rightTop.publishedAt)}</time>
              </Link>
            )}

            {news.rightList && news.rightList.length > 0 && (
              <div className={styles.newsList}>
                {news.rightList.map((item: any) => (
                  <Link
                    key={getSlug(item)}
                    href={`/news/${getDateSlug(item.publishedAt)}/${getSlug(item)}`}
                    className={styles.listCard}
                  >
                    <div className={styles.listContent}>
                      <h4 className={styles.listTitle}>{item.title}</h4>
                      <time className={styles.listDate}>{formatDate(item.publishedAt)}</time>
                    </div>
                    {getImageUrl(item) !== '/og-image.png' && (
                      <div className={styles.listImage}>
                        <Image
                          src={getImageUrl(item)}
                          alt={item.mainImage?.alt || item.title}
                          fill
                          sizes="(max-width: 768px) 80px, 100px"
                        />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* YouTube Videos */}
        {news.youtubeVideos && news.youtubeVideos.length > 0 && (
          <VideoCarousel
            title="YouTube видеолор"
            videos={news.youtubeVideos}
            link="/video"
          />
        )}

        {/* Instagram Videos */}
        {news.instagramVideos && news.instagramVideos.length > 0 && (
          <Suspense fallback={null}>
            <InstagramCarousel
              title="Instagram видеолор"
              videos={news.instagramVideos as any}
            />
          </Suspense>
        )}

        {/* More News */}
        {news.moreNews && news.moreNews.length > 0 && (
          <section className={styles.moreSection}>
            <h2 className={styles.moreTitle}>Дагы жаңылыктар</h2>
            <div className={styles.moreGrid}>
              {news.moreNews.map((item: any) => (
                <Link
                  key={getSlug(item)}
                  href={`/news/${getDateSlug(item.publishedAt)}/${getSlug(item)}`}
                  className={styles.moreCard}
                >
                  {getImageUrl(item) !== '/og-image.png' && (
                    <div className={styles.moreImage}>
                      <Image
                        src={getImageUrl(item)}
                        alt={item.mainImage?.alt || item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <h3 className={styles.moreCardTitle}>{item.title}</h3>
                  <p className={styles.moreExcerpt}>{item.excerpt}</p>
                  <time className={styles.moreDate}>{formatDate(item.publishedAt)}</time>
                </Link>
              ))}
            </div>
            <ShowMoreButton
              categorySlug={slug}
              initialOffset={15}
              perPage={6}
            />
          </section>
        )}
        </div>
      </div>
    </MainContainer>
  );
}

// Main Page Component with Suspense
export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryContent slug={slug} />
    </Suspense>
  );
}

// SEO Metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';
  const categoryUrl = `${siteUrl}/category/${slug}`;
  const categoryTitle = category?.title || 'Категория';

  return {
    title: `${categoryTitle} жаңылыктары`,
    description: category?.description || `${categoryTitle} боюнча акыркы жаңылыктар, макалалар жана маалыматтар - Сокол.Медиа`,
    keywords: [categoryTitle, 'жаңылыктар', 'Кыргызстан', 'Сокол.Медиа'],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'ky_KG',
      url: categoryUrl,
      title: `${categoryTitle} жаңылыктары - Сокол.Медиа`,
      description: `${categoryTitle} боюнча акыркы жаңылыктар жана макалалар`,
      siteName: 'Сокол.Медиа',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${categoryTitle} - Сокол.Медиа`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryTitle} жаңылыктары - Сокол.Медиа`,
      description: `${categoryTitle} боюнча акыркы жаңылыктар`,
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: categoryUrl,
    },
  };
}
