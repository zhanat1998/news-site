// src/components/video/VideoPlayer/VideoPlayer.tsx
'use client';

import { useRef } from 'react';
import styles from './VideoPlayer.module.scss';

interface VideoPlayerProps {
  video: {
    videoSource?: 'youtube' | 'bunny';
    youtubeUrl?: string;
    bunnyVideoId?: string;
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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isYouTube = video.videoSource === 'youtube' || video.youtubeUrl;
  const youtubeId = video.youtubeUrl ? extractYouTubeId(video.youtubeUrl) : null;

  const src = isYouTube && youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?rel=0`
    : `https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${video.bunnyVideoId}?autoplay=false&loop=false&muted=false&preload=true`;

  return (
    <div className={styles.player}>
      <iframe
        ref={iframeRef}
        src={src}
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