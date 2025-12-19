import {routes} from "@/config/routes";
import styles from "./HeroLeftMain.module.scss";
import Image from "next/image";
import {getImage} from "@/utils/getImage";
import Link from "next/link";
import {Post} from "@/types/posts";
import {CSSProperties} from "react";

interface HeroLeftMainProps {
  item: Post;
  height?: number;
  has_excerpt?: boolean;
}
const HeroLeftMain = ({ item, height, has_excerpt }: HeroLeftMainProps) => {
  const imageStyle: CSSProperties = height ? { height } : {};
  return (
    <Link href={routes.newsDetail(item.publishedAt, item.slug?.current)}
          className={styles.heroMainCard}>
      <div className={styles.heroMainImage} style={imageStyle}>
        <Image
          src={getImage(item?.mainImage, 800, 500)}
          alt={item.title}
          fill
        />
      </div>
      <div className={styles.heroMainAccent}></div>
      <h1 className={styles.heroMainTitle}>{item.title}</h1>
      {has_excerpt && <p className={styles.heroMainExcerpt}>{item.excerpt}</p>}
    </Link>
  )
}
export default HeroLeftMain;