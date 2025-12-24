// src/components/video/TikTokCarousel/TikTokCarousel.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { getImage } from '@/utils/getImage';
import styles from './TikTokCarousel.module.scss';

interface TikTokVideo {
  _id: string;
  title: string;
  slug: string;
  tiktokUrl: string;
  thumbnail?: any;
  duration?: string;
  category?: { title: string };
}

interface TikTokCarouselProps {
  title: string;
  videos: TikTokVideo[];
}

// TikTok URL'ден embed URL алуу
function getTikTokEmbedUrl(url: string): string {
  if (!url) return '';
  // TikTok video ID алуу
  const videoIdMatch = url.match(/video\/(\d+)/);
  if (videoIdMatch) {
    return `https://www.tiktok.com/embed/v2/${videoIdMatch[1]}`;
  }
  return '';
}

export default function TikTokCarousel({ title, videos }: TikTokCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeVideo, setActiveVideo] = useState<TikTokVideo | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const cardWidth = container.scrollWidth / videos.length;
    const scrollAmount = cardWidth * 3;

    const newScrollLeft = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    handleScroll();
  }, []);

  // Modal жабуу
  const closeModal = () => setActiveVideo(null);

  // ESC баскычы менен жабуу
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
      <section className={styles.carousel}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.accent}></span>
            <TikTokIcon />
            {title}
          </h2>

          <div className={styles.controls}>
            <button
              className={styles.arrow}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Мурунку"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              className={styles.arrow}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Кийинки"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className={styles.items}
          onScroll={handleScroll}
        >
          {videos.map((video) => (
            <div
              key={video._id}
              className={styles.item}
              onClick={() => setActiveVideo(video)}
            >
              <div className={styles.thumbnail}>
                <Image
                  src={getImage(video.thumbnail, 280, 350)}
                  alt={video.title}
                  width={280}
                  height={350}
                  className={styles.image}
                />
                <div className={styles.playOverlay}>
                  <PlayIcon />
                </div>
                <div className={styles.tiktokBadge}>
                  <TikTokIcon />
                </div>
              </div>

              <div className={styles.info}>
                <h3 className={styles.videoTitle}>{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TikTok Embed Modal */}
      {activeVideo && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal}>
              <CloseIcon />
            </button>
            <iframe
              src={getTikTokEmbedUrl(activeVideo.tiktokUrl)}
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

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d={direction === 'left'
          ? "M15 18L9 12L15 6"
          : "M9 18L15 12L9 6"
        }
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="white" fillOpacity="0.9" />
      <path d="M19 14L33 24L19 34V14Z" fill="#000" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
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