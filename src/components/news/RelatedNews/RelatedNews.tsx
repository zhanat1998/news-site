import Image from 'next/image';
import styles from './RelatedNews.module.scss';
import {Posts} from "@/types/posts";
import DetailRoute from "@/components/ui/DetailRoute";
import {formatDateForUrl} from "@/utils/date";
import {getImage} from "@/utils/getImage";


export default function RelatedNews({ items }: Posts) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        БАЙЛАНЫШТУУ <span className={styles.dot}>●</span>
      </h2>

      <div className={styles.list}>
        {items.map((item) => (
          <DetailRoute className={styles.card} item={item}  key={item?.slug?.current}>
            <div className={styles.content}>
              <h3 className={styles.title}>{item.title}</h3>
              <time className={styles.date}>{formatDateForUrl(item?.publishedAt)}</time>
            </div>
            <div className={styles.imageWrapper}>
              <Image src={getImage(item?.mainImage, 400, 250)} alt={item.title} fill />
            </div>
          </DetailRoute>
        ))}
      </div>
    </section>
  );
}