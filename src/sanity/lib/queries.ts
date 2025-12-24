// src/sanity/lib/queries.ts
import { groq } from 'next-sanity'

// Бардык посттор (жаңыдан эскиге)
export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    section,
    body,
    mainImage {
      asset->,
      alt,
      caption
    },
    author-> {
      name,
      image { asset-> }
    },
    category-> {
      title,
      slug
    }
  }
`;

// Breaking news
export const breakingNewsQuery = groq`
  *[_type == "post" && isBreaking == true] | order(coalesce(publishedAt, _createdAt) desc) [0...5] {
    _id,
    title,
    slug,
    publishedAt
  }
`;


// Акыркы посттор (лимит менен)
export const latestPostsQuery = groq`
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

// Видеолор (YouTube гана - Bunny жок)
export const videosQuery = groq`
  *[_type == "video" && videoSource == "youtube"] | order(publishedAt desc) [0...20] {
    _id,
    title,
    "slug": slug.current,
    description,
    videoSource,
    youtubeUrl,
    duration,
    thumbnail { asset->, alt },
    category->{ title },
    publishedAt
  }
`;

// Instagram видеолор (өзүнчө carousel үчүн)
export const instagramVideosQuery = groq`
  *[_type == "video" && videoSource == "instagram"] | order(publishedAt desc) [0...20] {
    _id,
    title,
    "slug": slug.current,
    description,
    instagramUrl,
    duration,
    thumbnail { asset->, alt },
    category->{ title },
    publishedAt
  }
`;

// TikTok видеолор (өзүнчө carousel үчүн)
export const tiktokVideosQuery = groq`
  *[_type == "video" && videoSource == "tiktok"] | order(publishedAt desc) [0...20] {
    _id,
    title,
    "slug": slug.current,
    description,
    tiktokUrl,
    duration,
    thumbnail { asset->, alt },
    category->{ title },
    publishedAt
  }
`;

export const relatedPostsQuery = groq`
  *[_type == "post" && slug.current != $slug && category->slug.current == $categorySlug] | order(publishedAt desc) [0...4] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    publishedAt,
    mainImage { asset->, alt }
  }
`;

export const moreNewsQuery = groq`
  *[_type == "post" && slug.current != $slug] | order(publishedAt desc) [0...4] {
    _id,
    title,
    slug,
    publishedAt,
    mainImage { asset->, alt }
  }
`;

// src/sanity/lib/queries.ts
export const searchPostsQuery = groq`
  *[_type == "post" && (
    title match $searchQuery ||
    excerpt match $searchQuery ||
    pt::text(body) match $searchQuery
  )] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage { asset->, alt },
    category->{ title, slug },
    author->{ name },
    "matchInTitle": title match $searchQuery
  } | order(matchInTitle desc, publishedAt desc)
`;

export const sportSectionQuery = `{
  // Banner үчүн акыркы спорт жаңылык
  "banner": *[_type == "post" && references(*[_type == "category" && slug.current == "Sport"]._id)]
    | order(publishedAt desc) [0] {
    mainImage {
      asset -> { url }
    }
  },
  
  // Негизги жаңылык
  "mainNews": *[_type == "post" && references(*[_type == "category" && slug.current == "Sport"]._id)]
    | order(publishedAt desc) [0] {
    title,
    excerpt,
    slug,
    mainImage {
      asset -> { url },
      alt
    },
    publishedAt,
    section
  },
  
  // Капталдагы жаңылыктар (2-4)
  "sideNews": *[_type == "post" && references(*[_type == "category" && slug.current == "Sport"]._id)]
    | order(publishedAt desc) [1...4] {
    title,
    slug,
    mainImage {
      asset -> { url },
      alt
    },
    publishedAt
  }
}`;

export const categoryColumnsQuery = `{
  "politics": {
    "title": "Саясат",
    "slug": "wp-2",
    "mainNews": *[_type == "post" && references(*[_type == "category" && _id == "category-wp-2"]._id)]
      | order(publishedAt desc) [0] {
      title,
      excerpt,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },
    "links": *[_type == "post" && references(*[_type == "category" && _id == "category-wp-2"]._id)]
      | order(publishedAt desc) [1...6] {
      title,
      slug,
      publishedAt
    }
  },
  
  "society": {
    "title": "Коом",
    "slug": "wp-4",
    "mainNews": *[_type == "post" && references(*[_type == "category" && _id == "category-wp-4"]._id)]
      | order(publishedAt desc) [0] {
      title,
      excerpt,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },
    "links": *[_type == "post" && references(*[_type == "category" && _id == "category-wp-4"]._id)]
      | order(publishedAt desc) [1...6] {
      title,
      slug,
      publishedAt
    }
  },
  
  "economy": {
    "title": "Экономика",
    "slug": "wp-10",
    "mainNews": *[_type == "post" && references(*[_type == "category" && _id == "category-wp-10"]._id)]
      | order(publishedAt desc) [0] {
      title,
      excerpt,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },
    "links": *[_type == "post" && references(*[_type == "category" && _id == "category-wp-10"]._id)]
      | order(publishedAt desc) [1...6] {
      title,
      slug,
      publishedAt
    }
  },
  
  "world": {
    "title": "Дүйнө",
    "slug": "wp-30",
    "mainNews": *[_type == "post" && references(*[_type == "category" && _id == "category-wp-30"]._id)]
      | order(publishedAt desc) [0] {
      title,
      excerpt,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },
    "links": *[_type == "post" && references(*[_type == "category" && _id == "category-wp-30"]._id)]
      | order(publishedAt desc) [1...6] {
      title,
      slug,
      publishedAt
    }
  }
}`;

export const categoryNewsGridQuery = `{
  "culture": {
    "title": "Маданият",
    "slug": "wp-3",
    "mainNews": *[_type == "post" && references(*[_type == "category" && _id == "category-wp-3"]._id)]
      | order(publishedAt desc) [0] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },
    "smallNews": *[_type == "post" && references(*[_type == "category" && _id == "category-wp-3"]._id)]
      | order(publishedAt desc) [1...4] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    }
  },
  
  "crime": {
    "title": "Кылмыш-кырсык",
    "slug": "wp-5",
    "mainNews": *[_type == "post" && references(*[_type == "category" && _id == "category-wp-5"]._id)]
      | order(publishedAt desc) [0] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },
    "smallNews": *[_type == "post" && references(*[_type == "category" && _id == "category-wp-5"]._id)]
      | order(publishedAt desc) [1...4] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    }
  },
  
  "sport": {
    "title": "Спорт",
    "slug": "wp-7",
    "mainNews": *[_type == "post" && references(*[_type == "category" && _id == "category-wp-7"]._id)]
      | order(publishedAt desc) [0] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },
    "smallNews": *[_type == "post" && references(*[_type == "category" && _id == "category-wp-7"]._id)]
      | order(publishedAt desc) [1...4] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    }
  },
  
  "video": {
    "title": "Видео",
    "slug": "video",
    "mainVideo": *[_type == "video"] | order(publishedAt desc) [0] {
      title,
      slug,
      thumbnail {
        asset -> { url }
      },
      videoSource,
      youtubeUrl,
      bunnyVideoId,
      duration,
      publishedAt
    },
    "smallVideos": *[_type == "video"] | order(publishedAt desc) [1...4] {
      title,
      slug,
      thumbnail {
        asset -> { url }
      },
      videoSource,
      youtubeUrl,
      bunnyVideoId,
      duration,
      publishedAt
    }
  }
}`;

export const interactiveHeroQuery = `*[_type == "post"] 
  | order(publishedAt desc) [0...12] {
  _id,
  title,
  slug,
  mainImage {
    asset -> { url },
    alt
  },
  publishedAt,
  categories[]-> {
    title
  }
}`;
