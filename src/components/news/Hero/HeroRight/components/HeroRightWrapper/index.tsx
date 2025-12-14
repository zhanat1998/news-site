import styles from "./HeroRightWrapper.module.scss";
import {ReactNode} from "react";

interface HeroRightWrapperProps {
  children: ReactNode;
  title: string;
}
const HeroRightWrapper = ({ children, title }:HeroRightWrapperProps) => {
  return  <div className={styles.sidebarSection}>
    <h3 className={styles.sidebarTitle}>
      <span className={styles.sidebarAccent}></span>
      {title}
    </h3>
    {children}
  </div>
}
export default HeroRightWrapper;