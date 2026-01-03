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
  const { item, height, width } = props;

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
          src={getImage(item.mainImage, 400, 250, 75)}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 200px"
        />
      </div>
    </Link>
  );
};

export default RightImageCard;