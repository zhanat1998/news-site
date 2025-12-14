import styles from "./MainImage.module.scss";
import Image from "next/image";
import {ItemProps} from "@/types/posts";
import {getImage} from "@/utils/getImage";

const MainImage = ({ item }:ItemProps) => {
  return  <figure className={styles.mainFigure}>
    <div className={styles.mainImage}>
      <Image src={getImage(item?.mainImage, 500, 300)} alt={item.title} fill />
    </div>
    <figcaption className={styles.imageCaption}>{item.mainImage?.alt}</figcaption>
  </figure>
}
export default MainImage;