import Link from "next/link";
import { formatDateForUrl } from "@/utils/date";
import styles from "./TrendingBar.module.scss";
import {Posts} from "@/types/posts";
import {SectionTitles} from "@/constants";

const TrendingBar = ({ items }: Posts) => {
  if (!items || items.length === 0) return null;
  return <div className={styles.trendingBar}>
    <div className="container">
      <div className={styles.trendingInner}>
        <span className={styles.trendingLabel}>🔥 {SectionTitles.BREAKING_NEWS}</span>
        <div className={styles.trendingLinks}>
          {items.map((item: any) => (
            <Link key={item._id} href={`/news/${formatDateForUrl(item.publishedAt)}/${item.slug?.current}`} className={styles.trendingLink}>
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
}
export default TrendingBar;