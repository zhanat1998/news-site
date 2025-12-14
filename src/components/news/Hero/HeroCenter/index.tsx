import Link from "next/link";
import {formatDateForUrl} from "@/utils/date";
import Image from "next/image";
import styles from "./HeroCenter.module.scss";
import {Posts} from "@/types/posts";
import {getImage} from "@/utils/getImage";

const HeroCenter = ({ items }: Posts) => {
  const centerMain = items[2];
  const centerNews = items.slice(3, 5);
  const centerLinks = items.slice(5, 9);
  return <div className={styles.heroCenter}>
    {centerMain && (
      <Link
        href={`/news/${formatDateForUrl(centerMain.publishedAt)}/${centerMain.slug?.current}`}
        className={styles.centerMainCard}>
        <div className={styles.centerMainImage}>
          <Image src={getImage(centerMain, 500, 300)} alt={centerMain.title} fill />
        </div>
        <h2 className={styles.centerMainTitle}>{centerMain.title}</h2>
      </Link>
    )}

    <div className={styles.centerNewsList}>
      {centerNews.map((news: any) => (
        <Link key={news._id}
              href={`/news/${formatDateForUrl(news.publishedAt)}/${news.slug?.current}`}
              className={styles.centerNewsItem}>
          <p className={styles.centerNewsTitle}>{news.title}</p>
          <div className={styles.centerNewsImage}>
            <Image src={getImage(news, 150, 100)} alt={news.title} fill />
          </div>
        </Link>
      ))}
    </div>

    <div className={styles.centerLinks}>
      {centerLinks.map((link: any) => (
        <Link key={link._id}
              href={`/news/${formatDateForUrl(link.publishedAt)}/${link.slug?.current}`}
              className={styles.centerLink}>
          {link.title}
        </Link>
      ))}
    </div>
  </div>
}
export default HeroCenter;