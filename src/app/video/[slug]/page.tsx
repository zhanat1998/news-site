import { client } from '@/sanity/lib/client'
import { notFound } from 'next/navigation'
import { groq } from 'next-sanity'
import { BunnyPlayer } from "@/components/video/BunnyPlayer/BunnyPlayer";
import styles from './page.module.scss';

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
    category->{ title },
    author->{ name }
  }
`

export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params
  const video = await client.fetch(videoBySlugQuery, { slug })

  if (!video) {
    notFound()
  }

  return (
    <div className={styles.videoPage}>
      {/* Title + Description ҮСТҮНДӨ */}
      <div className={styles.content}>
        <h1 className={styles.title}>{video.title}</h1>

        {video.description && (
          <p className={styles.description}>{video.description}</p>
        )}
      </div>

      {/* Видео плеер */}
      <div className={styles.playerSection}>
        <BunnyPlayer videoId={video.bunnyVideoId} title={video.title} />
      </div>

      {/* Мета маалымат */}
      <div className={styles.meta}>
        {video.author && <span>👤 {video.author.name}</span>}
        {video.duration && <span>⏱ {video.duration}</span>}
        {video.category && <span>{video.category.title}</span>}
      </div>
    </div>
  )
}