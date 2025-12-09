import Link from 'next/link';
import Image from 'next/image';
import styles from './VideoSidebar.module.scss';

type VideoItem = {
  title: string;
  slug: string;
  thumbnail: string;
  duration?: string;
};

type Props = {
  title: string;
  items: VideoItem[];
  link?: string;
};

export default function VideoSidebar({ title, items, link }: Props) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {link && (
          <Link href={link} className={styles.more}>
            →
          </Link>
        )}
      </div>
      <div className={styles.list}>
        {items.map((item) => (
          <Link key={item.slug} href={`/video/${item.slug}`} className={styles.item}>
            <div className={styles.thumbnail}>
              <Image src={item.thumbnail} alt={item.title} fill />
              <div className={styles.playIcon}>▶</div>
              {item.duration && (
                <span className={styles.duration}>{item.duration}</span>
              )}
            </div>
            <p className={styles.videoTitle}>{item.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}