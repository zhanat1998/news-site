import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'vz-0a81affa-d72.b-cdn.net',
      },
    ],
    // Sanity CDN өзү оптимизациялайт, Next.js оптимизациясын өчүрөбүз
    unoptimized: true,
  },
}

export default nextConfig