// src/components/video/RelatedVideos/RelatedVideos.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getImage } from '@/utils/getImage';
import styles from './RelatedVideos.module.scss';

interface Video {
  _id: string;
  title: string;
  slug: { current: string };
  duration?: string;
  thumbnail?: any;
  category?: { title: string };
}

interface RelatedVideosProps {
  videos: Video[];
  title: string;
}

export default function RelatedVideos({ videos, title }: RelatedVideosProps) {
  if (!videos.length) return null;

  return (
    <div className={styles.related}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.list}>
        {videos.map((video) => (
          <Link
            key={video._id}
            href={`/video/${video.slug.current}`}
            className={styles.item}
          >
            {/* Текст сол жакта */}
            <div className={styles.content}>
              <h3 className={styles.videoTitle}>{video.title}</h3>
            </div>

            {/* Сүрөт оң жакта */}
            <div className={styles.thumbnail}>
              <Image
                src={getImage(video.thumbnail, 150, 85)}
                alt={video.title}
                width={150}
                height={85}
                className={styles.image}
              />
              {video.duration && (
                <span className={styles.duration}>▶ {video.duration}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}