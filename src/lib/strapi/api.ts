/**
 * Strapi API Functions
 * High-level data fetching functions for the news site
 */

import {
  strapiFetch,
  StrapiPost,
  StrapiCategory,
  StrapiVideo,
  StrapiAd,
} from './client';

// ===== POSTS =====

export async function getLatestPosts(limit = 20): Promise<StrapiPost[]> {
  const response = await strapiFetch<StrapiPost[]>('posts', {
    sort: ['publish:desc', 'createdAt:desc'],
    pagination: { limit },
    populate: ['mainImage', 'category'],
  }, { tags: ['posts'] });

  return response.data || [];
}

export async function getPostBySlug(slug: string): Promise<StrapiPost | null> {
  const response = await strapiFetch<StrapiPost[]>('posts', {
    filters: { slug: { $eq: slug } },
    populate: ['mainImage', 'category'],
  }, { tags: ['posts'] });

  return response.data?.[0] || null;
}

export async function getPostsByCategory(
  categorySlug: string,
  limit = 20,
  offset = 0
): Promise<StrapiPost[]> {
  const response = await strapiFetch<StrapiPost[]>('posts', {
    filters: {
      category: {
        slug: { $eq: categorySlug },
      },
    },
    sort: ['publish:desc', 'createdAt:desc'],
    pagination: { start: offset, limit },
    populate: ['mainImage', 'category'],
  }, { tags: ['posts', `category-${categorySlug}`] });

  return response.data || [];
}

export async function getRelatedPosts(
  categorySlug: string,
  excludeSlug: string,
  limit = 5
): Promise<StrapiPost[]> {
  const response = await strapiFetch<StrapiPost[]>('posts', {
    filters: {
      category: {
        slug: { $eq: categorySlug },
      },
      slug: { $ne: excludeSlug },
    },
    sort: ['publish:desc'],
    pagination: { limit },
    populate: ['mainImage', 'category'],
  }, { tags: ['posts'] });

  return response.data || [];
}

export async function searchPosts(query: string, limit = 20): Promise<StrapiPost[]> {
  const response = await strapiFetch<StrapiPost[]>('posts', {
    filters: {
      $or: [
        { title: { $containsi: query } },
        { excerpt: { $containsi: query } },
        { body: { $containsi: query } },
      ],
    },
    sort: ['publish:desc'],
    pagination: { limit },
    populate: ['mainImage', 'category'],
  }, { tags: ['posts'], revalidate: 60 });

  return response.data || [];
}

export async function getInteractiveHeroPosts(limit = 12): Promise<StrapiPost[]> {
  return getLatestPosts(limit);
}

// ===== CATEGORIES =====

export async function getAllCategories(): Promise<StrapiCategory[]> {
  const response = await strapiFetch<StrapiCategory[]>('categories', {
    sort: ['title:asc'],
  }, { tags: ['categories'] });

  return response.data || [];
}

export async function getCategoryBySlug(slug: string): Promise<StrapiCategory | null> {
  const response = await strapiFetch<StrapiCategory[]>('categories', {
    filters: { slug: { $eq: slug } },
  }, { tags: ['categories'] });

  return response.data?.[0] || null;
}

// ===== VIDEOS =====

export async function getYouTubeVideos(limit = 10): Promise<StrapiVideo[]> {
  const response = await strapiFetch<StrapiVideo[]>('videos', {
    filters: {
      $or: [
        { videoSource: { $eq: 'youtube' } },
        { youtubeUrl: { $notNull: true, $ne: '' } },
      ],
    },
    sort: ['publishedat:desc', 'createdAt:desc'],
    pagination: { limit },
    populate: ['thumbnail', 'category'],
  }, { tags: ['videos'] });

  return response.data || [];
}

export async function getInstagramVideos(limit = 10): Promise<StrapiVideo[]> {
  const response = await strapiFetch<StrapiVideo[]>('videos', {
    filters: {
      $or: [
        { videoSource: { $eq: 'instagram' } },
        { instagramUrl: { $notNull: true, $ne: '' } },
      ],
    },
    sort: ['publishedat:desc', 'createdAt:desc'],
    pagination: { limit },
    populate: ['thumbnail', 'category'],
  }, { tags: ['videos'] });

  return response.data || [];
}

export async function getTikTokVideos(limit = 10): Promise<StrapiVideo[]> {
  const response = await strapiFetch<StrapiVideo[]>('videos', {
    filters: {
      $or: [
        { videoSource: { $eq: 'tiktok' } },
        { tiktokUrl: { $notNull: true, $ne: '' } },
      ],
    },
    sort: ['publishedat:desc', 'createdAt:desc'],
    pagination: { limit },
    populate: ['thumbnail', 'category'],
  }, { tags: ['videos'] });

  return response.data || [];
}

export async function getVideosByCategory(
  categorySlug: string,
  limit = 10
): Promise<StrapiVideo[]> {
  const response = await strapiFetch<StrapiVideo[]>('videos', {
    filters: {
      category: {
        slug: { $eq: categorySlug },
      },
    },
    sort: ['publishedat:desc'],
    pagination: { limit },
    populate: ['thumbnail', 'category'],
  }, { tags: ['videos', `category-${categorySlug}`] });

  return response.data || [];
}

// ===== ADS =====

export async function getAdsByPlacement(placement: string): Promise<StrapiAd[]> {
  const response = await strapiFetch<StrapiAd[]>('ads', {
    filters: { placement: { $eq: placement } },
    populate: ['image'],
  }, { tags: ['ads'], revalidate: 60 });

  return response.data || [];
}

// ===== HOMEPAGE DATA =====

export interface HomePageData {
  latestPosts: StrapiPost[];
  youtubeVideos: StrapiVideo[];
  instagramVideos: StrapiVideo[];
  tiktokVideos: StrapiVideo[];
  interactiveHero: StrapiPost[];
  categories: StrapiCategory[];
}

export async function getHomePageData(): Promise<HomePageData> {
  const [
    latestPosts,
    youtubeVideos,
    instagramVideos,
    tiktokVideos,
    interactiveHero,
    categories,
  ] = await Promise.all([
    getLatestPosts(20),
    getYouTubeVideos(6),
    getInstagramVideos(6),
    getTikTokVideos(6),
    getInteractiveHeroPosts(12),
    getAllCategories(),
  ]);

  return {
    latestPosts,
    youtubeVideos,
    instagramVideos,
    tiktokVideos,
    interactiveHero,
    categories,
  };
}

// ===== CATEGORY PAGE DATA =====

export interface CategoryPageData {
  category: StrapiCategory | null;
  posts: StrapiPost[];
  youtubeVideos: StrapiVideo[];
  instagramVideos: StrapiVideo[];
}

export async function getCategoryPageData(
  categorySlug: string
): Promise<CategoryPageData> {
  const [category, posts, youtubeVideos, instagramVideos] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getPostsByCategory(categorySlug, 15),
    getVideosByCategory(categorySlug, 6),
    getVideosByCategory(categorySlug, 6),
  ]);

  return {
    category,
    posts,
    youtubeVideos,
    instagramVideos,
  };
}

// ===== ARTICLE PAGE DATA =====

export interface ArticlePageData {
  post: StrapiPost | null;
  relatedPosts: StrapiPost[];
  popularPosts: StrapiPost[];
}

export async function getArticlePageData(slug: string): Promise<ArticlePageData> {
  const post = await getPostBySlug(slug);

  if (!post) {
    return { post: null, relatedPosts: [], popularPosts: [] };
  }

  const categorySlug = post.category?.slug;

  const [relatedPosts, popularPosts] = await Promise.all([
    categorySlug ? getRelatedPosts(categorySlug, slug, 5) : Promise.resolve([]),
    getLatestPosts(5),
  ]);

  return {
    post,
    relatedPosts,
    popularPosts,
  };
}

// ===== SITEMAP DATA =====

export async function getSitemapData() {
  const [posts, videos, categories] = await Promise.all([
    strapiFetch<StrapiPost[]>('posts', {
      fields: ['slug', 'updatedAt', 'publish'],
      sort: ['publish:desc'],
      pagination: { limit: 10000 },
    }),
    strapiFetch<StrapiVideo[]>('videos', {
      fields: ['slug', 'updatedAt'],
      pagination: { limit: 1000 },
    }),
    strapiFetch<StrapiCategory[]>('categories', {
      fields: ['slug', 'updatedAt'],
    }),
  ]);

  return {
    posts: posts.data || [],
    videos: videos.data || [],
    categories: categories.data || [],
  };
}
