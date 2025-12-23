import { notFound } from 'next/navigation';
import { groq } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/components/portable-text/PortableTextComponents';
import styles from './page.module.scss';
import MainImage from "@/components/newsDetail/MainImage";
import Author from "@/components/newsDetail/Author";
import RelatedNews from "@/components/news/RelatedNews/RelatedNews";
import NewsGrid from "@/components/news/NewsGrid/NewsGrid";
import SideBar from "@/components/newsDetail/SideBar";
import {moreNewsQuery, postQuery, relatedPostsQuery} from "@/sanity/lib/queries";
import AdBanner from "@/components/ads/AdBanner";

type Props = {
  params: Promise<{ date: string; slug: string }>;
};

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;

  const post = await client.fetch(postQuery, { slug });

  if (!post) {
    notFound();
  }

  // Байланыштуу жаңылыктар
  let relatedPosts = await client.fetch(relatedPostsQuery, {
    slug,
    categorySlug: post.category?.slug?.current || ''
  });

  const relatedIds = relatedPosts.map((p: any) => p._id);
  const moreNews = await client.fetch(moreNewsQuery, { slug, relatedIds });

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
    relatedPosts = await client.fetch(fallbackQuery, { slug });
  }

  // Sidebar
  const moreIds = moreNews.map((p: any) => p._id);
  const allExcludeIds = [...relatedIds, ...moreIds];

  const sidebarPosts = await client.fetch(groq`
    *[_type == "post" && slug.current != $slug && !(_id in $excludeIds)] 
    | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      publishedAt,
      mainImage { asset->, alt }
    }
  `, { slug, excludeIds: allExcludeIds });

  return (
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
            <Author item={post} />
            <div className={styles.content}>
              {post.body && (
                <PortableText
                  value={post.body}
                  components={portableTextComponents}
                />
              )}
            </div>
            <AdBanner placement="in_article" />
            <RelatedNews items={relatedPosts} />

            <NewsGrid title="ЖАҢЫЛЫКТАРДАН ДАГЫ" items={moreNews} />

            <NewsGrid title="ЭҢ ПОПУЛЯРДУУ" items={moreNews} />
          </article>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <AdBanner placement="sidebar" />
            <SideBar items={sidebarPosts}/>
          </aside>
        </div>
      </div>
    </div>
  );
}

// Metadata for SEO
export async function generateMetadata({ params }: Props) {
  const { slug, date } = await params;
  const post = await client.fetch(postQuery, { slug });

  if (!post) {
    return { title: 'Табылган жок' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';
  const postUrl = `${siteUrl}/news/${date}/${slug}`;
  const imageUrl = post.mainImage?.asset?.url || `${siteUrl}/og-image.jpg`;

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