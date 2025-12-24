// src/app/video/page.tsx
import { sanityFetch } from '@/sanity/lib/client';
import { videosQuery, instagramVideosQuery } from '@/sanity/lib/queries';
import styles from './page.module.scss';
import AdBanner from "@/components/ads/AdBanner";
import MainContainer from "@/components/ui/MainContainer/MainContainer";
import VideoSection from "@/components/video/VideoSection/VideoSection";
import InstagramSection from "@/components/video/InstagramSection/InstagramSection";

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
  const [videos, instagramVideos] = await Promise.all([
    sanityFetch<any[]>({
      query: videosQuery,
      tags: ['videos'],
      revalidate: 0,
    }),
    sanityFetch<any[]>({
      query: instagramVideosQuery,
      tags: ['videos'],
      revalidate: 0,
    }),
  ]);

  return (
    <MainContainer>
      <div className={styles.videoPage}>
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>Видео</h1>
          </div>

          <AdBanner placement="video_section" />

          {/* YouTube видеолор - grid менен */}
          <VideoSection
            title="YouTube"
            videos={videos}
            initialCount={6}
          />

          <AdBanner placement="above_footer" />

          {/* Instagram видеолор - Instagram стилинде */}
          <InstagramSection
            title="Instagram"
            videos={instagramVideos}
            initialCount={8}
          />
        </div>
      </div>
    </MainContainer>
  );
}