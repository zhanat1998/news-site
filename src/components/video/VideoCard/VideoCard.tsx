// src/components/video/VideoCard/VideoCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getImage } from '@/utils/getImage';
import styles from './VideoCard.module.scss';

interface VideoCardProps {
  video: any;
  isActive?: boolean;
  onThumbnailClick: () => void; // Сүрөткө баскан
}

export default function VideoCard({ video, isActive, onThumbnailClick }: VideoCardProps) {
  return (
    <article className={`${styles.card} ${isActive ? styles.active : ''}`}>
      {/* Thumbnail - ойнотот */}
      <div
        className={styles.thumbnail}
        onClick={onThumbnailClick}
      >
        <Image
          src={getImage(video.thumbnail, 320, 180)}
          alt={video.title}
          width={320}
          height={180}
          className={styles.image}
        />
        <div className={styles.playButton}>
          <PlayIcon />
        </div>
        {video.duration && (
          <span className={styles.duration}>{video.duration}</span>
        )}
      </div>

      {/* Content - детальга кетет */}
      <Link
        href={`/video/${video.slug}`}
        className={styles.content}
      >
        <span className={styles.category}>
          {video.category?.title || 'NewsFeed'}
        </span>
        <h3 className={styles.title}>{video.title}</h3>
      </Link>
    </article>
  );
}

function PlayIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="white" fillOpacity="0.95" />
      <path
        d="M19 14L33 24L19 34V14Z"
        fill="#000"
      />
    </svg>
  );
}