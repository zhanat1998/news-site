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
  *[_type == "video" && slug.current == $slug][0] {
    _id,
    title,
    description,
    bunnyVideoId,
    duration,
    publishedAt,
    category->{ 
      title,
      slug
    },
    author->{ name }
  }
`;

// Азыркы видеодон башка бардык видеолорду алабыз
const relatedVideosQuery = groq`
  *[_type == "video" && slug.current != $slug] 
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

  // Бардык башка видеолорду алабыз
  const relatedVideos = await sanityFetch<any[]>({
    query: relatedVideosQuery,
    params: { slug },
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
                <button className={styles.readMore}>Кененирээк</button>
              </div>
            )}

            <div className={styles.meta}>
              {video.publishedAt && (
                <time>
                  {new Date(video.publishedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </time>
              )}

              <div className={styles.actions}>
                <button className={styles.actionBtn}>
                  <ShareIcon />
                  Бөлүшүү
                </button>
                <button className={styles.actionBtn}>
                  <SaveIcon />
                  Сактоо
                </button>
              </div>
            </div>
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

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
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
  const thumbnailUrl = video.bunnyVideoId
    ? `https://vz-0a81affa-d72.b-cdn.net/${video.bunnyVideoId}/thumbnail.jpg`
    : `${siteUrl}/og-image.jpg`;

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