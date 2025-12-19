import Link from "next/link";
import {formatDateForUrl} from "@/utils/date";
import Image from "next/image";
import styles from "./HeroCenter.module.scss";
import {Posts} from "@/types/posts";
import {getImage} from "@/utils/getImage";
import HeroLeftMain from "../../../ui/HeroLeftMain";
import RightImageCard from "@/components/ui/RightImageCard/RightImageCard";
import RightSmallImageCard from "@/components/ui/RightSmallImageCard/RightSmallImageCard";

const HeroCenter = ({ items }: Posts) => {
  const centerMain = items[2];
  const centerNews = items.slice(3, 5);
  const centerLinks = items.slice(5, 9);
  return <div className={styles.heroCenter}>
    {centerMain && (
      <HeroLeftMain item={centerMain} key={centerMain?._id} height={220} has_excerpt={false}/>
    )}

    <div className={styles.centerNewsList}>
      {centerNews.map((news: any) => (
        <RightSmallImageCard item={news} key={news._id} />
      ))}
    </div>

    <div className={styles.centerLinks}>
      {centerLinks.map((link: any) => (
        <Link key={link._id}
              href={`/news/${formatDateForUrl(link.publishedAt)}/${link.slug?.current}`}
              className={styles.centerLink}>
          {link.title}
        </Link>
      ))}
    </div>
  </div>
}
export default HeroCenter;