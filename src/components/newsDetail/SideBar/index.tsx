import styles from "./SideBar.module.scss";
import Image from "next/image";
import {getImage} from "@/utils/getImage";
import {Posts} from "@/types/posts";
import DetailRoute from "@/components/ui/DetailRoute";

const SideBar = ({ items }: Posts) => {
  return <aside className={styles.sidebar}>
    {items?.map((item: any) => (
      <DetailRoute className={styles.sidebarCard} item={item} key={item._id}>
        <div className={styles.sidebarImage}>
          <Image
            src={getImage(item?.mainImage, 250, 150, 70)}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 250px"
          />
          <div className={styles.sidebarLogo}>С</div>
        </div>
        <p className={styles.sidebarTitle}>{item.title}</p>
        <button className={styles.readMoreBtn}>Окуу</button>
      </DetailRoute>
    ))}
  </aside>
}
export default SideBar;