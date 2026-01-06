'use client';

import { useEffect } from 'react';

interface PageViewTrackerProps {
  postId: string;
  slug: string;
}

export default function PageViewTracker({ postId, slug }: PageViewTrackerProps) {
  useEffect(() => {
    // Бир эле сессияда кайра-кайра эсептебөө үчүн
    const viewedKey = `viewed_${slug}`;
    const lastViewed = sessionStorage.getItem(viewedKey);
    const now = Date.now();

    // 30 мүнөттөн кийин гана кайра эсептейт
    if (lastViewed && now - parseInt(lastViewed) < 30 * 60 * 1000) {
      return;
    }

    // Просмотр жазуу
    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, slug }),
    })
      .then(() => {
        sessionStorage.setItem(viewedKey, now.toString());
      })
      .catch(console.error);
  }, [postId, slug]);

  return null;
}