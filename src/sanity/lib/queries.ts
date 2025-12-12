import { groq } from 'next-sanity'

export const breakingNewsQuery = groq`
  *[_type == "post" && isBreaking == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current
  }
`

export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    publishedAt,
    "author": author->name,
    "category": categories[0]->title
  }
`

// Видеолор үчүн
export const videosQuery = groq`
  *[_type == "video"] | order(publishedAt desc)[0...5] {
    _id,
    title,
    "slug": slug.current,
    youtubeUrl,
    thumbnail,
    duration
  }
`