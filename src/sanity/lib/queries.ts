// sanity/lib/queries.ts
import { groq } from 'next-sanity'

// Шашылыш кабарлар (Breaking News)
export const breakingNewsQuery = groq`
  *[_type == "post" && isBreaking == true] | order(publishedAt desc)[0...5] {
    _id,
    title,
    "slug": slug.current,
    publishedAt
  }
`

// Башкы бет үчүн Hero посттор
export const heroPostsQuery = groq`
  *[_type == "post" && section == "hero"] | order(publishedAt desc)[0...5] {
    _id,
    title,
    excerpt,
    "slug": slug.current,
    mainImage,
    publishedAt,
    "category": category->title,
    "categorySlug": category->slug.current
  }
`

// Бардык посттор
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    excerpt,
    "slug": slug.current,
    mainImage,
    publishedAt,
    "author": author->name,
    "authorImage": author->image,
    "category": category->title,
    "categorySlug": category->slug.current,
    section
  }
`

// Секция боюнча посттор
export const postsBySectionQuery = groq`
  *[_type == "post" && section == $section] | order(publishedAt desc)[0...$limit] {
    _id,
    title,
    excerpt,
    "slug": slug.current,
    mainImage,
    publishedAt,
    "category": category->title,
    "categorySlug": category->slug.current
  }
`

// Категория боюнча посттор
export const postsByCategoryQuery = groq`
  *[_type == "post" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    _id,
    title,
    excerpt,
    "slug": slug.current,
    mainImage,
    publishedAt,
    "author": author->name,
    "category": category->title
  }
`

// Бир пост (Detail page үчүн)
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    excerpt,
    "slug": slug.current,
    mainImage,
    publishedAt,
    body,
    "author": author->{
      name,
      image,
      bio
    },
    "category": category->{
      title,
      "slug": slug.current
    },
    "relatedPosts": *[_type == "post" && category._ref == ^.category._ref && slug.current != $slug][0...4] {
      _id,
      title,
      "slug": slug.current,
      mainImage,
      publishedAt
    }
  }
`

// Видеолор
export const videosQuery = groq`
  *[_type == "video"] | order(publishedAt desc)[0...10] {
    _id,
    title,
    "slug": slug.current,
    youtubeUrl,
    thumbnail,
    duration,
    description
  }
`

// Бардык категориялар
export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`