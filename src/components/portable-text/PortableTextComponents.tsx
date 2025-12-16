import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import styles from './PortableText.module.scss';

export const portableTextComponents = {
  // Блок стилдери
  block: {
    // Кадимки параграф
    normal: ({children}: any) => (
      <p className={styles.paragraph}>{children}</p>
    ),

    // H2 - Subtitle (Азаттык стили)
    h2: ({children}: any) => (
      <h2 className={styles.subtitle}>{children}</h2>
    ),

    // H3
    h3: ({children}: any) => (
      <h3 className={styles.h3}>{children}</h3>
    ),

    // H4
    h4: ({children}: any) => (
      <h4 className={styles.h4}>{children}</h4>
    ),

    // Цитата (Blockquote)
    blockquote: ({children}: any) => (
      <blockquote className={styles.blockquote}>
        {children}
      </blockquote>
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

  listItem: {
    bullet: ({children}: any) => (
      <li className={styles.listItem}>{children}</li>
    ),
    number: ({children}: any) => (
      <li className={styles.listItem}>{children}</li>
    ),
  },

  // Текст стилдери (bold, italic, underline, link)
  marks: {
    strong: ({children}: any) => (
      <strong className={styles.bold}>{children}</strong>
    ),
    em: ({children}: any) => (
      <em className={styles.italic}>{children}</em>
    ),
    underline: ({children}: any) => (
      <span className={styles.underline}>{children}</span>
    ),
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

  // Өзгөчө блоктор (сүрөт, видео, ж.б.)
  types: {
    // Сүрөт
    image: ({value}: any) => {
      if (!value?.asset) return null;
      return (
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
            <figcaption className={styles.caption}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    // "Дагы караңыз" блогу
    relatedBlock: ({value}: any) => {
      if (!value?.relatedPost) return null;
      return (
        <div className={styles.relatedBlock}>
          <div className={styles.relatedAccent}></div>
          <div className={styles.relatedContent}>
            {value.relatedPost.mainImage && (
              <div className={styles.relatedImage}>
                <Image
                  src={urlFor(value.relatedPost.mainImage).width(200).height(140).url()}
                  alt={value.relatedPost.title}
                  fill
                />
              </div>
            )}
            <div className={styles.relatedText}>
              <span className={styles.relatedLabel}>ДАГЫ КАРАҢЫЗ</span>
              <Link href={`/news/${value.relatedPost.slug?.current}`}>
                {value.relatedPost.title}
              </Link>
            </div>
          </div>
        </div>
      );
    },

    // YouTube видео
    youtube: ({value}: any) => {
      if (!value?.url) return null;
      const videoId = value.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
      if (!videoId) return null;

      return (
        <div className={styles.videoWrapper}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {value.caption && (
            <p className={styles.videoCaption}>{value.caption}</p>
          )}
        </div>
      );
    },
    bunnyVideo: ({value}: any) => {
      if (!value?.videoId) return null;
      const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;

      return (
        <div className={styles.videoWrapper}>
          <iframe
            src={`https://iframe.mediadelivery.net/embed/${libraryId}/${value.videoId}?autoplay=false&preload=true`}
            title={value.caption || 'Видео'}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
          {value.caption && (
            <p className={styles.videoCaption}>{value.caption}</p>
          )}
        </div>
      );
    },
  }
};