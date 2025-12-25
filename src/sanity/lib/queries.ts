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
    "category": categories[0]-> {
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
    "category": categories[0]->{ title, slug },
    author->{ name, image }
  }
`;

// YouTube видеолор
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
  *[_type == "post" && slug.current != $slug && $categorySlug in categories[]->slug.current] | order(publishedAt desc) [0...4] {
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
    "category": categories[0]->{ title, slug },
    author->{ name },
    "matchInTitle": title match $searchQuery
  } | order(matchInTitle desc, publishedAt desc)
`;

export const sportSectionQuery = `{
  // Banner үчүн акыркы спорт жаңылык
  "banner": *[_type == "post" && "sport" in categories[]->slug.current]
    | order(publishedAt desc) [0] {
    mainImage {
      asset -> { url }
    }
  },
  
  // Негизги жаңылык
  "mainNews": *[_type == "post" && "sport" in categories[]->slug.current]
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
  "sideNews": *[_type == "post" && "sport" in categories[]->slug.current]
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
    "slug": "sayasat",
    "mainNews": *[_type == "post" && "sayasat" in categories[]->slug.current]
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
    "links": *[_type == "post" && "sayasat" in categories[]->slug.current]
      | order(publishedAt desc) [1...6] {
      title,
      slug,
      publishedAt
    }
  },

  "society": {
    "title": "Коом",
    "slug": "koom",
    "mainNews": *[_type == "post" && "koom" in categories[]->slug.current]
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
    "links": *[_type == "post" && "koom" in categories[]->slug.current]
      | order(publishedAt desc) [1...6] {
      title,
      slug,
      publishedAt
    }
  },

  "economy": {
    "title": "Экономика",
    "slug": "ekonomika",
    "mainNews": *[_type == "post" && "ekonomika" in categories[]->slug.current]
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
    "links": *[_type == "post" && "ekonomika" in categories[]->slug.current]
      | order(publishedAt desc) [1...6] {
      title,
      slug,
      publishedAt
    }
  },

  "world": {
    "title": "Дүйнө",
    "slug": "d-in-l-k-zha-ylyktar",
    "mainNews": *[_type == "post" && "d-in-l-k-zha-ylyktar" in categories[]->slug.current]
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
    "links": *[_type == "post" && "d-in-l-k-zha-ylyktar" in categories[]->slug.current]
      | order(publishedAt desc) [1...6] {
      title,
      slug,
      publishedAt
    }
  }
}`;

export const categoryNewsGridQuery = `{
  "culture": {
    "title": "Маданият-шоу",
    "slug": "madaniyat-shou",
    "mainNews": *[_type == "post" && "madaniyat-shou" in categories[]->slug.current]
      | order(publishedAt desc) [0] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },
    "smallNews": *[_type == "post" && "madaniyat-shou" in categories[]->slug.current]
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
    "slug": "kylmysh-kyrsyk",
    "mainNews": *[_type == "post" && "kylmysh-kyrsyk" in categories[]->slug.current]
      | order(publishedAt desc) [0] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },
    "smallNews": *[_type == "post" && "kylmysh-kyrsyk" in categories[]->slug.current]
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

  "ilimBilim": {
    "title": "Илим-билим",
    "slug": "ilim-bilim",
    "mainNews": *[_type == "post" && "ilim-bilim" in categories[]->slug.current]
      | order(publishedAt desc) [0] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },
    "smallNews": *[_type == "post" && "ilim-bilim" in categories[]->slug.current]
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

  "sokoldunReportazhdary": {
    "title": "Соколдун репортаждары",
    "slug": "sokoldun-reportazhdary",
    "mainNews": *[_type == "post" && "sokoldun-reportazhdary" in categories[]->slug.current]
      | order(publishedAt desc) [0] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    },
    "smallNews": *[_type == "post" && "sokoldun-reportazhdary" in categories[]->slug.current]
      | order(publishedAt desc) [1...4] {
      title,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    }
  }
}`;

export const interactiveHeroQuery = `*[_type == "post"] | order(publishedAt desc) [0...12] {
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