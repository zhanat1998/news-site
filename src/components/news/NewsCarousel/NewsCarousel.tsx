'use client';

import { useState } from 'react';
import NewsCard from '../NewsCard/NewsCard';
import SectionHeader from '../../ui/SectionHeader/SectionHeader';
import styles from './NewsCarousel.module.scss';

type NewsItem = {
  title: string;
  slug: string;
  image: string;
};

type Props = {
  title: string;
  link?: string;
  items: NewsItem[];
};

export default function NewsCarousel({ title, link, items }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 4;
  const maxIndex = Math.max(0, items.length - visibleCount);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className={styles.section}>
      <SectionHeader title={title} link={link} />

      <div className={styles.carouselWrapper}>
        <div
          className={styles.carousel}
          style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
        >
          {items.map((item, index) => {
            const isLeftPartial = index === currentIndex - 1;
            const isRightPartial = index === currentIndex + visibleCount;

            const opacity = (isLeftPartial || isRightPartial) ? 0.4 : 1;

            return (
              <div
                key={item.slug}
                className={styles.slide}
                style={{ opacity }}
              >
                <NewsCard {...item} variant="small" />
              </div>
            );
          })}
        </div>

        <div className={styles.controls}>
          <button
            className={styles.arrow}
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            ‹
          </button>
          <button
            className={styles.arrow}
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}