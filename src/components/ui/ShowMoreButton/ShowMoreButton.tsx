'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import styles from './ShowMoreButton.module.scss';

interface Post {
  title: string;
  excerpt: string;
  slug: { current: string };
  mainImage?: {
    asset: { url: string };
    alt?: string;
  };
  publishedAt: string;
}

interface Props {
  categoryId: string;
  initialOffset: number;
  perPage?: number;
}

export default function ShowMoreButton({ categoryId, initialOffset, perPage = 6 }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [offset, setOffset] = useState(initialOffset);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getDateSlug = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const loadMore = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/load-more-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId,
          offset,
          limit: perPage,
        }),
      });

      const data = await response.json();

      if (data.posts && data.posts.length > 0) {
        setPosts([...posts, ...data.posts]);
        setOffset(offset + perPage);

        if (data.posts.length < perPage) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Жүктөлгөн посттор */}
      {posts.length > 0 && (
        <div className={styles.moreGrid}>
          {posts.map((item) => (
            <Link
              key={item.slug.current}
              href={`/news/${getDateSlug(item.publishedAt)}/${item.slug.current}`}
              className={styles.moreCard}
            >
              {item.mainImage?.asset?.url && (
                <div className={styles.moreImage}>
                  <Image
                    src={urlFor(item.mainImage).width(400).height(280).url()}
                    alt={item.mainImage.alt || item.title}
                    fill
                  />
                </div>
              )}
              <h3 className={styles.moreCardTitle}>{item.title}</h3>
              <p className={styles.moreExcerpt}>{item.excerpt}</p>
              <time className={styles.moreDate}>{formatDate(item.publishedAt)}</time>
            </Link>
          ))}
        </div>
      )}

      {/* Show More баттон */}
      {hasMore && (
        <div className={styles.buttonContainer}>
          <button
            onClick={loadMore}
            disabled={loading}
            className={styles.showMoreButton}
          >
            {loading ? 'Жүктөлүүдө...' : 'Дагы көрсөтүү'}
          </button>
        </div>
      )}
    </>
  );
}