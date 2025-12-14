import styles from "./Author.module.scss";
import Image from "next/image";
import {ItemProps} from "@/types/posts";
import {getImage} from "@/utils/getImage";
import {formatDateForUrl} from "@/utils/date";

const Author = ({ item }: ItemProps) => {
  return <div className={styles.meta}>
    <div className={styles.author}>
      <div className={styles.authorAvatar}>
        <Image src={getImage(item?.author?.image, 100, 70)} alt={item?.author?.image?.alt ?? item.title} fill />
      </div>
      <div className={styles.authorInfo}>
        <span className={styles.authorBy}>By</span>
        <span className={styles.authorName}>{item.author?.name}</span>
      </div>
    </div>
    <time className={styles.date}>{formatDateForUrl(item?.publishedAt)}</time>
  </div>
}
export default Author;