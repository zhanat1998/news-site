import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';

  // Бардык посттор
  const posts = await client.fetch<{ slug: string; publishedAt: string; _updatedAt: string }[]>(groq`
    *[_type == "post"] | order(publishedAt desc) {
      "slug": slug.current,
      publishedAt,
      _updatedAt
    }
  `);

  // Бардык видеолор
  const videos = await client.fetch<{ slug: string; publishedAt: string; _updatedAt: string }[]>(groq`
    *[_type == "video"] | order(publishedAt desc) {
      "slug": slug.current,
      publishedAt,
      _updatedAt
    }
  `);

  // Бардык категориялар
  const categories = await client.fetch<{ slug: string; _updatedAt: string }[]>(groq`
    *[_type == "category"] {
      "slug": slug.current,
      _updatedAt
    }
  `);

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
    const date = post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : '';
    return {
      url: `${siteUrl}/news/${date}/${post.slug}`,
      lastModified: new Date(post._updatedAt || post.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    };
  });

  // Видео беттери
  const videoPages: MetadataRoute.Sitemap = videos.map((video) => ({
    url: `${siteUrl}/video/${video.slug}`,
    lastModified: new Date(video._updatedAt || video.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Категория беттери
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl}/category/${category.slug}`,
    lastModified: new Date(category._updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...postPages, ...videoPages, ...categoryPages];
}