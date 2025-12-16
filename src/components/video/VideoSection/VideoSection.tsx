'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './VideoSection.module.scss'

type VideoItem = {
  title: string
  slug: string
  image: string
  category?: string
  date?: string
  duration?: string
}

type Props = {
  title: string
  link?: string
  items: VideoItem[]
}

export default function VideoSection({ title, link, items }: Props) {
  if (!items.length) return null

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.list}>
        {items.map((video, index) => (
          <Link
            key={video.slug}
            href={`/video/${video.slug}`}
            className={`${styles.videoCard} ${index === 0 ? styles.featured : ''}`}
          >
            <div className={styles.imageWrapper}>
              <Image src={video.image} alt={video.title} fill />
              <div className={styles.playButton}>
                <svg viewBox="0 0 24 24" fill="white">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
              {video.duration && (
                <span className={styles.duration}>{video.duration}</span>
              )}
              <div className={styles.overlay}>
                {video.category && (
                  <span className={styles.category}>{video.category}</span>
                )}
                <h3 className={styles.videoTitle}>{video.title}</h3>
                {video.date && (
                  <span className={styles.date}>⏱ {video.date}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {link && (
        <Link href={link} className={styles.viewAll}>
          Баарын көрүү →
        </Link>
      )}
    </section>
  )
}