import { notFound } from 'next/navigation';
import styles from './page.module.scss';
import MainImage from "@/components/newsDetail/MainImage";
import Author from "@/components/newsDetail/Author";
import ShareSection from "@/components/newsDetail/ShareSection";
import RelatedNews from "@/components/news/RelatedNews/RelatedNews";
import NewsGrid from "@/components/news/NewsGrid/NewsGrid";
import SideBar from "@/components/newsDetail/SideBar";
import MainContainer from "@/components/ui/MainContainer/MainContainer";
import PageViewTracker from "@/components/analytics/PageViewTracker";

// Strapi imports
import {
  getPostBySlug,
  getRelatedPosts,
  getLatestPosts,
} from '@/lib/strapi/api';
import { adaptPost, adaptPosts } from '@/lib/strapi/adapters';

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return url; // Return as-is if no pattern matches
}

type Props = {
  params: Promise<{ date: string; slug: string }>;
};

export default async function NewsDetailPage({ params }: Props) {
  const { slug, date } = await params;

  const postRaw = await getPostBySlug(slug);

  if (!postRaw) {
    notFound();
  }

  const post = adaptPost(postRaw);
  const categorySlug = post.category?.slug?.current || '';

  // Related posts by category
  let relatedPostsRaw = categorySlug
    ? await getRelatedPosts(categorySlug, slug, 4)
    : [];

  // If not enough related posts, get latest posts
  if (relatedPostsRaw.length < 2) {
    const latestPosts = await getLatestPosts(4);
    relatedPostsRaw = latestPosts.filter(p => p.slug !== slug);
  }

  const relatedPosts = adaptPosts(relatedPostsRaw);

  // Get all posts for additional sections
  const allPostsRaw = await getLatestPosts(20);

  // Track used slugs (using raw slug strings)
  const usedSlugs = new Set([slug, ...relatedPostsRaw.map(p => p.slug)]);

  // Popular posts (excluding current and related)
  const popularPostsRaw = allPostsRaw.filter(p => !usedSlugs.has(p.slug)).slice(0, 4);
  popularPostsRaw.forEach(p => usedSlugs.add(p.slug));
  const popularNews = adaptPosts(popularPostsRaw);

  // More news (excluding all used)
  const morePostsRaw = allPostsRaw.filter(p => !usedSlugs.has(p.slug)).slice(0, 4);
  morePostsRaw.forEach(p => usedSlugs.add(p.slug));
  const moreNews = adaptPosts(morePostsRaw);

  // Sidebar posts (excluding all used)
  const sidebarPostsRaw = allPostsRaw.filter(p => !usedSlugs.has(p.slug)).slice(0, 3);
  const sidebarPosts = adaptPosts(sidebarPostsRaw);

  return (
    <MainContainer>
      <PageViewTracker postId={post._id} slug={slug} />
      <div className={styles.page}>
        <div className="container">
          <div className={styles.layout}>
          {/* Main Content */}
          <article className={styles.article}>
            <h1 className={styles.title}>{post.title}</h1>
            <MainImage item={post as any} />
            {post.youtubeUrl && (
              <div className={styles.videoEmbed}>
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(post.youtubeUrl)}`}
                  title={post.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            {post.excerpt && (
              <p className={styles.subtitle}>{post.excerpt}</p>
            )}
            <div className={styles.content}>
              {post.body && (
                <div
                  className={styles.bodyContent}
                  dangerouslySetInnerHTML={{ __html: post.body }}
                />
              )}
            </div>
            <Author item={post as any} />
            <ShareSection
              title={post.title}
              url={`/news/${date}/${slug}`}
              image={post.mainImage?.asset?.url}
            />
            <RelatedNews items={relatedPosts as any} />

            <NewsGrid title="ЭҢ ПОПУЛЯРДУУ" items={popularNews as any} />

            <NewsGrid title="ЖАҢЫЛЫКТАРДАН ДАГЫ" items={moreNews as any} />
          </article>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <SideBar items={sidebarPosts as any}/>
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
  const postRaw = await getPostBySlug(slug);

  if (!postRaw) {
    return { title: 'Табылган жок' };
  }

  const post = adaptPost(postRaw);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';
  const postUrl = `${siteUrl}/news/${date}/${slug}`;
  const imageUrl = post.mainImage?.asset?.url || `${siteUrl}/og-image.png`;

  return {
    title: post.title,
    description: post.excerpt || `${post.title} - Сокол.Медиа жаңылыктар порталы`,
    keywords: [post.category?.title, 'жаңылыктар', 'Кыргызстан', 'Сокол.Медиа'].filter(Boolean),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      type: 'article',
      locale: 'ky_KG',
      url: postUrl,
      title: post.title,
      description: post.excerpt || post.title,
      siteName: 'Сокол.Медиа',
      publishedTime: post.publishedAt,
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
