import Image from 'next/image';
import styles from './NewsGrid.module.scss';
import {ToDetailRouteProps} from "@/types/posts";
import DetailRoute from "@/components/ui/DetailRoute";
import {getImage} from "@/utils/getImage";


export default function NewsGrid({ title, items }: ToDetailRouteProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        {title} <span className={styles.dot}>●</span>
      </h2>

      <div className={styles.grid}>
        {items?.map((item) => (
          <DetailRoute className={styles.card} item={item} key={item.slug?.current}>
            <h3 className={styles.title}>{item.title}</h3>
            <div className={styles.imageWrapper}>
              <Image src={getImage(item?.mainImage, 400, 250)} alt={item.title} fill />
            </div>
          </DetailRoute>
        ))}
      </div>
    </section>
  );
}