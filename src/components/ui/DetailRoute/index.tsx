import Link from "next/link";
import {formatDateForUrl} from "@/utils/date";
import {ToDetailRouteProps} from "@/types/posts";

const DetailRoute = ({ children, item, className }: ToDetailRouteProps) => {
  return  <Link key={item?._id} href={`/news/${formatDateForUrl(item?.publishedAt as string)}/${item?.slug?.current}`} className={className}>
    {children}
  </Link>
}
export default DetailRoute;