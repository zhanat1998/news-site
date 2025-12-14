// src/sanity/lib/queries.ts
import { groq } from 'next-sanity'

// Бардык посттор (жаңыдан эскиге)
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    section,
    isBreaking,
    isFeatured,
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
      image
    }
  }
`

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
  *[_type == "post" && isBreaking == true] | order(publishedAt desc) [0...5] {
    _id,
    title,
    slug
  }
`

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
  *[_type == "post"] | order(publishedAt desc) [0...$limit] {
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
    slug,
    description,
    youtubeUrl,
    thumbnail,
    duration,
    publishedAt
  }
`