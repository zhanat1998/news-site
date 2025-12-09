import { groq } from 'next-sanity'

// Breaking News үчүн
export const breakingNewsQuery = groq`
  *[_type == "post" && isBreaking == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current
  }
`

// Башка посттор үчүн
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