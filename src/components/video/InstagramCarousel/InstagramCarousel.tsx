// src/components/video/InstagramCarousel/InstagramCarousel.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { getImage } from '@/utils/getImage';
import styles from './InstagramCarousel.module.scss';

interface InstagramVideo {
  _id: string;
  title: string;
  slug: string;
  instagramUrl: string;
  thumbnail?: any;
  duration?: string;
  category?: { title: string };
}

interface InstagramCarouselProps {
  title: string;
  videos: InstagramVideo[];
}

// Instagram URL'ден embed URL алуу
function getInstagramEmbedUrl(url: string): string {
  if (!url) return '';
  // URL'ден trailing slash жана query параметрлерин алып салуу
  const cleanUrl = url.split('?')[0].replace(/\/$/, '');
  return `${cleanUrl}/embed`;
}

export default function InstagramCarousel({ title, videos }: InstagramCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeVideo, setActiveVideo] = useState<InstagramVideo | null>(null);

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
            <InstagramIcon />
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
                <div className={styles.instaBadge}>
                  <InstagramIcon />
                </div>
              </div>

              <div className={styles.info}>
                <h3 className={styles.videoTitle}>{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
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

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
      <circle cx="18" cy="6" r="1.5" fill="currentColor"/>
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