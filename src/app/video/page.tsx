// src/app/video/page.tsx
import { getYouTubeVideos, getInstagramVideos } from '@/lib/strapi/api';
import { adaptVideos } from '@/lib/strapi/adapters';
import styles from './page.module.scss';
import MainContainer from "@/components/ui/MainContainer/MainContainer";
import VideoSection from "@/components/video/VideoSection/VideoSection";
import InstagramSection from "@/components/video/InstagramSection/InstagramSection";

import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';

export const metadata: Metadata = {
  title: 'Видео жаңылыктар',
  description: 'Кыргызстандагы акыркы видео жаңылыктар, репортаждар, интервьюлар жана документалдык тасмалар - Сокол.Медиа',
  keywords: ['видео', 'жаңылыктар', 'репортаж', 'интервью', 'Кыргызстан', 'Сокол.Медиа'],
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
    url: `${siteUrl}/video`,
    title: 'Видео жаңылыктар - Сокол.Медиа',
    description: 'Кыргызстандагы акыркы видео жаңылыктар, репортаждар жана интервьюлар',
    siteName: 'Сокол.Медиа',
    images: [
      {
        url: '/og-image.png',
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
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: `${siteUrl}/video`,
  },
};

export default async function VideoPage() {
  const [youtubeVideosRaw, instagramVideosRaw] = await Promise.all([
    getYouTubeVideos(20),
    getInstagramVideos(20),
  ]);

  const videos = adaptVideos(youtubeVideosRaw);
  const instagramVideos = adaptVideos(instagramVideosRaw);

  return (
    <MainContainer>
      <div className={styles.videoPage}>
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>Видео</h1>
          </div>

          {/* YouTube видеолор - grid менен */}
          <VideoSection
            title="YouTube"
            videos={videos as any}
            initialCount={6}
          />

          {/* Instagram видеолор - Instagram стилинде */}
          <InstagramSection
            title="Instagram"
            videos={instagramVideos as any}
            initialCount={8}
          />
        </div>
      </div>
    </MainContainer>
  );
}
