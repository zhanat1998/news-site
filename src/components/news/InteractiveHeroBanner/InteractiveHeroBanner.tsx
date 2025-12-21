'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import styles from './InteractiveHeroBanner.module.scss';
import { Posts } from '@/types/posts';
import InteractiveHeroBannerMobile
  from "@/components/news/InteractiveHeroBanner/components/InteractiveHeroBannerMobile";
import {formatDateForUrl} from "@/utils/date";


export default function InteractiveHeroBanner({ items }: Posts) {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const thumbnailPosts = items?.slice(0, 12) || [];
  const mainPost = items?.[activeIndex];

  useEffect(() => {
    if (!items || items.length === 0) return;

    const postsCount = thumbnailPosts.length;

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % postsCount);
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [items]);

  useEffect(() => {
    if (!thumbnailsRef.current) return;

    const container = thumbnailsRef.current;
    const active = container.children[activeIndex] as HTMLElement;

    if (!active) return;

    container.scrollTo({
      left:
        active.offsetLeft -
        container.clientWidth / 2 +
        active.clientWidth / 2,
      behavior: 'smooth',
    });
  }, [activeIndex]);

  if (!items || items.length === 0 || !mainPost) return null;

  const handleIndexChange = (newIndex: number) => {
    setActiveIndex(newIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleIndexChange((activeIndex + 1) % thumbnailPosts.length);
      } else {
        handleIndexChange(activeIndex === 0 ? thumbnailPosts.length - 1 : activeIndex - 1);
      }
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.desktopView}>
        <div
          className={styles.mainDisplay}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.mainImage}>
            {mainPost.mainImage?.asset?.url && (
              <Image
                src={urlFor(mainPost.mainImage).width(864).height(486).url()}
                alt={mainPost.mainImage.alt || mainPost.title}
                fill
                priority
              />
            )}
          </div>

          <div className={styles.content}>
            {mainPost.categories && mainPost.categories[0] && (
              <div className={styles.categoryBadge}>
                {mainPost.categories[0].title}
              </div>
            )}

            <Link
              href={`/news/${formatDateForUrl(mainPost.publishedAt)}/${mainPost.slug.current}`}
              className={styles.titleLink}
            >
              <h1 className={styles.title}>
                 <span className={styles.titleWord}>
                    {mainPost.title}
                  </span>
              </h1>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.thumbnails} ref={thumbnailsRef}>
        {thumbnailPosts.map((post, index) => (
          <button
            key={post._id}
            className={`${styles.thumbnail} ${activeIndex === index ? styles.active : ''}`}
            onMouseEnter={() => handleIndexChange(index)}
            onClick={() => handleIndexChange(index)}
          >
            {post.mainImage?.asset?.url && (
              <Image
                src={urlFor(post.mainImage).width(150).height(100).url()}
                alt={post.mainImage.alt || post.title}
                fill
              />
            )}
          </button>
        ))}
      </div>
      <InteractiveHeroBannerMobile
        activeIndex={activeIndex}
        thumbnailPosts={thumbnailPosts}
        mainPost={mainPost}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
      />
    </section>
  );
}