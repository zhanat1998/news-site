'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface AdBannerClientProps {
  href: string;
  imageUrl: string;
  imageAlt: string;
  advertiser: string;
  placement: string;
  adId: string;
  className?: string;
  linkClassName?: string;
  imageWidth: number;
  imageHeight: number;
  imageClassName?: string;
}

export function AdBannerClient({
  href,
  imageUrl,
  imageAlt,
  advertiser,
  placement,
  adId,
  linkClassName,
  imageWidth,
  imageHeight,
  imageClassName,
}: AdBannerClientProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const viewSent = useRef(false);

  const trackEvent = (eventType: 'view' | 'click') => {
    // GA4
    window.gtag?.('event', eventType === 'view' ? 'adv_campaign_view' : 'adv_campaign_click', {
      advertiser,
      format: `sokol/${placement}`,
      placement,
    });
    // Өз серверибиз
    fetch('/api/track-banner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId, advertiser, placement, eventType }),
    }).catch(() => {});
  };

  useEffect(() => {
    const el = linkRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !viewSent.current) {
            viewSent.current = true;
            trackEvent('view');
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [advertiser, placement, adId]);

  const handleClick = () => {
    trackEvent('click');
  };

  return (
    <Link
      ref={linkRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={linkClassName}
      onClick={handleClick}
    >
      <Image
        src={imageUrl}
        alt={imageAlt}
        width={imageWidth}
        height={imageHeight}
        className={imageClassName}
      />
    </Link>
  );
}
