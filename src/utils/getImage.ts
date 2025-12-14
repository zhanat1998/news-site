import { urlFor } from '@/sanity/lib/image';
// Placeholder сүрөт функциясы
export function getImage(mainImage: any, width: number, height: number) {
  if (mainImage?.asset) {
    return urlFor(mainImage).width(width).height(height).url();
  }
  return `https://picsum.photos/${width}/${height}?random=${Math.random()}`;
}