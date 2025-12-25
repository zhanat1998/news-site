// src/app/video/[slug]/page.tsx
import { sanityFetch } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/video/VideoPlayer/VideoPlayer';
import RelatedVideos from '@/components/video/RelatedVideos/RelatedVideos';
import styles from './page.module.scss';
import MainContainer from "@/components/ui/MainContainer/MainContainer";

type Props = {
  params: Promise<{ slug: string }>;
};

const videoBySlugQuery = groq`
  *[_type == "video" && slug.current == $slug && videoSource == "youtube"][0] {
    _id,
    title,
    description,
    videoSource,
    youtubeUrl,
    duration,
    publishedAt,
    "categoryId": category._ref,
    category->{
      title,
      slug
    },
    author->{ name }
  }
`;

// Ошол эле категориянын YouTube видеолорун алабыз
const relatedVideosQuery = groq`
  *[_type == "video" && slug.current != $slug && category._ref == $categoryId && videoSource == "youtube"]
  | order(publishedAt desc) [0...10] {
    _id,
    title,
    slug,
    duration,
    thumbnail,
    category->{ title }
  }
`;

export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params;

  const video = await sanityFetch<any>({
    query: videoBySlugQuery,
    params: { slug },
    tags: ['videos'],
  });

  if (!video) {
    notFound();
  }

  // Ошол эле категориядагы видеолорду алабыз
  const relatedVideos = await sanityFetch<any[]>({
    query: relatedVideosQuery,
    params: { slug, categoryId: video.categoryId || '' },
    tags: ['videos'],
  });

  return (
    <MainContainer>
      <div className={styles.videoPage}>
        <div className={styles.layout}>
        {/* Сол жак - Видео плеер + Info */}
        <div className={styles.mainContent}>
          <div className={styles.playerWrapper}>
            <VideoPlayer video={video} />
          </div>

          <div className={styles.info}>
            {video.category && (
              <span className={styles.category}>{video.category.title}</span>
            )}

            <h1 className={styles.title}>{video.title}</h1>

            {video.description && (
              <div className={styles.description}>
                <p>{video.description}</p>
              </div>
            )}

            {video.publishedAt && (
              <div className={styles.meta}>
                <time>
                  {new Date(video.publishedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </time>
              </div>
            )}
          </div>
        </div>

        {/* Оң жак - Related videos */}
        <aside className={styles.sidebar}>
          <RelatedVideos
            videos={relatedVideos}
            title="БУЛ БЕРҮҮДӨН ДАГЫ"
          />
        </aside>
        </div>
      </div>
    </MainContainer>
  );
}

// YouTube URL'ден Video ID алуу
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return shortMatch[1];
  return null;
}

// SEO Metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const video = await sanityFetch<any>({
    query: videoBySlugQuery,
    params: { slug },
    tags: ['videos'],
  });

  if (!video) {
    return { title: 'Видео табылган жок' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';
  const videoUrl = `${siteUrl}/video/${slug}`;

  // YouTube thumbnail
  let thumbnailUrl = `${siteUrl}/og-image.jpg`;
  if (video.youtubeUrl) {
    const youtubeId = extractYouTubeId(video.youtubeUrl);
    if (youtubeId) {
      thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    }
  }

  return {
    title: video.title,
    description: video.description || `${video.title} - Сокол.Медиа видео`,
    keywords: [video.category?.title, 'видео', 'жаңылыктар', 'Кыргызстан', 'Сокол.Медиа'].filter(Boolean),
    openGraph: {
      type: 'video.other',
      locale: 'ky_KG',
      url: videoUrl,
      title: video.title,
      description: video.description || video.title,
      siteName: 'Сокол.Медиа',
      publishedTime: video.publishedAt,
      images: [
        {
          url: thumbnailUrl,
          width: 1280,
          height: 720,
          alt: video.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: video.title,
      description: video.description || video.title,
      images: [thumbnailUrl],
    },
    alternates: {
      canonical: videoUrl,
    },
  };
}