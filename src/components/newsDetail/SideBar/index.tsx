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
            src={getImage(item, 300, 180)}
            alt={item.title}
            fill
          />
          <div className={styles.sidebarLogo}>С</div>
        </div>
        <p className={styles.sidebarTitle}>{item.title}</p>
        <button className={styles.readMoreBtn}>Окуу</button>
      </DetailRoute>
    ))}

    {/* Advertisement */}
    <div className={styles.adSection}>
      <span className={styles.adLabel}>Жарнама</span>
      <div className={styles.adBanner}>
        <Image
          src="https://picsum.photos/300/250?random=111"
          alt="Ad"
          fill
        />
      </div>
    </div>
  </aside>
}
export default SideBar;