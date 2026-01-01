// app/category/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import styles from './page.module.scss';
import { sanityFetch } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import CategorySkeleton from "@/components/category/CategorySkeleton";
import ShowMoreButton from "@/components/ui/ShowMoreButton/ShowMoreButton";
import AdBanner from "@/components/ads/AdBanner";
import MainContainer from "@/components/ui/MainContainer/MainContainer";
import VideoCarousel from "@/components/video/VideoCarousel/VideoCarousel";
import InstagramCarousel from "@/components/video/InstagramCarousel/InstagramCarousel";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getCategoryPosts(categorySlug: string) {
  const query = `{
    "category": *[_type == "category" && slug.current == $categorySlug][0] {
      _id,
      title,
      slug
    },

    "hero": *[_type == "post" && $categorySlug in categories[]->slug.current]
      | order(publishedAt desc) [0] {
      title,
      excerpt,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },

    "centerTop": *[_type == "post" && $categorySlug in categories[]->slug.current]
      | order(publishedAt desc) [1] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },

    "centerList": *[_type == "post" && $categorySlug in categories[]->slug.current]
      | order(publishedAt desc) [2...5] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },

    "rightTop": *[_type == "post" && $categorySlug in categories[]->slug.current]
      | order(publishedAt desc) [5] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },

    "rightList": *[_type == "post" && $categorySlug in categories[]->slug.current]
      | order(publishedAt desc) [6...9] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },

    "moreNews": *[_type == "post" && $categorySlug in categories[]->slug.current]
      | order(publishedAt desc) [9...15] {
      title,
      excerpt,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },

    "youtubeVideos": *[_type == "video" && videoSource == "youtube" && category->slug.current == $categorySlug]
      | order(publishedAt desc) [0...10] {
      _id,
      title,
      "slug": slug.current,
      description,
      youtubeUrl,
      duration,
      thumbnail {
        asset -> { url }
      },
      "category": category->title
    },

    "instagramVideos": *[_type == "video" && videoSource == "instagram" && category->slug.current == $categorySlug]
      | order(publishedAt desc) [0...10] {
      _id,
      title,
      "slug": slug.current,
      description,
      instagramUrl,
      duration,
      thumbnail {
        asset -> { url }
      },
      "category": category->title
    }
  }`;

  const data = await sanityFetch<any>({
    query,
    params: { categorySlug },
    tags: ['posts', 'videos', 'categories'],
    revalidate: 0,
  });
  return data;
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

// Main Content Component
async function CategoryContent({ slug }: { slug: string }) {
  const news = await getCategoryPosts(slug);

  if (!news.category) {
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
                href={`/news/${getDateSlug(news.hero.publishedAt)}/${news.hero.slug.current}`}
                className={styles.heroCard}
              >
                {news.hero.mainImage?.asset?.url && (
                  <div className={styles.heroImage}>
                    <Image
                      src={urlFor(news.hero.mainImage).width(1400).height(1000).quality(85).auto('format').url()}
                      alt={news.hero.mainImage.alt || news.hero.title}
                      fill
                      priority
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
                href={`/news/${getDateSlug(news.centerTop.publishedAt)}/${news.centerTop.slug.current}`}
                className={styles.topCard}
              >
                {news.centerTop.mainImage?.asset?.url && (
                  <div className={styles.topImage}>
                    <Image
                      src={urlFor(news.centerTop.mainImage).width(800).height(500).quality(85).auto('format').url()}
                      alt={news.centerTop.mainImage.alt || news.centerTop.title}
                      fill
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
                    key={item.slug.current}
                    href={`/news/${getDateSlug(item.publishedAt)}/${item.slug.current}`}
                    className={styles.listCard}
                  >
                    <div className={styles.listContent}>
                      <h4 className={styles.listTitle}>{item.title}</h4>
                      <time className={styles.listDate}>{formatDate(item.publishedAt)}</time>
                    </div>
                    {item.mainImage?.asset?.url && (
                      <div className={styles.listImage}>
                        <Image
                          src={urlFor(item.mainImage).width(300).height(200).quality(85).auto('format').url()}
                          alt={item.mainImage.alt || item.title}
                          fill
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
                href={`/news/${getDateSlug(news.rightTop.publishedAt)}/${news.rightTop.slug.current}`}
                className={styles.topCard}
              >
                {news.rightTop.mainImage?.asset?.url && (
                  <div className={styles.topImage}>
                    <Image
                      src={urlFor(news.rightTop.mainImage).width(800).height(500).quality(85).auto('format').url()}
                      alt={news.rightTop.mainImage.alt || news.rightTop.title}
                      fill
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
                    key={item.slug.current}
                    href={`/news/${getDateSlug(item.publishedAt)}/${item.slug.current}`}
                    className={styles.listCard}
                  >
                    <div className={styles.listContent}>
                      <h4 className={styles.listTitle}>{item.title}</h4>
                      <time className={styles.listDate}>{formatDate(item.publishedAt)}</time>
                    </div>
                    {item.mainImage?.asset?.url && (
                      <div className={styles.listImage}>
                        <Image
                          src={urlFor(item.mainImage).width(300).height(200).quality(85).auto('format').url()}
                          alt={item.mainImage.alt || item.title}
                          fill
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
            videos={news.youtubeVideos.map((video: any) => ({
              _id: video._id,
              title: video.title,
              slug: video.slug,
              image: video.thumbnail?.asset?.url || '/placeholder-video.jpg',
              excerpt: video.description,
              category: video.category,
              duration: video.duration,
              thumbnail: video.thumbnail,
            }))}
            link="/video"
          />
        )}

        {/* Instagram Videos */}
        {news.instagramVideos && news.instagramVideos.length > 0 && (
          <Suspense fallback={null}>
            <InstagramCarousel
              title="Instagram видеолор"
              videos={news.instagramVideos}
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
                  key={item.slug.current}
                  href={`/news/${getDateSlug(item.publishedAt)}/${item.slug.current}`}
                  className={styles.moreCard}
                >
                  {item.mainImage?.asset?.url && (
                    <div className={styles.moreImage}>
                      <Image
                        src={urlFor(item.mainImage).width(800).height(560).quality(85).auto('format').url()}
                        alt={item.mainImage.alt || item.title}
                        fill
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

  const category = await sanityFetch<any>({
    query: `*[_type == "category" && slug.current == $slug][0] { title, description }`,
    params: { slug },
    tags: ['categories'],
    revalidate: 0,
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';
  const categoryUrl = `${siteUrl}/category/${slug}`;
  const categoryTitle = category?.title || 'Категория';

  return {
    title: `${categoryTitle} жаңылыктары`,
    description: category?.description || `${categoryTitle} боюнча акыркы жаңылыктар, макалалар жана маалыматтар - Сокол.Медиа`,
    keywords: [categoryTitle, 'жаңылыктар', 'Кыргызстан', 'Сокол.Медиа'],
    openGraph: {
      type: 'website',
      locale: 'ky_KG',
      url: categoryUrl,
      title: `${categoryTitle} жаңылыктары - Сокол.Медиа`,
      description: `${categoryTitle} боюнча акыркы жаңылыктар жана макалалар`,
      siteName: 'Сокол.Медиа',
      images: [
        {
          url: '/og-image.jpg',
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
      images: ['/og-image.jpg'],
    },
    alternates: {
      canonical: categoryUrl,
    },
  };
}