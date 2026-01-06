import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/', '/_next/', '/stats-x7k9m2p4q8/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}