import styles from "./Author.module.scss";
import Image from "next/image";
import {ItemProps} from "@/types/posts";
import {getImage} from "@/utils/getImage";

const Author = ({ item }: ItemProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className={styles.meta}>
      <div className={styles.author}>
        <div className={styles.authorAvatar}>
          <Image src={getImage(item?.author?.image, 100, 100)} alt={item?.author?.image?.alt ?? item.title} fill />
        </div>
        <div className={styles.authorInfo}>
          <span className={styles.authorName}>{item.author?.name || 'Редакция'}</span>
          <span className={styles.authorRole}>Автор</span>
        </div>
      </div>
      <div className={styles.separator} />
      <div className={styles.dateWrapper}>
        <svg className={styles.dateIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <time className={styles.date}>{formatDate(item?.publishedAt)}</time>
      </div>
    </div>
  );
}
export default Author;