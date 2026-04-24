import { Suspense } from 'react';
import styles from './page.module.scss';
import VideoCarousel from "@/components/video/VideoCarousel/VideoCarousel";
import InstagramCarousel from "@/components/video/InstagramCarousel/InstagramCarousel";
import TikTokCarousel from "@/components/video/TikTokCarousel/TikTokCarousel";
import DateDisplay from "@/components/ui/DateDisplay/DateDisplay";
import CategoryColumns from "@/components/news/CategoryColumns/CategoryColumns";
import CategoryNewsGrid from "@/components/news/CategoryNewsGrid/CategoryNewsGrid";
import TrendingBar from "@/components/news/TrendingBar";
import HeroLeft from "@/components/news/Hero/HeroLeft";
import HeroCenter from "@/components/news/Hero/HeroCenter";
import HeroRight from "@/components/news/Hero/HeroRight";
import MainContainer from "@/components/ui/MainContainer/MainContainer";
import InteractiveHeroBanner from "@/components/news/InteractiveHeroBanner/InteractiveHeroBanner";
import AdBanner from "@/components/ads/AdBanner";

// Sanity imports
import {
  getLatestPosts,
  getYouTubeVideos,
  getInstagramVideos,
  getTikTokVideos,
  getPostsByCategory,
  fetchCategoryColumnsData,
  fetchCategoryNewsGridData,
} from '@/lib/sanity/api';
import {
  adaptPosts,
  adaptVideos,
  formatVideosForCarousel,
} from '@/lib/sanity/adapters';

export default async function Home() {
  const [
    latestPostsRaw,
    youtubeVideosRaw,
    instagramVideosRaw,
    tiktokVideosRaw,
    categoryColumns,
    categoryNewsGrid,
  ] = await Promise.all([
    getLatestPosts(20),
    getYouTubeVideos(20),
    getInstagramVideos(20),
    getTikTokVideos(20),
    fetchCategoryColumnsData(getPostsByCategory),
    fetchCategoryNewsGridData(getPostsByCategory),
  ]);

  // Adapt data to match existing component props
  const posts = adaptPosts(latestPostsRaw);
  const videos = adaptVideos(youtubeVideosRaw);
  const instagramVideos = adaptVideos(instagramVideosRaw);
  const tiktokVideos = adaptVideos(tiktokVideosRaw);
  const heroPosts = posts.slice(0, 12);

  const formattedVideos = formatVideosForCarousel(youtubeVideosRaw);

  // Use latest posts for trending if no breaking news
  const trending = posts.slice(0, 5);

  return (
    <MainContainer>
      <TrendingBar items={trending as any}/>
      <AdBanner placement="home_top" />
      <DateDisplay/>
      <InteractiveHeroBanner items={heroPosts as any} />
      <section className={styles.heroSection}>
        <HeroLeft items={posts as any}/>
        <HeroCenter items={posts as any}/>
        <HeroRight items={posts as any}/>
      </section>
      <VideoCarousel
        title="Акыркы видеолор"
        videos={formattedVideos as any}
        link="/video"
      />
      {instagramVideos && instagramVideos.length > 0 && (
        <Suspense fallback={null}>
          <InstagramCarousel
            title="Instagram"
            videos={instagramVideos as any}
          />
        </Suspense>
      )}
      {tiktokVideos && tiktokVideos.length > 0 && (
        <Suspense fallback={null}>
          <TikTokCarousel
            title="TikTok"
            videos={tiktokVideos as any}
          />
        </Suspense>
      )}
      <AdBanner placement="home_middle" />
      <CategoryColumns categories={categoryColumns as any} />
      <CategoryNewsGrid categories={categoryNewsGrid as any} />
      <AdBanner placement="home_bottom" />
    </MainContainer>
  );
}
