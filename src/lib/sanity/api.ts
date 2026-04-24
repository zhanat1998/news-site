/**
 * Sanity API Functions
 * Drop-in replacement for @/lib/strapi/api
 * Same function signatures, fetches from Sanity instead of Strapi
 */

import { sanityFetch } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

// ===== SHARED FIELD FRAGMENTS =====

const POST_FIELDS = groq`
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  section,
  isFeatured,
  isBreaking,
  youtubeUrl,
  mainImage {
    asset->{ url, _id },
    alt,
    caption
  },
  "category": categories[0]->{ title, slug },
  body
`;

const POST_LIST_FIELDS = groq`
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  section,
  isFeatured,
  isBreaking,
  mainImage {
    asset->{ url, _id },
    alt
  },
  "category": categories[0]->{ title, slug }
`;

const VIDEO_FIELDS = groq`
  _id,
  title,
  "slug": slug.current,
  description,
  videoSource,
  youtubeUrl,
  instagramUrl,
  tiktokUrl,
  duration,
  thumbnail { asset->{ url }, alt },
  "category": category->{ title, slug }
`;

// ===== POSTS =====

export async function getLatestPosts(limit = 20) {
  return sanityFetch<any[]>({
    query: groq`*[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc) [0...$limit] {
      ${POST_LIST_FIELDS}
    }`,
    params: { limit: limit - 1 },
    tags: ['posts'],
  });
}

export async function getPostBySlug(slug: string) {
  return sanityFetch<any>({
    query: groq`*[_type == "post" && slug.current == $slug][0] {
      ${POST_FIELDS}
    }`,
    params: { slug },
    tags: ['posts'],
  });
}

export async function getPostsByCategory(
  categorySlug: string,
  limit = 20,
  offset = 0
) {
  return sanityFetch<any[]>({
    query: groq`*[_type == "post" && $categorySlug in categories[]->slug.current]
      | order(coalesce(publishedAt, _createdAt) desc) [$offset...$end] {
      ${POST_LIST_FIELDS}
    }`,
    params: { categorySlug, offset, end: offset + limit },
    tags: ['posts', `category-${categorySlug}`],
  });
}

export async function getRelatedPosts(
  categorySlug: string,
  excludeSlug: string,
  limit = 5
) {
  return sanityFetch<any[]>({
    query: groq`*[_type == "post" && slug.current != $excludeSlug && $categorySlug in categories[]->slug.current]
      | order(coalesce(publishedAt, _createdAt) desc) [0...$limit] {
      ${POST_LIST_FIELDS}
    }`,
    params: { categorySlug, excludeSlug, limit: limit - 1 },
    tags: ['posts'],
  });
}

export async function searchPosts(query: string, limit = 20) {
  return sanityFetch<any[]>({
    query: groq`*[_type == "post" && (
      title match $searchQuery ||
      excerpt match $searchQuery ||
      pt::text(body) match $searchQuery
    )] | order(coalesce(publishedAt, _createdAt) desc) [0...$limit] {
      ${POST_LIST_FIELDS}
    }`,
    params: { searchQuery: `${query}*`, limit: limit - 1 },
    tags: ['posts'],
    revalidate: 60,
  });
}

export async function getInteractiveHeroPosts(limit = 12) {
  return getLatestPosts(limit);
}

// ===== CATEGORIES =====

export async function getAllCategories() {
  return sanityFetch<any[]>({
    query: groq`*[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      color
    }`,
    tags: ['categories'],
  });
}

export async function getCategoryBySlug(slug: string) {
  return sanityFetch<any>({
    query: groq`*[_type == "category" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description
    }`,
    params: { slug },
    tags: ['categories'],
  });
}

// ===== VIDEOS =====

export async function getYouTubeVideos(limit = 10) {
  return sanityFetch<any[]>({
    query: groq`*[_type == "video" && videoSource == "youtube"]
      | order(coalesce(publishedAt, _createdAt) desc) [0...$limit] {
      ${VIDEO_FIELDS}
    }`,
    params: { limit: limit - 1 },
    tags: ['videos'],
    revalidate: 60,
  });
}

export async function getInstagramVideos(limit = 10) {
  return sanityFetch<any[]>({
    query: groq`*[_type == "video" && videoSource == "instagram"]
      | order(coalesce(publishedAt, _createdAt) desc) [0...$limit] {
      ${VIDEO_FIELDS}
    }`,
    params: { limit: limit - 1 },
    tags: ['videos'],
    revalidate: 60,
  });
}

export async function getTikTokVideos(limit = 10) {
  return sanityFetch<any[]>({
    query: groq`*[_type == "video" && videoSource == "tiktok"]
      | order(coalesce(publishedAt, _createdAt) desc) [0...$limit] {
      ${VIDEO_FIELDS}
    }`,
    params: { limit: limit - 1 },
    tags: ['videos'],
  });
}

export async function getVideosByCategory(categorySlug: string, limit = 10) {
  return sanityFetch<any[]>({
    query: groq`*[_type == "video" && category->slug.current == $categorySlug]
      | order(coalesce(publishedAt, _createdAt) desc) [0...$limit] {
      ${VIDEO_FIELDS}
    }`,
    params: { categorySlug, limit: limit - 1 },
    tags: ['videos', `category-${categorySlug}`],
  });
}

// ===== ADS =====

export async function getAdsByPlacement(placement: string) {
  // Map frontend placement names to Sanity placement values
  const placementMap: Record<string, string> = {
    'header': 'home_top',
    'sidebar': 'home_middle',
    'footer': 'home_bottom',
    'article': 'category_page',
  };
  const sanityPlacement = placementMap[placement] || placement;

  return sanityFetch<any[]>({
    query: groq`*[_type == "ad" && placement == $placement] {
      _id,
      title,
      placement,
      link,
      imageAlt,
      image { asset->{ url } }
    }`,
    params: { placement: sanityPlacement },
    tags: ['ads'],
    revalidate: 60,
  });
}

// ===== SITEMAP =====

export async function getSitemapData() {
  const [posts, videos, categories] = await Promise.all([
    sanityFetch<any[]>({
      query: groq`*[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc) {
        "slug": slug.current,
        publishedAt,
        _updatedAt
      }`,
      tags: ['posts'],
    }),
    sanityFetch<any[]>({
      query: groq`*[_type == "video"] {
        "slug": slug.current,
        publishedAt,
        _updatedAt
      }`,
      tags: ['videos'],
    }),
    sanityFetch<any[]>({
      query: groq`*[_type == "category"] {
        "slug": slug.current,
        _updatedAt
      }`,
      tags: ['categories'],
    }),
  ]);

  return { posts, videos, categories };
}

// ===== HOMEPAGE DATA =====

export async function fetchCategoryColumnsData(
  _getPostsByCategory: (slug: string, limit: number) => Promise<any[]>
) {
  const categories = [
    { slug: 'sayasat', title: 'Саясат' },
    { slug: 'koom', title: 'Коом' },
    { slug: 'ekonomika', title: 'Экономика' },
    { slug: 'd-in-l-k-zha-ylyktar', title: 'Дүйнө' },
  ];

  const results = await Promise.all(
    categories.map(async (cat) => {
      const posts = await _getPostsByCategory(cat.slug, 7);
      return {
        title: cat.title,
        slug: cat.slug,
        mainNews: posts[0] || null,
        links: posts.slice(1, 7),
      };
    })
  );

  return {
    politics: results[0],
    society: results[1],
    economy: results[2],
    world: results[3],
  };
}

export async function fetchCategoryNewsGridData(
  _getPostsByCategory: (slug: string, limit: number) => Promise<any[]>
) {
  const categories = [
    { slug: 'madaniyat-shou', title: 'Маданият-шоу', key: 'culture' },
    { slug: 'kylmysh-kyrsyk', title: 'Кылмыш-кырсык', key: 'crime' },
    { slug: 'ilim-bilim', title: 'Илим-билим', key: 'ilimBilim' },
    { slug: 'sokoldun-reportazhdary', title: 'Соколдун репортаждары', key: 'sokoldunReportazhdary' },
  ];

  const results = await Promise.all(
    categories.map(async (cat) => {
      const posts = await _getPostsByCategory(cat.slug, 5);
      return [cat.key, {
        title: cat.title,
        slug: cat.slug,
        mainNews: posts[0] || null,
        smallNews: posts.slice(1, 5),
      }];
    })
  );

  return Object.fromEntries(results);
}
