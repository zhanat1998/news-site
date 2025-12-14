import Link from "next/link";
import Image from "next/image";
import { formatDateForUrl } from "@/utils/date";
import { urlFor } from "@/sanity/lib/image";
import styles from "./OpinionItem.module.scss";
import {ItemProps} from "@/types/posts";

const OpinionItem = ({ item }: ItemProps) => {
  const authorImage = item.author?.image
    ? urlFor(item.author.image).width(50).height(50).url()
    : `https://picsum.photos/50/50?random=${item._id}`;

  return (
    <Link
      href={`/news/${formatDateForUrl(item.publishedAt)}/${item.slug?.current}`}
      className={styles.opinionItem}
    >
      <div className={styles.opinionAvatar}>
        <Image
          src={authorImage}
          alt={item.author?.name || "Author"}
          fill
        />
      </div>
      <div className={styles.opinionContent}>
        <p className={styles.opinionTitle}>{item.title}</p>
        <span className={styles.opinionAuthor}>
          {item.author?.name || "Автор"}
        </span>
      </div>
    </Link>
  );
};

export default OpinionItem;