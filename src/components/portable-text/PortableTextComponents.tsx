// components/PortableTextComponents.tsx
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import styles from './PortableText.module.scss';

export const portableTextComponents = {
  // Блок стилдери (H2, Blockquote ж.б.)
  block: {
    h2: ({children}: any) => (
      <h2 className={styles.subtitle}>{children}</h2>
    ),
    h3: ({children}: any) => (
      <h3 className={styles.h3}>{children}</h3>
    ),
    blockquote: ({children}: any) => (
      <blockquote className={styles.quote}>{children}</blockquote>
    ),
    normal: ({children}: any) => (
      <p className={styles.paragraph}>{children}</p>
    ),
  },

  // Тизмелер
  list: {
    bullet: ({children}: any) => (
      <ul className={styles.bulletList}>{children}</ul>
    ),
    number: ({children}: any) => (
      <ol className={styles.numberList}>{children}</ol>
    ),
  },

  // Шилтемелер
  marks: {
    link: ({children, value}: any) => (
      <a
        href={value.href}
        target={value.blank ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className={styles.link}
      >
        {children}
      </a>
    ),
  },

  // ✅ СҮРӨТТӨР
  types: {
    image: ({value}: any) => (
      <figure className={styles.figure}>
        <div className={styles.imageWrapper}>
          <Image
            src={urlFor(value).width(800).height(500).url()}
            alt={value.alt || 'Сүрөт'}
            fill
            className={styles.image}
          />
        </div>
        {value.caption && (
          <figcaption className={styles.caption}>{value.caption}</figcaption>
        )}
      </figure>
    ),

    // "Дагы караңыз" блогу
    relatedBlock: ({value}: any) => (
      <div className={styles.relatedBlock}>
        <div className={styles.relatedAccent}></div>
        <div className={styles.relatedContent}>
          {value.relatedPost?.mainImage && (
            <div className={styles.relatedImage}>
              <Image
                src={urlFor(value.relatedPost.mainImage).width(200).height(150).url()}
                alt={value.relatedPost.title}
                fill
              />
            </div>
          )}
          <div className={styles.relatedText}>
            <span className={styles.relatedLabel}>ДАГЫ КАРАҢЫЗ</span>
            <Link href={`/news/${value.relatedPost?.slug?.current}`}>
              {value.relatedPost?.title}
            </Link>
          </div>
        </div>
      </div>
    ),

    // YouTube видео
    youtube: ({value}: any) => {
      const videoId = value.url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
      return (
        <div className={styles.videoWrapper}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            allowFullScreen
          />
          {value.caption && <p className={styles.videoCaption}>{value.caption}</p>}
        </div>
      );
    },
  },
};