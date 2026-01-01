import { urlFor } from '@/sanity/lib/image';
// Placeholder сүрөт функциясы
export function getImage(mainImage: any, width: number, height: number, quality: number = 85) {
  if (mainImage?.asset) {
    // Retina экрандар үчүн 2x өлчөм + WebP формат (тез жүктөлөт)
    return urlFor(mainImage)
      .width(width * 2)
      .height(height * 2)
      .quality(quality)
      .auto('format')
      .url();
  }
  return `https://picsum.photos/${width * 2}/${height * 2}?random=${Math.random()}`;
}