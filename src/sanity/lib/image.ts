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

// Мобилка үчүн оптималдаштырылган сүрөт (2x жок, quality төмөн)
export const urlForMobile = (
  source: SanityImageSource,
  width: number,
  height: number,
  quality: number = 70
) => {
  return builder
    .image(source)
    .width(width)
    .height(height)
    .quality(quality)
    .auto('format')
    .url()
}

// Responsive сүрөт - srcSet үчүн бир нече өлчөм
export const getResponsiveImageUrls = (
  source: SanityImageSource,
  baseWidth: number,
  baseHeight: number
) => {
  const aspectRatio = baseHeight / baseWidth;

  return {
    // Мобилка үчүн (640px)
    small: builder
      .image(source)
      .width(640)
      .height(Math.round(640 * aspectRatio))
      .quality(70)
      .auto('format')
      .url(),
    // Планшет үчүн (1024px)
    medium: builder
      .image(source)
      .width(1024)
      .height(Math.round(1024 * aspectRatio))
      .quality(80)
      .auto('format')
      .url(),
    // Десктоп үчүн (1600px)
    large: builder
      .image(source)
      .width(1600)
      .height(Math.round(1600 * aspectRatio))
      .quality(85)
      .auto('format')
      .url(),
  }
}
