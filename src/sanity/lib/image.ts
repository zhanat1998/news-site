import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

// Жогорку сапаттуу сүрөт алуу үчүн helper функция
export const urlForHQ = (
  source: SanityImageSource,
  width: number,
  height: number,
  quality: number = 90
) => {
  return builder
    .image(source)
    .width(width * 2)  // Retina экрандар үчүн 2x
    .height(height * 2)
    .quality(quality)
    .auto('format')  // WebP/AVIF автоматтык тандоо
    .url()
}
