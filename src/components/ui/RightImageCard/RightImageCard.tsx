import {routes} from "@/config/routes";
import Image from "next/image";
import {getImage} from "@/utils/getImage";
import Link from "next/link";
import {Post} from "@/types/posts";
import styles from "./RightImageCard.module.scss";

interface RightImageCardProps {
  item: Post;
  height?: number;
  width?: number;
}

const RightImageCard = (props: RightImageCardProps) => {
  const { item, height = 120, width = 180 } = props;

  return (
    <Link
      href={routes.newsDetail(item.publishedAt, item.slug?.current)}
      className={styles.card}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>{item.title}</h2>
      </div>
      <div className={styles.image} style={{ height, width }}>
        <Image
          src={getImage(item.mainImage, width, height)}
          alt={item.title}
          fill
        />
      </div>
    </Link>
  );
};

export default RightImageCard;