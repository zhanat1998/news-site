import { MetadataRoute } from 'next';
import { getSitemapData } from '@/lib/strapi/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';

  const { posts, videos, categories } = await getSitemapData();

  // Статикалык беттер
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${siteUrl}/video`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Жаңылыктар беттери
  const postPages: MetadataRoute.Sitemap = posts.map((post) => {
    const publishDate = (post as any).publish || (post as any).publishedAt || new Date();
    const date = publishDate ? new Date(publishDate).toISOString().split('T')[0] : '';
    return {
      url: `${siteUrl}/news/${date}/${post.slug}`,
      lastModified: new Date((post as any).updatedAt || publishDate),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    };
  });

  // Видео беттери
  const videoPages: MetadataRoute.Sitemap = videos.map((video) => ({
    url: `${siteUrl}/video/${video.slug}`,
    lastModified: new Date((video as any).publishedat || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Категория беттери
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl}/category/${category.slug}`,
    lastModified: new Date((category as any).updatedAt || new Date()),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...postPages, ...videoPages, ...categoryPages];
}
