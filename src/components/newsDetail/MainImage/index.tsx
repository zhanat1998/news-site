import styles from "./MainImage.module.scss";
import Image from "next/image";
import {ItemProps} from "@/types/posts";
import {getImage} from "@/utils/getImage";

const MainImage = ({ item }:ItemProps) => {
  return  <figure className={styles.mainFigure}>
    <div className={styles.mainImage}>
      <Image
        src={getImage(item?.mainImage, 800, 480, 80)}
        alt={item.title}
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
      />
    </div>
    <figcaption className={styles.imageCaption}>{item.mainImage?.alt}</figcaption>
  </figure>
}
export default MainImage;