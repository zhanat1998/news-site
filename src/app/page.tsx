import styles from './page.module.scss';
import VideoCarousel from "@/components/video/VideoCarousel/VideoCarousel";
import DateDisplay from "@/components/ui/DateDisplay/DateDisplay";
import CategoryColumns from "@/components/news/CategoryColumns/CategoryColumns";
import CategoryNewsGrid from "@/components/news/CategoryNewsGrid/CategoryNewsGrid";
import SportSection from "@/components/news/SportSection/SportSection";
import TrendingBar from "@/components/news/TrendingBar";
import HeroLeft from "@/components/news/Hero/HeroLeft";
import HeroCenter from "@/components/news/Hero/HeroCenter";
import HeroRight from "@/components/news/Hero/HeroRight";
import { sanityFetch } from '@/sanity/lib/client';
import {breakingNewsQuery, latestPostsQuery, videosQuery, sportSectionQuery,
  categoryColumnsQuery, categoryNewsGridQuery, interactiveHeroQuery} from "@/sanity/lib/queries";
import MainContainer from "@/components/ui/MainContainer/MainContainer";
import InteractiveHeroBanner from "@/components/news/InteractiveHeroBanner/InteractiveHeroBanner";
import AdBanner from "@/components/ads/AdBanner";

export default async function Home() {
  const [
    posts,
    breakingNews,
    videos,
    sportData,
    categoryColumns,
    categoryNewsGrid,
    heroPosts // ← ЖАҢЫ
  ] = await Promise.all([
    sanityFetch<any[]>({
      query: latestPostsQuery,
      tags: ['posts'],
      revalidate: 0
    }),
    sanityFetch<any[]>({ query: breakingNewsQuery, tags: ['posts', 'breaking'] }),
    sanityFetch<any[]>({ query: videosQuery, tags: ['videos'] }),
    sanityFetch<any>({ query: sportSectionQuery, tags: ['posts', 'sport'] }),
    sanityFetch<any>({ query: categoryColumnsQuery, tags: ['posts', 'categories'] }),
    sanityFetch<any>({ query: categoryNewsGridQuery, tags: ['posts', 'videos', 'categories'] }),
    sanityFetch<any[]>({ query: interactiveHeroQuery, tags: ['posts', 'hero'] }), // ← ЖАҢЫ
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
    thumbnail: video.thumbnail,
  }));

  const trending = breakingNews.length > 0 ? breakingNews : posts.slice(0, 5);
  return (
    <MainContainer>
      <TrendingBar items={trending}/>
      <AdBanner placement="home_top" />
      <DateDisplay/>
      <InteractiveHeroBanner items={heroPosts} />
      <section className={styles.heroSection}>
        <HeroLeft items={posts}/>
        <HeroCenter items={posts}/>
        <HeroRight items={posts}/>
      </section>
      <VideoCarousel
        title="Акыркы видеолор"
        videos={formattedVideos}
        link="/video"
      />
      <AdBanner placement="home_middle" />
      <CategoryColumns categories={categoryColumns} />
      <CategoryNewsGrid categories={categoryNewsGrid} />

      <SportSection
        banner={sportData.banner}
        mainNews={sportData.mainNews}
        sideNews={sportData.sideNews}
      />
      <AdBanner placement="above_footer" />
    </MainContainer>
  );
}