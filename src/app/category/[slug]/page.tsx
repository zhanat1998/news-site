// app/category/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import styles from './page.module.scss';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import CategorySkeleton from "@/components/category/CategorySkeleton";
import ShowMoreButton from "@/components/ui/ShowMoreButton/ShowMoreButton";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getCategoryPosts(categoryId: string) {
  const query = `{
    "category": *[_type == "category" && _id == $categoryId][0] {
      _id,
      title,
      slug
    },
    
    "hero": *[_type == "post" && references($categoryId)] 
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
    
    "centerTop": *[_type == "post" && references($categoryId)] 
      | order(publishedAt desc) [1] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },
    
    "centerList": *[_type == "post" && references($categoryId)] 
      | order(publishedAt desc) [2...5] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },
    
    "rightTop": *[_type == "post" && references($categoryId)] 
      | order(publishedAt desc) [5] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },
    
    "rightList": *[_type == "post" && references($categoryId)] 
      | order(publishedAt desc) [6...9] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },
    
    "moreNews": *[_type == "post" && references($categoryId)] 
      | order(publishedAt desc) [9...15] {
      title,
      excerpt,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    }
  }`;

  const data = await client.fetch(query, { categoryId });
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
  const categoryId = `category-${slug}`;
  const news = await getCategoryPosts(categoryId);

  if (!news.category) {
    return (
      <div className={styles.page}>
        <div className="container">
          <h1 className={styles.categoryTitle}>Категория табылган жок</h1>
          <p>Категория ID: {categoryId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.categoryTitle}>{news.category.title}</h1>

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
                      src={urlFor(news.hero.mainImage).width(700).height(500).url()}
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
                      src={urlFor(news.centerTop.mainImage).width(400).height(250).url()}
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
                          src={urlFor(item.mainImage).width(150).height(100).url()}
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
                      src={urlFor(news.rightTop.mainImage).width(400).height(250).url()}
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
                          src={urlFor(item.mainImage).width(150).height(100).url()}
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
                        src={urlFor(item.mainImage).width(400).height(280).url()}
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
              categoryId={categoryId}
              initialOffset={15}
              perPage={6}
            />
          </section>
        )}
      </div>
    </div>
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
  const categoryId = `category-${slug}`;

  const category = await client.fetch(
    `*[_type == "category" && _id == $categoryId][0] { title }`,
    { categoryId }
  );

  return {
    title: `${category?.title || 'Категория'} - Сокол Медиа`,
    description: `${category?.title || 'Категория'} боюнча акыркы жаңылыктар жана макалалар`,
  };
}