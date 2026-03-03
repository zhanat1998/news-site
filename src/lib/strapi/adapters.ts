/**
 * Data Adapters
 * Transform Strapi data to match existing component props
 * This allows us to use Strapi without changing all components
 */

import { StrapiPost, StrapiVideo, StrapiCategory, getStrapiImageUrl } from './client';

/**
 * Format body content from Strapi richtext
 * Converts plain text with line breaks to proper HTML
 */
function formatBody(body: string | undefined): string {
  if (!body) return '';

  // If already contains HTML tags, return as is
  if (body.includes('<p>') || body.includes('<h1>') || body.includes('<h2>') || body.includes('<div>')) {
    return body;
  }

  // Split by double line breaks (paragraphs)
  const paragraphs = body.split(/\n\n+/);

  const formatted = paragraphs.map(p => {
    // Trim whitespace
    let text = p.trim();
    if (!text) return '';

    // Convert markdown headings
    // ## Heading -> <h2>
    if (text.startsWith('## ')) {
      return `<h3>${text.slice(3)}</h3>`;
    }
    // # Heading -> <h2>
    if (text.startsWith('# ')) {
      return `<h2>${text.slice(2)}</h2>`;
    }
    // #Heading (no space) -> <h2>
    if (text.startsWith('#') && !text.startsWith('##')) {
      const headingText = text.slice(1).trim();
      if (headingText) {
        return `<h2>${headingText}</h2>`;
      }
    }

    // Convert single line breaks to <br> within paragraphs
    text = text.replace(/\n/g, '<br>');

    // Wrap in paragraph tag
    return `<p>${text}</p>`;
  }).filter(Boolean);

  return formatted.join('\n');
}

// Post adapter - converts Strapi post to Sanity-like format
export function adaptPost(post: StrapiPost) {
  const imageUrl = getStrapiImageUrl(post.mainImage);

  return {
    _id: post.documentId,
    title: post.title,
    slug: { current: post.slug },
    excerpt: post.excerpt || '',
    publishedAt: post.publish || post.publishedAt,
    mainImage: post.mainImage ? {
      asset: {
        url: imageUrl,
        _ref: post.mainImage.id?.toString(),
      },
      alt: post.mainImageAlt || '',
      caption: post.mainImageCaption || '',
    } : undefined,
    category: post.category ? {
      _id: post.category.documentId,
      title: post.category.title,
      slug: { current: post.category.slug },
    } : undefined,
    // Format body: convert line breaks to paragraphs, markdown to HTML
    body: formatBody(post.body),
    youtubeUrl: post.youtubeUrl || null,
  };
}

export function adaptPosts(posts: StrapiPost[]) {
  return posts.map(adaptPost);
}

// Video adapter - converts Strapi video to Sanity-like format
export function adaptVideo(video: StrapiVideo) {
  const thumbnailUrl = getStrapiImageUrl(video.thumbnail);

  return {
    _id: video.documentId,
    title: video.title,
    slug: video.slug,
    description: video.description || '',
    videoSource: video.videoSource ||
      (video.youtubeUrl ? 'youtube' : video.instagramUrl ? 'instagram' : video.tiktokUrl ? 'tiktok' : null),
    youtubeUrl: video.youtubeUrl || '',
    instagramUrl: video.instagramUrl || '',
    tiktokUrl: video.tiktokUrl || '',
    thumbnail: video.thumbnail ? {
      asset: {
        url: thumbnailUrl,
        _ref: video.thumbnail.id?.toString(),
      },
    } : undefined,
    duration: video.duration || '',
    category: video.category ? {
      title: video.category.title,
    } : undefined,
    publishedAt: video.publishedat || (video as any).publishedAt,
  };
}

export function adaptVideos(videos: StrapiVideo[]) {
  return videos.map(adaptVideo);
}

// Category adapter
export function adaptCategory(category: StrapiCategory) {
  return {
    _id: category.documentId,
    title: category.title,
    slug: category.slug,
    description: category.description || '',
  };
}

export function adaptCategories(categories: StrapiCategory[]) {
  return categories.map(adaptCategory);
}

// Format videos for VideoCarousel component
export function formatVideosForCarousel(videos: StrapiVideo[]) {
  return videos.map(video => ({
    _id: video.documentId,
    title: video.title,
    slug: video.slug,
    image: getStrapiImageUrl(video.thumbnail) || '/og-image.png',
    excerpt: video.description || '',
    category: video.category ? { title: video.category.title } : undefined,
    duration: video.duration || '',
    thumbnail: video.thumbnail ? {
      asset: {
        url: getStrapiImageUrl(video.thumbnail),
      },
    } : null,
  }));
}

// Create category columns data structure (for CategoryColumns component)
export async function createCategoryColumnsData(
  getPosts: (categorySlug: string, limit: number) => Promise<StrapiPost[]>,
  categories: StrapiCategory[]
): Promise<Record<string, { title: string; slug: string; posts: any[] }>> {
  const result: Record<string, { title: string; slug: string; posts: any[] }> = {};

  // Get first 4 categories for columns
  const columnCategories = categories.slice(0, 4);

  for (const category of columnCategories) {
    const posts = await getPosts(category.slug, 5);
    result[category.slug] = {
      title: category.title,
      slug: category.slug,
      posts: adaptPosts(posts),
    };
  }

  return result;
}

// Create category columns data for CategoryColumns component
export interface CategoryColumnData {
  title: string;
  slug: string;
  mainNews: any | null;
  links: any[];
}

export async function fetchCategoryColumnsData(
  fetchPostsByCategory: (categorySlug: string, limit: number) => Promise<StrapiPost[]>
): Promise<Record<string, CategoryColumnData>> {
  const categories = [
    { key: 'politics', title: 'Саясат', slug: 'sayasat' },
    { key: 'society', title: 'Коом', slug: 'koom' },
    { key: 'economy', title: 'Экономика', slug: 'ekonomika' },
    { key: 'world', title: 'Дүйнө', slug: 'd-in-l-k-zha-ylyktar' },
  ];

  const result: Record<string, CategoryColumnData> = {};

  await Promise.all(
    categories.map(async ({ key, title, slug }) => {
      const posts = await fetchPostsByCategory(slug, 6);
      const adapted = adaptPosts(posts);

      result[key] = {
        title,
        slug,
        mainNews: adapted[0] || null,
        links: adapted.slice(1, 6),
      };
    })
  );

  return result;
}

// Create category news grid data for CategoryNewsGrid component
export interface CategoryGridData {
  title: string;
  slug: string;
  mainNews: any | null;
  smallNews: any[];
}

export async function fetchCategoryNewsGridData(
  fetchPostsByCategory: (categorySlug: string, limit: number) => Promise<StrapiPost[]>
): Promise<Record<string, CategoryGridData>> {
  const categories = [
    { key: 'culture', title: 'Маданият-шоу', slug: 'madaniyat-shou' },
    { key: 'crime', title: 'Кылмыш-кырсык', slug: 'kylmysh-kyrsyk' },
    { key: 'ilimBilim', title: 'Илим-билим', slug: 'ilim-bilim' },
    { key: 'sokoldunReportazhdary', title: 'Соколдун репортаждары', slug: 'sokoldun-reportazhdary' },
  ];

  const result: Record<string, CategoryGridData> = {};

  await Promise.all(
    categories.map(async ({ key, title, slug }) => {
      const posts = await fetchPostsByCategory(slug, 5);
      const adapted = adaptPosts(posts);

      result[key] = {
        title,
        slug,
        mainNews: adapted[0] || null,
        smallNews: adapted.slice(1, 5),
      };
    })
  );

  return result;
}
