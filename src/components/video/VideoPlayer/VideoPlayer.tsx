// src/components/video/VideoPlayer/VideoPlayer.tsx
'use client';

import styles from './VideoPlayer.module.scss';

interface VideoPlayerProps {
  video: {
    youtubeUrl?: string;
    title: string;
  };
}

// YouTube URL'ден Video ID алуу
function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  // youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];

  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/embed/ID
  const embedMatch = url.match(/embed\/([^?&]+)/);
  if (embedMatch) return embedMatch[1];

  return null;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const youtubeId = video.youtubeUrl ? extractYouTubeId(video.youtubeUrl) : null;

  if (!youtubeId) {
    return <div className={styles.player}>Видео табылган жок</div>;
  }

  return (
    <div className={styles.player}>
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
        loading="lazy"
        style={{
          border: 'none',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}