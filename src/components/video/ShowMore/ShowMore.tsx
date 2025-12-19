// src/components/video/ShowMore/ShowMore.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImage } from '@/utils/getImage';
import styles from './ShowMore.module.scss';

interface Video {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: any;
  duration?: string;
  category?: { title: string };
  description?: string;
  publishedAt?: string;
}

interface ShowMoreProps {
  videos: Video[];
  initialCount?: number;
}

export default function ShowMore({ videos, initialCount = 5 }: ShowMoreProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const visibleVideos = videos.slice(0, visibleCount);
  const hasMore = visibleCount < videos.length;

  const showMore = () => {
    setVisibleCount(prev => Math.min(prev + 5, videos.length));
  };

  return (
    <section className={styles.showMore}>
      <div className="container">
        <h2 className={styles.title}>
          SHOW MORE <span className={styles.dot}>●</span>
        </h2>

        <div className={styles.list}>
          {visibleVideos.map((video) => (
            <article key={video._id} className={styles.item}>
              <Link href={`/video/${video.slug}`} className={styles.link}>
                <div className={styles.content}>
                  {video.category && (
                    <span className={styles.category}>{video.category.title}</span>
                  )}
                  <h3 className={styles.videoTitle}>{video.title}</h3>
                  {video.description && (
                    <p className={styles.description}>{video.description}</p>
                  )}
                  {video.publishedAt && (
                    <time className={styles.date}>
                      {new Date(video.publishedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </time>
                  )}
                </div>

                <div className={styles.thumbnail}>
                  <Image
                    src={getImage(video.thumbnail, 280, 158)}
                    alt={video.title}
                    width={280}
                    height={158}
                    className={styles.image}
                  />
                  {video.duration && (
                    <span className={styles.duration}>▶ {video.duration}</span>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>

        {hasMore && (
          <button onClick={showMore} className={styles.showMoreBtn}>
            Show More
          </button>
        )}
      </div>
    </section>
  );
}