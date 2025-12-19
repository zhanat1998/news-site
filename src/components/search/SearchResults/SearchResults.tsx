// src/components/SearchResults/SearchResults.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './SearchResults.module.scss';
import {getImage} from "@/utils/getImage";
import {Posts} from "@/types/posts";
import {formatDateForUrl} from "@/utils/date";

export default function SearchResults({ items }: Posts) {
  return (
    <div className={styles.results}>
      {items.map((post) => (
        <article key={post._id} className={styles.item}>
          <Link href={`/news/${formatDateForUrl(post.publishedAt)}/${post.slug?.current}`} className={styles.link}>
            <div className={styles.imageWrapper}>
              <Image
                src={getImage(post.mainImage, 300, 200)}
                alt={post.mainImage?.alt || post.title}
                width={300}
                height={200}
                className={styles.image}
              />
            </div>

            <div className={styles.content}>
              {post.category && (
                <span className={styles.category}>{post.category.title}</span>
              )}

              <h2 className={styles.title}>{post.title}</h2>

              {post.excerpt && (
                <p className={styles.excerpt}>{post.excerpt}</p>
              )}

              <div className={styles.meta}>
                {post.author && <span>{post.author.name}</span>}
                <time>
                  {new Date(post.publishedAt).toLocaleDateString('ky-KG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}