// src/components/video/InstagramSection/InstagramSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImage } from '@/utils/getImage';
import styles from './InstagramSection.module.scss';

interface InstagramVideo {
  _id: string;
  title: string;
  slug: string;
  instagramUrl: string;
  thumbnail?: any;
  duration?: string;
  category?: { title: string };
}

interface InstagramSectionProps {
  title: string;
  videos: InstagramVideo[];
  initialCount?: number;
}

function getInstagramEmbedUrl(url: string): string {
  if (!url) return '';
  const cleanUrl = url.split('?')[0].replace(/\/$/, '');
  return `${cleanUrl}/embed`;
}

export default function InstagramSection({ title, videos, initialCount = 6 }: InstagramSectionProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [activeVideo, setActiveVideo] = useState<InstagramVideo | null>(null);

  const visibleVideos = videos.slice(0, visibleCount);
  const hasMore = videos.length > visibleCount;

  const showMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const closeModal = () => setActiveVideo(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (activeVideo) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [activeVideo]);

  if (!videos || videos.length === 0) return null;

  return (
    <>
      <section className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <InstagramIcon />
            {title}
          </h2>
        </div>

        <div className={styles.grid}>
          {visibleVideos.map((video) => (
            <div
              key={video._id}
              className={styles.card}
              onClick={() => setActiveVideo(video)}
            >
              <div className={styles.thumbnail}>
                <Image
                  src={getImage(video.thumbnail, 320, 400)}
                  alt={video.title}
                  width={320}
                  height={400}
                  className={styles.image}
                />
                <div className={styles.playOverlay}>
                  <PlayIcon />
                </div>
                <div className={styles.instaBadge}>
                  <InstagramIcon small />
                </div>
              </div>
              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{video.title}</h3>
              </div>
            </div>
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

      {/* Instagram Embed Modal */}
      {activeVideo && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal}>
              <CloseIcon />
            </button>
            <iframe
              src={getInstagramEmbedUrl(activeVideo.instagramUrl)}
              className={styles.iframe}
              style={{ border: 'none' }}
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}

function InstagramIcon({ small }: { small?: boolean }) {
  const size = small ? 18 : 24;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={small ? {} : { marginRight: 12 }}>
      <defs>
        <linearGradient id="instaGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="25%" stopColor="#FCAF45" />
          <stop offset="50%" stopColor="#F77737" />
          <stop offset="75%" stopColor="#C13584" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#instaGradient)" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="4" stroke="url(#instaGradient)" strokeWidth="2" fill="none"/>
      <circle cx="18" cy="6" r="1.5" fill="url(#instaGradient)"/>
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

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}