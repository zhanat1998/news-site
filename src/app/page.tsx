import styles from './page.module.scss';
import { client } from '@/sanity/lib/client';
import VideoCarousel from "@/components/video/VideoCarousel/VideoCarousel";
import DateDisplay from "@/components/ui/DateDisplay/DateDisplay";
import CategoryColumns from "@/components/news/CategoryColumns/CategoryColumns";
import {categoryColumnsData, categoryNewsData, mockVideos, sportData} from "@/constants";
import CategoryNewsGrid from "@/components/news/CategoryNewsGrid/CategoryNewsGrid";
import SportSection from "@/components/news/SportSection/SportSection";
import { groq } from 'next-sanity';
import TrendingBar from "@/components/news/TrendingBar";
import HeroLeft from "@/components/news/Hero/HeroLeft";
import HeroCenter from "@/components/news/Hero/HeroCenter";
import HeroRight from "@/components/news/Hero/HeroRight";
import BreakingNews from "@/components/news/BreakingNews/BreakingNews";

// app/page.tsx

const latestPostsQuery = groq`
  *[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc) [0...20] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    section,
    isFeatured,
    isBreaking,   
    mainImage { asset->, alt },
    category->{ title, slug },
    author->{ name, image }
  }
`;

const breakingNewsQuery = groq`
  *[_type == "post" && isBreaking == true] | order(coalesce(publishedAt, _createdAt) desc) [0...5] {
    _id,
    title,
    slug,
    publishedAt
  }
`;

export default async function Home() {
  const posts = await client.fetch(latestPostsQuery);
  const breakingNews = await client.fetch(breakingNewsQuery);

  // Trending
  const trending = breakingNews.length > 0 ? breakingNews : posts.slice(0, 5);

  return (
    <div className={styles.page}>
      <TrendingBar items={trending}/>
      {/*<BreakingNews items={posts}/>*/}
      <div className="container">
        <DateDisplay/>
        <section className={styles.heroSection}>
          <HeroLeft items={posts}/>
          <HeroCenter items={posts}/>
          <HeroRight items={posts}/>
        </section>
      </div>
      <VideoCarousel
        title="КӨРҮҮ КЕРЕК"
        link="/video"
        items={mockVideos}
      />
      <CategoryColumns categories={categoryColumnsData} />
      <CategoryNewsGrid categories={categoryNewsData} />

      <SportSection
        bannerImage={sportData.bannerImage}
        mainNews={sportData.mainNews}
        sideNews={sportData.sideNews}
        link="/category/sport"
      />
    </div>
  );
}