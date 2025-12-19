import {formatDateForUrl} from "@/utils/date";
import Image from "next/image";
import {getImage} from "@/utils/getImage";
import Link from "next/link";
import {ItemProps} from "@/types/posts";
import styles from './index.module.scss';

const RightSmallImageCard = ({ item }: ItemProps) => {
  return (
    <Link href={`/news/${formatDateForUrl(item.publishedAt)}/${item.slug?.current}`}
          className={styles.item}>
      <p className={styles.title}>{item.title}</p>
      <div className={styles.image}>
        <Image src={getImage(item?.mainImage, 150, 100)} alt={item.title} fill />
      </div>
    </Link>
  )
}
export default RightSmallImageCard;