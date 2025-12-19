import {formatDateForUrl} from "@/utils/date";

export const routes = {
  home: '/',
  news: '/news',
  newsDetail: (publishedAt: string, slug?: string) => `/news/${formatDateForUrl(publishedAt)}/${slug}`,
  search: (query?: string) => query ? `/search?q=${encodeURIComponent(query)}` : '/search',
  category: (slug: string) => `/category/${slug}`,
  author: (slug: string) => `/author/${slug}`,
};