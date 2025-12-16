// src/app/video/[slug]/page.tsx
import { client } from '@/sanity/lib/client'
import { notFound } from 'next/navigation'
import { groq } from 'next-sanity'
import {BunnyPlayer} from "@/components/video/BunnyPlayer/BunnyPlayer";

type Props = {
  params: Promise<{ slug: string }>
}

const videoBySlugQuery = groq`
  *[_type == "video" && slug.current == $slug][0] {
    _id,
    title,
    description,
    bunnyVideoId,
    duration,
    publishedAt,
    thumbnail {
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

export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params

  const video = await client.fetch(videoBySlugQuery, { slug })

  if (!video) {
    notFound()
  }

  return (
    <div className="container">
      {/* Видео плеер */}
      <BunnyPlayer videoId={video.bunnyVideoId} title={video.title} />

      {/* Маалымат */}
      <h1>{video.title}</h1>

      {video.duration && <span>{video.duration}</span>}

      {video.description && <p>{video.description}</p>}

      {video.author && <p>Автор: {video.author.name}</p>}
    </div>
  )
}