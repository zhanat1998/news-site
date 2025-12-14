import { urlFor } from '@/sanity/lib/image';
// Placeholder сүрөт функциясы
export function getImage(post: any, width: number, height: number) {
  if (post?.mainImage?.asset) {
    return urlFor(post.mainImage).width(width).height(height).url();
  }
  return `https://picsum.photos/${width}/${height}?random=${post?._id || Math.random()}`;
}