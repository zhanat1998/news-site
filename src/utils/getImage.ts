import { urlFor } from '@/sanity/lib/image';
// Placeholder сүрөт функциясы
export function getImage(mainImage: any, width: number, height: number, quality: number = 100) {
  if (mainImage?.asset) {
    // Retina экрандар үчүн 3x өлчөм жана максималдуу сапат
    return urlFor(mainImage)
      .width(width * 3)
      .height(height * 3)
      .quality(quality)
      .url();
  }
  return `https://picsum.photos/${width * 3}/${height * 3}?random=${Math.random()}`;
}