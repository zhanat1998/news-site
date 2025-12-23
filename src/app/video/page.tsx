// src/app/video/page.tsx
import { sanityFetch } from '@/sanity/lib/client';
import { videosQuery } from '@/sanity/lib/queries';
import VideoGrid from '@/components/video/VideoGrid/VideoGrid';
import styles from './page.module.scss';
import VideoCarousel from "@/components/video/VideoCarousel/VideoCarousel";

import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';

export const metadata: Metadata = {
  title: 'Видео жаңылыктар',
  description: 'Кыргызстандагы акыркы видео жаңылыктар, репортаждар, интервьюлар жана документалдык тасмалар - Сокол.Медиа',
  keywords: ['видео', 'жаңылыктар', 'репортаж', 'интервью', 'Кыргызстан', 'Сокол.Медиа'],
  openGraph: {
    type: 'website',
    locale: 'ky_KG',
    url: `${siteUrl}/video`,
    title: 'Видео жаңылыктар - Сокол.Медиа',
    description: 'Кыргызстандагы акыркы видео жаңылыктар, репортаждар жана интервьюлар',
    siteName: 'Сокол.Медиа',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Видео - Сокол.Медиа',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Видео жаңылыктар - Сокол.Медиа',
    description: 'Кыргызстандагы акыркы видео жаңылыктар',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: `${siteUrl}/video`,
  },
};

export default async function VideoPage() {
  const videos = await sanityFetch<any[]>({
    query: videosQuery,
    tags: ['videos'],
    revalidate: 0,
  });

  return (
    <div className={styles.videoPage}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Видео</h1>
        </div>

        <VideoGrid videos={videos} />
        <VideoCarousel
          title="Акыркы видеолор"
          videos={videos}
          link="/video"
        />
        <VideoCarousel
          title="Акыркы видеолор"
          videos={videos}
          link="/video"
        />
      </div>
    </div>
  );
}