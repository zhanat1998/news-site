// src/components/video/VideoCarousel/VideoCarousel.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImage } from '@/utils/getImage';
import styles from './VideoCarousel.module.scss';

interface Video {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: any;
  duration?: string;
  category?: { title: string };
}

interface VideoCarouselProps {
  title: string;
  videos: Video[];
  link?: string;
}

export default function VideoCarousel({ title, videos, link }: VideoCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const cardWidth = container.scrollWidth / videos.length;
    const scrollAmount = cardWidth * 6; // 6 карточка

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

  return (
    <section className={styles.carousel}>
      {/* container класын алып салдык */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.accent}></span>
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
          <Link
            key={video._id}
            href={`/video/${video.slug}`}
            className={styles.item}
          >
            <div className={styles.thumbnail}>
              <Image
                src={getImage(video.thumbnail, 320, 180)}
                alt={video.title}
                width={320}
                height={180}
                className={styles.image}
              />
              {video.duration && (
                <span className={styles.duration}>▶ {video.duration}</span>
              )}
            </div>

            <div className={styles.info}>
              {video.category && (
                <span className={styles.category}>{video.category.title}</span>
              )}
              <h3 className={styles.videoTitle}>{video.title}</h3>
            </div>
          </Link>
        ))}
      </div>

      {link && (
        <div className={styles.footer}>
          <Link href={link} className={styles.viewAll}>
            Баарын көрүү
          </Link>
        </div>
      )}
    </section>
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
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}