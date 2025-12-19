// src/components/video/VideoGrid/VideoGrid.tsx
'use client';

import { useState } from 'react';
import VideoCard from '../VideoCard/VideoCard';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import Link from 'next/link';
import styles from './VideoGrid.module.scss';

export default function VideoGrid({ videos }: { videos: any[] }) {
  const [selectedVideo, setSelectedVideo] = useState<any>(videos[0] || null);

  // Астында калган видеолор (биринчисинен башка)
  const bottomVideos = videos
    .filter(video => video._id !== selectedVideo?._id) // ← биринчини чыгарабыз
    .slice(0, 5); // 5 видео гана

  return (
    <div className={styles.videoGrid}>
      {/* Чоң плеер + Info */}
      <div className={styles.mainSection}>
        {selectedVideo && (
          <>
            <div className={styles.mainPlayer}>
              <VideoPlayer video={selectedVideo} />
            </div>

            <Link
              href={`/video/${selectedVideo.slug}`}
              className={styles.mainInfo}
            >
              <span className={styles.category}>
                {selectedVideo.category?.title || 'CARCAT'}
              </span>
              <h2 className={styles.mainTitle}>{selectedVideo.title}</h2>
              {selectedVideo.description && (
                <p className={styles.description}>{selectedVideo.description}</p>
              )}
            </Link>
          </>
        )}
      </div>

      {/* Калган 5 видео */}
      <div className={styles.videoList}>
        {bottomVideos.map((video) => (
          <VideoCard
            key={video._id}
            video={video}
            isActive={false} // active болбойт, анткени чоң плеерде көрсөтүлүп жатат
            onThumbnailClick={() => setSelectedVideo(video)}
          />
        ))}
      </div>
    </div>
  );
}