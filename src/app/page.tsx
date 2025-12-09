import DateDisplay from '../components/ui/DateDisplay/DateDisplay';
import BreakingNews from '../components/news/BreakingNews/BreakingNews';
import MainFeatured from '../components/news/MainFeatured/MainFeatured';
import NewsSidebar from '../components/news/NewsSidebar/NewsSidebar';
import VideoSidebar from '../components/video/VideoSidebar/VideoSidebar';
import SectionHeader from '../components/ui/SectionHeader/SectionHeader';
import NewsCard from '../components/news/NewsCard/NewsCard';
import styles from './page.module.scss';
import {client} from "@/sanity/lib/client";
import {breakingNewsQuery, postsQuery} from "@/sanity/lib/queries";
import {urlFor} from "@/sanity/lib/image";

// Видео үчүн убактылуу
const videos = [
  {
    title: '"Жол курулушунда ток уруп, төрт мүчөмдөн ажырадым"',
    slug: 'road-construction',
    thumbnail: 'https://picsum.photos/400/300?random=10',
    duration: '5:43'
  },
];

export default async function Home() {
  const [breakingNews, posts] = await Promise.all([
    client.fetch(breakingNewsQuery),
    client.fetch(postsQuery)
  ])
  console.log(posts,'posts')

  const PLACEHOLDER_IMAGE = 'https://picsum.photos/800/600?random=1'

  const featuredNews = posts[0] ? {
    title: posts[0].title,
    slug: posts[0].slug,
    image: posts[0].mainImage ? urlFor(posts[0].mainImage).width(800).height(600).url() : PLACEHOLDER_IMAGE,
    category: posts[0].category || 'Жаңылык'
  } : null

  const moreNews = posts.slice(0, 4).map((p: any) => ({
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


  return (
    <div className={styles.page}>
      <DateDisplay />
      <BreakingNews items={breakingNews} />

      <div className="container">
        <section className={styles.mainSection}>
          <div className={styles.mainLeft}>
            <SectionHeader title="Башкы темалар" link="/news" />
            {featuredNews && <MainFeatured {...featuredNews} />}
          </div>

          <div className={styles.mainCenter}>
            <NewsSidebar title="Жаңылыктар" items={latestNews} link="/news" />
          </div>

          <div className={styles.mainRight}>
            <VideoSidebar title="NewsKG ТВ" items={videos} link="/video" />
          </div>
        </section>

        <section className={styles.moreSection}>
          <SectionHeader title="Дагы жаңылыктар" link="/news" />
          <div className={styles.newsGrid}>
            {moreNews.map((news: any) => (
              <NewsCard key={news.slug} {...news} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}