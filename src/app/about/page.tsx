import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';

export const metadata: Metadata = {
  title: 'Биз жөнүндө',
  description: 'Сокол.Медиа - Кыргызстандын ишенимдүү жаңылыктар порталы. Биздин максат - калкка так, оперативдүү жана объективдүү маалымат берүү.',
  keywords: ['Сокол.Медиа', 'биз жөнүндө', 'жаңылыктар порталы', 'Кыргызстан', 'редакция'],
  openGraph: {
    type: 'website',
    locale: 'ky_KG',
    url: `${siteUrl}/about`,
    title: 'Биз жөнүндө - Сокол.Медиа',
    description: 'Сокол.Медиа - Кыргызстандын ишенимдүү жаңылыктар порталы',
    siteName: 'Сокол.Медиа',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Сокол.Медиа',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Биз жөнүндө - Сокол.Медиа',
    description: 'Сокол.Медиа - Кыргызстандын ишенимдүү жаңылыктар порталы',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="container">
      Биз жөнүндө
    </div>
  )
}