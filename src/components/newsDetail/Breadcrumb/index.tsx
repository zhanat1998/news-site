import styles from "./Breadcrumb.module.scss";
import Link from "next/link";
import {ItemProps} from "@/types/posts";
import {SectionTitles} from "@/constants";

const Breadcrumb = ({ item }:ItemProps) => {
  return <div className={styles.breadcrumb}>
    <Link href="/news">{SectionTitles.NEWS}</Link>
    <span className={styles.separator}>|</span>
    <Link href={`/category/${item?.category?.title}`}>{item?.category?.title}</Link>
  </div>
}
export default Breadcrumb;