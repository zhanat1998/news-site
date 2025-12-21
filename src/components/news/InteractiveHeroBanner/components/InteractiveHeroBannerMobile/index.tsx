import styles from "./index.module.scss";
import Image from "next/image";
import {urlFor} from "@/sanity/lib/image";
import Link from "next/link";
import {formatDateForUrl} from "@/utils/date";

interface InteractiveHeroBannerMobileProps {
  thumbnailPosts: Post[];
  mainPost: Post;
  activeIndex: number;
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;
}
const InteractiveHeroBannerMobile = (
  { thumbnailPosts,
    mainPost,
    handleTouchEnd,
    handleTouchStart,
    handleTouchMove,
    activeIndex
  }:InteractiveHeroBannerMobileProps) => {
  return (
    <div className={styles.mobileView}>
      <div className={styles.progressBarContainer}>
        {thumbnailPosts.map((_, index) => (
          <div key={index} className={styles.progressBarSegment}>
            <div
              className={`${styles.progressBarFill} ${
                index === activeIndex ? styles.active : ''
              } ${index < activeIndex ? styles.completed : ''}`}
            />
          </div>
        ))}
      </div>

      <div
        className={styles.mobileImage}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {mainPost.mainImage?.asset?.url && (
          <Image
            src={urlFor(mainPost.mainImage).width(500).height(200).url()}
            alt={mainPost.mainImage.alt || mainPost.title}
            fill
            priority
          />
        )}
      </div>

      <div className={styles.mobileContent}>
        {mainPost.categories && mainPost.categories[0] && (
          <div className={styles.categoryBadge}>
            {mainPost.categories[0].title}
          </div>
        )}

        <Link
          href={`/news/${formatDateForUrl(mainPost.publishedAt)}/${mainPost.slug.current}`}
          className={styles.titleLink}
        >
          <h1 className={styles.mobileTitle}>
            {mainPost.title}
          </h1>
        </Link>
      </div>
    </div>
  );
}
export default InteractiveHeroBannerMobile;