import Link from "next/link";
import {formatDateForUrl} from "@/utils/date";
import Image from "next/image";
import {getImage} from "@/utils/getImage";
import styles from "./HeroLeft.module.scss";
import {Posts} from "@/types/posts";

const HeroLeft =  ({ items }: Posts) => {
  const heroMain = items[0];
  const heroSecond = items[1];

  return <div className={styles.heroLeft}>
    {heroMain && (
      <Link key={heroMain?._id} href={`/news/${formatDateForUrl(heroMain.publishedAt)}/${heroMain.slug?.current}`}
            className={styles.heroMainCard}>
        <div className={styles.heroMainImage}>
          <Image
            src={getImage(heroMain?.mainImage, 800, 500)}  // Чоң сүрөт ал
            alt={heroMain.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 446px"
            priority
          />
        </div>
        <div className={styles.heroMainAccent}></div>
        <h1 className={styles.heroMainTitle}>{heroMain.title}</h1>
        <p className={styles.heroMainExcerpt}>{heroMain.excerpt}</p>
      </Link>
    )}

    {heroSecond && (
      <Link key={heroSecond?._id} href={`/news/${formatDateForUrl(heroSecond.publishedAt)}/${heroSecond.slug?.current}`}
            className={styles.heroSecondCard}>
        <div className={styles.heroSecondContent}>
          <h2 className={styles.heroSecondTitle}>{heroSecond.title}</h2>
          <p className={styles.heroSecondExcerpt}>{heroSecond.excerpt}</p>
        </div>
        <div className={styles.heroSecondImage}>
          <Image src={getImage(heroSecond?.mainImage, 400, 250)} alt={heroSecond.title} fill />
        </div>
      </Link>
    )}
  </div>
}
export default HeroLeft;