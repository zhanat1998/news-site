/**
 * Sanity Data Adapters
 * Drop-in replacement for @/lib/strapi/adapters
 * Converts Sanity data to the format components expect
 */

import { toHTML } from '@portabletext/to-html';

// Convert Sanity Portable Text body to HTML string
function formatBody(body: any): string {
  if (!body) return '';
  if (typeof body === 'string') return body;

  try {
    return toHTML(body, {
      components: {
        types: {
          image: ({ value }: any) => {
            const url = value?.asset?.url || '';
            const alt = value?.alt || '';
            const caption = value?.caption || '';
            return `<figure class="body-image">
              <img src="${url}" alt="${alt}" loading="lazy" />
              ${caption ? `<figcaption>${caption}</figcaption>` : ''}
            </figure>`;
          },
          youtube: ({ value }: any) => {
            if (!value?.url) return '';
            return `<div class="youtube-embed"><iframe src="${value.url}" frameborder="0" allowfullscreen></iframe></div>`;
          },
        },
        marks: {
          link: ({ children, value }: any) => {
            const href = value?.href || '#';
            const isExternal = href.startsWith('http');
            return `<a href="${href}"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}>${children}</a>`;
          },
        },
      },
    });
  } catch {
    return '';
  }
}

// Get image URL from Sanity asset
function getImageUrl(image: any): string {
  return image?.asset?.url || '/placeholder.jpg';
}

// Decode HTML entities in text (e.g. &#171; → «, &#187; → »)
function decodeHtmlEntities(text: string): string {
  if (!text) return text;
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

// Adapt a single post from Sanity format to component format
export function adaptPost(post: any) {
  if (!post) return null;

  const imageUrl = getImageUrl(post.mainImage);

  return {
    _id: post._id,
    title: decodeHtmlEntities(post.title),
    slug: post.slug, // already { current: "..." }
    excerpt: decodeHtmlEntities(post.excerpt || ''),
    publishedAt: post.publishedAt,
    section: post.section,
    isFeatured: post.isFeatured,
    isBreaking: post.isBreaking,
    youtubeUrl: post.youtubeUrl || null,
    mainImage: post.mainImage ? {
      asset: {
        url: imageUrl,
        _id: post.mainImage.asset?._id,
      },
      alt: post.mainImage.alt || '',
      caption: post.mainImage.caption || '',
    } : undefined,
    category: post.category ? {
      title: post.category.title,
      slug: post.category.slug, // already { current: "..." }
    } : undefined,
    body: formatBody(post.body),
  };
}

export function adaptPosts(posts: any[]) {
  if (!posts) return [];
  return posts.map(adaptPost).filter(Boolean);
}

// Adapt a single video from Sanity format to component format
export function adaptVideo(video: any) {
  if (!video) return null;

  const thumbnailUrl = getImageUrl(video.thumbnail);

  return {
    _id: video._id,
    title: decodeHtmlEntities(video.title),
    slug: video.slug, // already a string from query "slug": slug.current
    description: decodeHtmlEntities(video.description || ''),
    videoSource: video.videoSource || null,
    youtubeUrl: video.youtubeUrl || '',
    instagramUrl: video.instagramUrl || '',
    tiktokUrl: video.tiktokUrl || '',
    thumbnail: video.thumbnail ? {
      asset: { url: thumbnailUrl },
    } : undefined,
    duration: video.duration || '',
    category: video.category ? {
      title: video.category.title,
    } : undefined,
    publishedAt: video.publishedAt,
  };
}

export function adaptVideos(videos: any[]) {
  if (!videos) return [];
  return videos.map(adaptVideo).filter(Boolean);
}

// Adapt category
export function adaptCategory(category: any) {
  if (!category) return null;
  return {
    _id: category._id,
    title: category.title,
    slug: typeof category.slug === 'string' ? category.slug : category.slug?.current,
    description: category.description || '',
  };
}

export function adaptCategories(categories: any[]) {
  if (!categories) return [];
  return categories.map(adaptCategory).filter(Boolean);
}

// Format videos for VideoCarousel component
export function formatVideosForCarousel(videos: any[]) {
  if (!videos) return [];
  return videos.map(video => ({
    _id: video._id,
    title: decodeHtmlEntities(video.title),
    slug: video.slug,
    image: getImageUrl(video.thumbnail) || '/og-image.png',
    excerpt: decodeHtmlEntities(video.description || ''),
    category: video.category ? { title: video.category.title } : undefined,
    duration: video.duration || '',
    thumbnail: video.thumbnail ? {
      asset: { url: getImageUrl(video.thumbnail) },
    } : null,
  }));
}

// getStrapiImageUrl replacement for AdBanner (returns URL from Sanity ad image)
export function getAdImageUrl(ad: any): string {
  return ad?.image?.asset?.url || '/placeholder.jpg';
}

// fetchCategoryColumnsData and fetchCategoryNewsGridData re-exports
export { fetchCategoryColumnsData, fetchCategoryNewsGridData } from './api';
