import styles from "./HeroLeft.module.scss";
import {Posts} from "@/types/posts";
import HeroLeftMain from "../../../ui/HeroLeftMain";
import RightImageCard from "@/components/ui/RightImageCard/RightImageCard";

const HeroLeft =  ({ items }: Posts) => {
  const heroMain = items[0];
  const heroSecond = items[1];

  return <div className={styles.heroLeft}>
    {heroMain && (
      <HeroLeftMain item={heroMain} key={heroMain?._id}/>
    )}

    {heroSecond && (
      <RightImageCard item={heroSecond} key={heroSecond?._id}/>
    )}
  </div>
}
export default HeroLeft;