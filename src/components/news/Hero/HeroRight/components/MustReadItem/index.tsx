import {formatDateForUrl} from "@/utils/date";
import Image from "next/image";
import {getImage} from "@/utils/getImage";
import Link from "next/link";
import styles from "./MustReadItem.module.scss";
import {ItemProps} from "@/types/posts";

const MustReadItem = ({ item }:ItemProps) => {
  return <Link
    key={item._id}
    href={`/news/${formatDateForUrl(item.publishedAt)}/${item.slug?.current}`}
    className={styles.sidebarItem}>
    <div className={styles.sidebarItemImage}>
      <Image src={getImage(item?.mainImage, 100, 70)} alt={item.title} fill />
    </div>
    <p className={styles.sidebarItemTitle}>{item.title}</p>
  </Link>
}
export default MustReadItem