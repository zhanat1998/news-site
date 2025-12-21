// src/app/video/page.tsx
import { sanityFetch } from '@/sanity/lib/client';
import { videosQuery } from '@/sanity/lib/queries';
import VideoGrid from '@/components/video/VideoGrid/VideoGrid';
import styles from './page.module.scss';
import VideoCarousel from "@/components/video/VideoCarousel/VideoCarousel";

export const metadata = {
  title: 'Video - Сокол.Медиа',
  description: 'Видео жаңылыктар жана документалдык тасмалар',
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
          <h1 className={styles.title}>Video</h1>
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