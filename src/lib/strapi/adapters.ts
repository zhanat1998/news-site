/**
 * Data Adapters
 * Transform Strapi data to match existing component props
 * This allows us to use Strapi without changing all components
 */

import { StrapiPost, StrapiVideo, StrapiCategory, getStrapiImageUrl } from './client';

/**
 * Convert markdown images to HTML img tags
 * ![alt text](url) -> <figure><img src="url" alt="alt text" /></figure>
 */
function convertMarkdownImages(text: string): string {
  // Match markdown image syntax: ![alt](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

  return text.replace(imageRegex, (_match, alt, url) => {
    return `<figure class="body-image"><img src="${url}" alt="${alt || ''}" loading="lazy" />${alt ? `<figcaption>${alt}</figcaption>` : ''}</figure>`;
  });
}

/**
 * Convert markdown links to HTML anchor tags
 * [text](url) -> <a href="url">text</a>
 */
function convertMarkdownLinks(text: string): string {
  // Match markdown link syntax: [text](url) but not images
  const linkRegex = /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g;

  return text.replace(linkRegex, (_match, linkText, url) => {
    const isExternal = url.startsWith('http');
    return `<a href="${url}"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}>${linkText}</a>`;
  });
}

/**
 * Convert markdown formatting to HTML
 * **bold** -> <strong>bold</strong>
 * *italic* -> <em>italic</em>
 * ~~strikethrough~~ -> <del>strikethrough</del>
 */
function convertMarkdownFormatting(text: string): string {
  // Bold: **text** only (not __text__ - underscores break URLs)
  let result = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic: *text* only (not _text_ - underscores break URLs)
  result = result.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

  // Strikethrough: ~~text~~
  result = result.replace(/~~([^~]+)~~/g, '<del>$1</del>');

  return result;
}

/**
 * Convert markdown lists to HTML
 * - item -> <ul><li>item</li></ul>
 */
function convertMarkdownLists(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isListItem = line.trimStart().startsWith('- ');

    if (isListItem) {
      if (!inList) {
        result.push('<ul class="body-list">');
        inList = true;
      }
      // Remove the "- " prefix and wrap in <li>
      const content = line.replace(/^\s*- /, '');
      result.push(`<li>${content}</li>`);
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push(line);
    }
  }

  // Close list if still open at end
  if (inList) {
    result.push('</ul>');
  }

  return result.join('\n');
}

/**
 * Convert markdown headings to HTML
 * # -> h1, ## -> h2, ### -> h3, #### -> h4, ##### -> h5
 */
function convertMarkdownHeadings(text: string): string {
  // Process line by line for headings
  const lines = text.split('\n');

  return lines.map(line => {
    const trimmed = line.trim();

    // ##### Heading 5
    if (trimmed.startsWith('##### ')) {
      return `<h5>${trimmed.slice(6)}</h5>`;
    }
    // #### Heading 4
    if (trimmed.startsWith('#### ')) {
      return `<h4>${trimmed.slice(5)}</h4>`;
    }
    // ### Heading 3
    if (trimmed.startsWith('### ')) {
      return `<h3>${trimmed.slice(4)}</h3>`;
    }
    // ## Heading 2
    if (trimmed.startsWith('## ')) {
      return `<h2>${trimmed.slice(3)}</h2>`;
    }
    // # Heading 1
    if (trimmed.startsWith('# ')) {
      return `<h1>${trimmed.slice(2)}</h1>`;
    }

    return line;
  }).join('\n');
}

/**
 * Format body content from Strapi richtext
 * Converts plain text with line breaks to proper HTML
 */
function formatBody(body: string | undefined): string {
  if (!body) return '';

  // First, convert markdown images throughout the entire body
  let processedBody = convertMarkdownImages(body);

  // Convert markdown links
  processedBody = convertMarkdownLinks(processedBody);

  // Convert markdown formatting (bold, italic, strikethrough)
  processedBody = convertMarkdownFormatting(processedBody);

  // Convert markdown headings (# h1, ## h2, ### h3, etc.)
  processedBody = convertMarkdownHeadings(processedBody);

  // Convert markdown lists (- item -> • item)
  processedBody = convertMarkdownLists(processedBody);

  // If already contains HTML tags (like <p>, <h1>, etc.), just return with image conversion
  if (processedBody.includes('<p>') || processedBody.includes('<h1>') || processedBody.includes('<h2>') || processedBody.includes('<div>')) {
    return processedBody;
  }

  // Split by double line breaks (paragraphs)
  const paragraphs = processedBody.split(/\n\n+/);

  const formatted = paragraphs.map(p => {
    // Trim whitespace
    let text = p.trim();
    if (!text) return '';

    // If this paragraph is just a figure (image) or heading, return as-is
    if (text.startsWith('<figure') || text.startsWith('<h1') || text.startsWith('<h2') || text.startsWith('<h3') || text.startsWith('<h4') || text.startsWith('<h5')) {
      return text;
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
