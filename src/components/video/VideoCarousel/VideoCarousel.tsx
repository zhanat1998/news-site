'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './VideoCarousel.module.scss';

type VideoItem = {
  title: string;
  slug: string;
  image: string;
  excerpt?: string;
  category?: string;
  duration?: string;
};

type Props = {
  title: string;
  link?: string;
  items: VideoItem[];
};

export default function VideoCarousel({ title, link, items }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const visibleCount = 4;
  const maxIndex = Math.max(0, items.length - visibleCount);

  // Мобилка текшерүү
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePrev = () => {
    if (isMobile) return;
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (isMobile) return;
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <Link href={link || '/video'} className={styles.title}>
          {title} <span className={styles.arrow}>›</span>
        </Link>

        {/* Десктопто гана көрүнөт */}
        <div className={styles.controls}>
          <button
            className={styles.navButton}
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Артка"
          >
            ‹
          </button>
          <button
            className={styles.navButton}
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Алдыга"
          >
            ›
          </button>
        </div>
      </div>

      <div className={styles.carouselWrapper} ref={carouselRef}>
        <div
          className={styles.carousel}
          style={!isMobile ? {
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`
          } : undefined}
        >
          {items.map((item) => (
            <div key={item.slug} className={styles.slide}>
              <Link href={`/video/${item.slug}`} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image src={item.image} alt={item.title} fill />
                  <div className={styles.playButton}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                  {item.duration && (
                    <span className={styles.duration}>{item.duration}</span>
                  )}
                </div>
                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  {item.excerpt && (
                    <p className={styles.excerpt}>{item.excerpt}</p>
                  )}
                  {item.category && (
                    <span className={styles.category}>{item.category}</span>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}