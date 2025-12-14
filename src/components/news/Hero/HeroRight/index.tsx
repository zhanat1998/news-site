import styles from "./HeroRight.module.scss";
import HeroRightWrapper from "@/components/news/Hero/HeroRight/components/HeroRightWrapper";
import OpinionItem from "@/components/news/Hero/HeroRight/components/OpinionItem";
import MustReadItem from "@/components/news/Hero/HeroRight/components/MustReadItem";
import {Posts} from "@/types/posts";

const HeroRight = ({ items }:Posts) => {
  const mustReads = items.slice(9, 12);
  const moreHeadlines = items.slice(12, 15);
  const opinions = items.filter((p: any) => p.section === 'opinion').slice(0, 2);

  return <div className={styles.heroRight}>
    <HeroRightWrapper title="ОКУУ КЕРЕК">
      {mustReads.map((item: any) => (
        <MustReadItem item={item}/>
      ))}
    </HeroRightWrapper>
    <HeroRightWrapper title="ДАГЫ ЖАҢЫЛЫКТАР">
      {moreHeadlines.map((item: any) => (
        <MustReadItem item={item}/>
      ))}
    </HeroRightWrapper>
   <HeroRightWrapper title="ПИКИР">
     {opinions.map((item: any) => (
       <OpinionItem item={item}/>
     ))}
   </HeroRightWrapper>
  </div>
}
export default HeroRight;