// src/components/video/VideoPlayer/VideoPlayer.tsx
'use client';

import { useEffect, useRef } from 'react';
import styles from './VideoPlayer.module.scss';

interface VideoPlayerProps {
  video: {
    bunnyVideoId: string;
    title: string;
  };
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className={styles.player}>
      <iframe
        ref={iframeRef}
        src={`https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${video.bunnyVideoId}?autoplay=false&loop=false&muted=false&preload=true`}
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