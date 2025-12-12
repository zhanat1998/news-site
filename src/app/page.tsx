import DateDisplay from '../components/ui/DateDisplay/DateDisplay';
import BreakingNews from '../components/news/BreakingNews/BreakingNews';
import MainFeatured from '../components/news/MainFeatured/MainFeatured';
import NewsSidebar from '../components/news/NewsSidebar/NewsSidebar';
import VideoSidebar from '../components/video/VideoSidebar/VideoSidebar';
import SectionHeader from '../components/ui/SectionHeader/SectionHeader';
import NewsCard from '../components/news/NewsCard/NewsCard';
import styles from './page.module.scss';
import {client} from "@/sanity/lib/client";
import {breakingNewsQuery, postsQuery, videosQuery} from "@/sanity/lib/queries";
import {urlFor} from "@/sanity/lib/image";
import {name_of_site, SectionTitles} from "@/constants";
import {paths} from "@/config/paths";
import NewsCarousel from "@/components/news/NewsCarousel/NewsCarousel";

const PLACEHOLDER_IMAGE = 'https://picsum.photos/800/600?random=1'

export default async function Home() {
  const [breakingNews, posts, videos] = await Promise.all([
    client.fetch(breakingNewsQuery),
    client.fetch(postsQuery),
    client.fetch(videosQuery)
  ])

  const featuredNews = posts[0] ? {
    title: posts[0].title,
    slug: posts[0].slug,
    image: posts[0].mainImage ? urlFor(posts[0].mainImage).width(800).height(600).url() : PLACEHOLDER_IMAGE,
    category: posts[0].category || 'Жаңылык'
  } : null

  const moreNews = posts.slice(0, 20).map((p: any) => ({
    title: p.title,
    slug: p.slug,
    image: p.mainImage ? urlFor(p.mainImage).width(400).height(300).url() : PLACEHOLDER_IMAGE,
    category: p.category || 'Жаңылык',
    date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('ky-KG') : ''
  }))

  const latestNews = posts.slice(1, 7).map((p: any) => ({
    title: p.title,
    slug: p.slug
  }))

  const formattedVideos = videos.map((v: any) => ({
    title: v.title,
    slug: v.slug,
    thumbnail: v.thumbnail ? urlFor(v.thumbnail).width(400).height(300).url() : PLACEHOLDER_IMAGE,
    duration: v.duration || ''
  }))

  return (
    <div className={styles.page}>
      <DateDisplay />
      <BreakingNews items={breakingNews} />

      <div className="container">
        <section className={styles.mainSection}>
          <div className={styles.mainLeft}>
            <SectionHeader title={SectionTitles.TOP_STORIES} link="/news" />
            {featuredNews && <MainFeatured {...featuredNews} />}
          </div>

          <div className={styles.mainCenter}>
            <NewsSidebar title={SectionTitles.NEWS} items={latestNews} link={paths.NEWS} />
          </div>

          <div className={styles.mainRight}>
            <VideoSidebar title={`${name_of_site} ТВ`} items={formattedVideos} link="/video" />
          </div>
        </section>

        <section className={styles.moreSection}>
          <SectionHeader title={SectionTitles.SPOTLIGHT} link="/news" />
          <div className={styles.newsGrid}>
            {moreNews.map((news: any) => (
              <NewsCard key={news.slug} {...news} />
            ))}
          </div>
        </section>
        <NewsCarousel
          title={SectionTitles.SPOTLIGHT}
          link="/news"
          items={moreNews}
        />
      </div>
    </div>
  );
}