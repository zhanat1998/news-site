// src/app/video/page.tsx
import { sanityFetch } from '@/sanity/lib/client';
import { videosQuery } from '@/sanity/lib/queries';
import VideoGrid from '@/components/video/VideoGrid/VideoGrid';
import styles from './page.module.scss';
import VideoCarousel from "@/components/video/VideoCarousel/VideoCarousel";
import ShowMore from "@/components/video/ShowMore/ShowMore";

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

  const formattedVideos = videos.map(video => ({
    _id: video._id,
    title: video.title,
    slug: video.slug,
    description: video.description,
    bunnyVideoId: video.bunnyVideoId,
    duration: video.duration,
    thumbnail: video.thumbnail,
    category: video.category,
    publishedAt: video.publishedAt,
  }));

  return (
    <div className={styles.videoPage}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Video</h1>
        </div>

        <VideoGrid videos={videos} />
        <VideoCarousel
          title="Latest Episodes"
          videos={videos}
          link="/video"
        />
        <ShowMore videos={formattedVideos.slice(6)} initialCount={5} />
        <VideoCarousel
          title="Latest Episodes"
          videos={videos}
          link="/video"
        />
        <ShowMore videos={formattedVideos.slice(6)} initialCount={5} />
      </div>
    </div>
  );
}