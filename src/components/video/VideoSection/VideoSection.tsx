// src/components/video/VideoSection/VideoSection.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getImage } from '@/utils/getImage';
import styles from './VideoSection.module.scss';

interface Video {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  videoSource: string;
  youtubeUrl?: string;
  duration?: string;
  thumbnail?: any;
  category?: { title: string };
}

interface VideoSectionProps {
  title: string;
  videos: Video[];
  initialCount?: number;
}

export default function VideoSection({ title, videos, initialCount = 6 }: VideoSectionProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const visibleVideos = videos.slice(0, visibleCount);
  const hasMore = videos.length > visibleCount;

  const showMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  if (!videos || videos.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <YouTubeIcon />
          {title}
        </h2>
      </div>

      <div className={styles.grid}>
        {visibleVideos.map((video) => (
          <Link
            key={video._id}
            href={`/video/${video.slug}`}
            className={styles.card}
          >
            <div className={styles.thumbnail}>
              <Image
                src={getImage(video.thumbnail, 400, 225)}
                alt={video.title}
                width={400}
                height={225}
                className={styles.image}
              />
              <div className={styles.playOverlay}>
                <PlayIcon />
              </div>
              {video.duration && (
                <span className={styles.duration}>{video.duration}</span>
              )}
            </div>
            <div className={styles.content}>
              <span className={styles.category}>
                {video.category?.title || 'Видео'}
              </span>
              <h3 className={styles.cardTitle}>{video.title}</h3>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className={styles.showMoreWrapper}>
          <button onClick={showMore} className={styles.showMoreBtn}>
            Дагы көрсөтүү
          </button>
        </div>
      )}
    </section>
  );
}

function YouTubeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginRight: 12 }}>
      <rect x="2" y="4" width="20" height="16" rx="4" fill="#FF0000"/>
      <path d="M10 8.5V15.5L16 12L10 8.5Z" fill="white"/>
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="28" fill="white" fillOpacity="0.95" />
      <path d="M22 16L40 28L22 40V16Z" fill="#000" />
    </svg>
  );
}