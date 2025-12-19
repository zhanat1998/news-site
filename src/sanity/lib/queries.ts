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


// Секция боюнча посттор
export const postsBySectionQuery = groq`
  *[_type == "post" && section == $section] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage {
      asset->,
      alt
    },
    category->{
      title,
      slug
    },
    author->{
      name,
      image
    }
  }
`

// Breaking news
export const breakingNewsQuery = groq`
  *[_type == "post" && isBreaking == true] | order(coalesce(publishedAt, _createdAt) desc) [0...5] {
    _id,
    title,
    slug,
    publishedAt
  }
`;


// Hero посттор (башкы бет үчүн)
export const heroPostsQuery = groq`
  *[_type == "post" && section == "hero"] | order(publishedAt desc) [0...10] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage {
      asset->,
      alt
    },
    category->{
      title,
      slug
    }
  }
`

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

// Бир пост (slug боюнча)
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    summary,
    publishedAt,
    body,
    mainImage {
      asset->,
      alt,
      caption
    },
    category->{
      _id,
      title,
      slug
    },
    author->{
      _id,
      name,
      image,
      bio
    },
    "relatedPosts": *[_type == "post" && category._ref == ^.category._ref && _id != ^._id] | order(publishedAt desc) [0...4] {
      _id,
      title,
      slug,
      publishedAt,
      mainImage {
        asset->,
        alt
      }
    }
  }
`

// Категориялар
export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`

// Видеолор
export const videosQuery = groq`
  *[_type == "video"] | order(publishedAt desc) [0...10] {
    _id,
    title,
    "slug": slug.current,
    description,
    bunnyVideoId,
    duration,
    thumbnail { asset->, alt },
    category->{ title }
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
