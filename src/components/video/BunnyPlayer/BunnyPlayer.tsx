// src/components/BunnyPlayer.tsx
import styles from './BunnyPlayer.module.scss'

interface BunnyPlayerProps {
  videoId: string
  title?: string
}

export function BunnyPlayer({ videoId, title }: BunnyPlayerProps) {
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID

  return (
    <div className={styles.playerWrapper}>
      <iframe
        src={`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&preload=true`}
        title={title || 'Video'}
        className={styles.iframe}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}