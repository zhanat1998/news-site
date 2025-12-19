import styles from './page.module.scss';
import VideoCarousel from "@/components/video/VideoCarousel/VideoCarousel";
import DateDisplay from "@/components/ui/DateDisplay/DateDisplay";
import CategoryColumns from "@/components/news/CategoryColumns/CategoryColumns";
import {categoryColumnsData, categoryNewsData, sportData} from "@/constants";
import CategoryNewsGrid from "@/components/news/CategoryNewsGrid/CategoryNewsGrid";
import SportSection from "@/components/news/SportSection/SportSection";
import TrendingBar from "@/components/news/TrendingBar";
import HeroLeft from "@/components/news/Hero/HeroLeft";
import HeroCenter from "@/components/news/Hero/HeroCenter";
import HeroRight from "@/components/news/Hero/HeroRight";
import { sanityFetch } from '@/sanity/lib/client';
import VideoSection from "@/components/video/VideoSection/VideoSection";
import {breakingNewsQuery, latestPostsQuery, videosQuery} from "@/sanity/lib/queries";
import MainContainer from "@/components/ui/MainContainer/MainContainer";

export default async function Home() {
  const [posts, breakingNews, videos] = await Promise.all([
    sanityFetch<any[]>({
      query: latestPostsQuery,
      tags: ['posts'],
      revalidate: 0
    }),
    sanityFetch<any[]>({ query: breakingNewsQuery, tags: ['posts', 'breaking'] }),
    sanityFetch<any[]>({ query: videosQuery, tags: ['videos'] }),  // ← ЖАҢЫ
  ]);

  const formattedVideos = videos.map(video => ({
    _id: video._id,
    title: video.title,
    slug: video.slug,
    image: video.thumbnail?.asset?.url
      || `https://vz-0a81affa-d72.b-cdn.net/${video.bunnyVideoId}/thumbnail.jpg`,
    excerpt: video.description,
    category: video.category?.title,
    duration: video.duration,
  }));

  const trending = breakingNews.length > 0 ? breakingNews : posts.slice(0, 5);

  return (
    <MainContainer>
      <TrendingBar items={trending}/>
      <DateDisplay/>
      <section className={styles.heroSection}>
        <HeroLeft items={posts}/>
        <HeroCenter items={posts}/>
        <HeroRight items={posts}/>
      </section>
      <VideoCarousel
        title="Latest Episodes"
        videos={formattedVideos}
        link="/video"
      />
      <VideoSection
        title="ЖАҢЫ ВИДЕОЛОР"
        link="/video"
        items={formattedVideos}
      />
      <CategoryColumns categories={categoryColumnsData} />
      <CategoryNewsGrid categories={categoryNewsData} />

      <SportSection
        bannerImage={sportData.bannerImage}
        mainNews={sportData.mainNews}
        sideNews={sportData.sideNews}
        link="/category/sport"
      />
    </MainContainer>
  );
}