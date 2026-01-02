import { notFound } from 'next/navigation';
import { groq } from 'next-sanity';
import { sanityFetch } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/components/portable-text/PortableTextComponents';
import styles from './page.module.scss';
import MainImage from "@/components/newsDetail/MainImage";
import Author from "@/components/newsDetail/Author";
import ShareSection from "@/components/newsDetail/ShareSection";
import RelatedNews from "@/components/news/RelatedNews/RelatedNews";
import NewsGrid from "@/components/news/NewsGrid/NewsGrid";
import SideBar from "@/components/newsDetail/SideBar";
import {postQuery, relatedPostsQuery} from "@/sanity/lib/queries";
import AdBanner from "@/components/ads/AdBanner";
import MainContainer from "@/components/ui/MainContainer/MainContainer";

type Props = {
  params: Promise<{ date: string; slug: string }>;
};

export default async function NewsDetailPage({ params }: Props) {
  const { slug, date } = await params;

  const post = await sanityFetch<any>({
    query: postQuery,
    params: { slug },
    tags: ['posts'],
    revalidate: 0,
  });

  if (!post) {
    notFound();
  }

  // Байланыштуу жаңылыктар
  let relatedPosts = await sanityFetch<any[]>({
    query: relatedPostsQuery,
    params: { slug, categorySlug: post.category?.slug?.current || '' },
    tags: ['posts'],
    revalidate: 0,
  });

  const relatedIds = relatedPosts.map((p: any) => p._id);

  // ЭҢ ПОПУЛЯРДУУ - акыркы жаңылыктар (0-4)
  const popularNewsQuery = groq`
    *[_type == "post" && slug.current != $slug && !(_id in $relatedIds)]
    | order(publishedAt desc) [0...4] {
      _id,
      title,
      slug,
      publishedAt,
      mainImage { asset->, alt }
    }
  `;
  const popularNews = await sanityFetch<any[]>({
    query: popularNewsQuery,
    params: { slug, relatedIds },
    tags: ['posts'],
    revalidate: 0,
  });

  const popularIds = popularNews.map((p: any) => p._id);
  const allPreviousIds = [...relatedIds, ...popularIds];

  // ЖАҢЫЛЫКТАРДАН ДАГЫ - кийинки жаңылыктар (4-8)
  const moreNewsQuery2 = groq`
    *[_type == "post" && slug.current != $slug && !(_id in $excludeIds)]
    | order(publishedAt desc) [0...4] {
      _id,
      title,
      slug,
      publishedAt,
      mainImage { asset->, alt }
    }
  `;
  const moreNews = await sanityFetch<any[]>({
    query: moreNewsQuery2,
    params: { slug, excludeIds: allPreviousIds },
    tags: ['posts'],
    revalidate: 0,
  });

// Эгер бош же 2ден аз болсо — башка посттордон ал
  if (!relatedPosts || relatedPosts.length < 2) {
    const fallbackQuery = groq`
    *[_type == "post" && slug.current != $slug] | order(publishedAt desc) [0...4] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage { asset->, alt }
    }
  `;
    relatedPosts = await sanityFetch<any[]>({
      query: fallbackQuery,
      params: { slug },
      tags: ['posts'],
      revalidate: 0,
    });
  }

  // Sidebar
  const moreIds = moreNews.map((p: any) => p._id);
  const allExcludeIds = [...relatedIds, ...moreIds];

  const sidebarQuery = groq`
    *[_type == "post" && slug.current != $slug && !(_id in $excludeIds)]
    | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      publishedAt,
      mainImage { asset->, alt }
    }
  `;
  const sidebarPosts = await sanityFetch<any[]>({
    query: sidebarQuery,
    params: { slug, excludeIds: allExcludeIds },
    tags: ['posts'],
    revalidate: 0,
  });

  return (
    <MainContainer>
      <div className={styles.page}>
        <div className="container">
          <div className={styles.layout}>
          {/* Main Content */}
          <article className={styles.article}>
            <h1 className={styles.title}>{post.title}</h1>
            {post.excerpt && (
              <p className={styles.subtitle}>{post.excerpt}</p>
            )}
            <MainImage item={post} />
            <div className={styles.content}>
              {post.body && (
                <PortableText
                  value={post.body}
                  components={portableTextComponents}
                />
              )}
            </div>
            <Author item={post} />
            <ShareSection
              title={post.title}
              url={`/news/${date}/${slug}`}
              image={post.mainImage?.asset?.url}
            />
            <AdBanner placement="in_article" />
            <RelatedNews items={relatedPosts} />

            <NewsGrid title="ЭҢ ПОПУЛЯРДУУ" items={popularNews} />

            <NewsGrid title="ЖАҢЫЛЫКТАРДАН ДАГЫ" items={moreNews} />
          </article>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <AdBanner placement="sidebar" />
            <SideBar items={sidebarPosts}/>
          </aside>
          </div>
        </div>
      </div>
    </MainContainer>
  );
}

// Metadata for SEO
export async function generateMetadata({ params }: Props) {
  const { slug, date } = await params;
  const post = await sanityFetch<any>({
    query: postQuery,
    params: { slug },
    tags: ['posts'],
    revalidate: 0,
  });

  if (!post) {
    return { title: 'Табылган жок' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';
  const postUrl = `${siteUrl}/news/${date}/${slug}`;
  const imageUrl = post.mainImage?.asset?.url || `${siteUrl}/og-image.png`;

  return {
    title: post.title,
    description: post.excerpt || `${post.title} - Сокол.Медиа жаңылыктар порталы`,
    keywords: [post.category?.title, 'жаңылыктар', 'Кыргызстан', 'Сокол.Медиа'].filter(Boolean),
    authors: post.author?.name ? [{ name: post.author.name }] : undefined,
    openGraph: {
      type: 'article',
      locale: 'ky_KG',
      url: postUrl,
      title: post.title,
      description: post.excerpt || post.title,
      siteName: 'Сокол.Медиа',
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      section: post.category?.title,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.mainImage?.alt || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
      images: [imageUrl],
    },
    alternates: {
      canonical: postUrl,
    },
  };
}