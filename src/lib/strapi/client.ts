/**
 * Strapi API Client
 * Replaces Sanity client for news site
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface StrapiPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  mainImage?: StrapiImage;
  mainImageAlt?: string;
  mainImageCaption?: string;
  category?: StrapiCategory;
  publish?: string;
  youtubeUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiCategory {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description?: string;
}

export interface StrapiVideo {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description?: string;
  videoSource?: 'youtube' | 'instagram' | 'tiktok';
  youtubeUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  thumbnail?: StrapiImage;
  duration?: string;
  category?: StrapiCategory;
  publishedat?: string;
}

export interface StrapiAd {
  id: number;
  documentId: string;
  title: string;
  placement?: 'header' | 'sidebar' | 'footer' | 'article';
  image?: StrapiImage[];
  imageAlt?: string;
  link?: string;
}

// Build query string from params
function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  function addParams(obj: Record<string, unknown>, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const paramKey = prefix ? `${prefix}[${key}]` : key;

      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          addParams(value as Record<string, unknown>, paramKey);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'object') {
              addParams(item as Record<string, unknown>, `${paramKey}[${index}]`);
            } else {
              searchParams.append(`${paramKey}[${index}]`, String(item));
            }
          });
        } else {
          searchParams.append(paramKey, String(value));
        }
      }
    }
  }

  addParams(params);
  return searchParams.toString();
}

// Main fetch function
export async function strapiFetch<T>(
  endpoint: string,
  params: Record<string, unknown> = {},
  options: {
    revalidate?: number;
    tags?: string[];
  } = {}
): Promise<StrapiResponse<T>> {
  const queryString = buildQueryString(params);
  const url = `${STRAPI_URL}/api/${endpoint}${queryString ? `?${queryString}` : ''}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  try {
    const res = await fetch(url, {
      headers,
      next: {
        revalidate: options.revalidate ?? 3600, // Default 1 hour
        tags: options.tags,
      },
    });

    if (!res.ok) {
      console.error(`Strapi fetch error: ${res.status} ${res.statusText}`);
      // Return empty data during build time if Strapi is not available
      return { data: [] as unknown as T, meta: {} };
    }

    return res.json();
  } catch (error) {
    console.error(`Strapi fetch error for ${endpoint}:`, error);
    // Return empty data to allow build to complete
    return { data: [] as unknown as T, meta: {} };
  }
}

// Get full image URL
export function getStrapiImageUrl(image?: StrapiImage | null, size?: 'thumbnail' | 'small' | 'medium' | 'large'): string {
  if (!image) return '/placeholder.jpg';

  let url = image.url;

  if (size && image.formats?.[size]) {
    url = image.formats[size]!.url;
  }

  // If URL is relative, prepend Strapi URL
  if (url.startsWith('/')) {
    return `${STRAPI_URL}${url}`;
  }

  return url;
}
