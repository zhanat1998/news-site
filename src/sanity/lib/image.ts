import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

// Strapi/Cloudinary сүрөт URL'ин текшерүү
function isCloudinaryUrl(source: any): string | null {
  // Эгер asset.url Cloudinary же башка толук URL болсо
  if (source?.asset?.url && (
    source.asset.url.startsWith('http://') ||
    source.asset.url.startsWith('https://')
  )) {
    return source.asset.url;
  }
  return null;
}

// Cloudinary URL үчүн жөнөкөй трансформация
function cloudinaryTransform(url: string, width?: number, height?: number, quality?: number): string {
  // Cloudinary URL трансформациясы
  if (url.includes('res.cloudinary.com')) {
    // /upload/ дан кийин трансформация кошуу
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transforms = [];
      if (width) transforms.push(`w_${width}`);
      if (height) transforms.push(`h_${height}`);
      if (quality) transforms.push(`q_${quality}`);
      transforms.push('c_fill');
      transforms.push('f_auto');

      if (transforms.length > 0) {
        return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
      }
    }
  }
  return url;
}

// Wrapper class for Cloudinary URLs (Sanity builder interface-га окшош)
class CloudinaryUrlBuilder {
  private baseUrl: string;
  private _width?: number;
  private _height?: number;
  private _quality?: number;

  constructor(imageUrl: string) {
    this.baseUrl = imageUrl;
  }

  width(w: number) { this._width = w; return this; }
  height(h: number) { this._height = h; return this; }
  quality(q: number) { this._quality = q; return this; }
  auto(_format: string) { return this; }
  blur(_amount: number) { return this; }
  fit(_mode: string) { return this; }
  crop(_mode: string) { return this; }

  url(): string {
    return cloudinaryTransform(this.baseUrl, this._width, this._height, this._quality);
  }
}

export const urlFor = (source: SanityImageSource) => {
  // Null/undefined текшерүү
  if (!source) {
    return new CloudinaryUrlBuilder('/placeholder.jpg');
  }

  // Cloudinary/Strapi URL текшерүү
  const cloudinaryUrl = isCloudinaryUrl(source);
  if (cloudinaryUrl) {
    return new CloudinaryUrlBuilder(cloudinaryUrl);
  }

  // Sanity URL builder колдонуу
  try {
    return builder.image(source);
  } catch {
    return new CloudinaryUrlBuilder('/placeholder.jpg');
  }
}

// Жогорку сапаттуу сүрөт алуу үчүн helper функция
export const urlForHQ = (
  source: SanityImageSource,
  width: number,
  height: number,
  quality: number = 90
) => {
  if (!source) return '/placeholder.jpg';

  // Cloudinary URL текшерүү
  const cloudinaryUrl = isCloudinaryUrl(source);
  if (cloudinaryUrl) {
    return cloudinaryTransform(cloudinaryUrl, width * 2, height * 2, quality);
  }

  try {
    return builder
      .image(source)
      .width(width * 2)  // Retina экрандар үчүн 2x
      .height(height * 2)
      .quality(quality)
      .auto('format')  // WebP/AVIF автоматтык тандоо
      .url()
  } catch {
    return '/placeholder.jpg';
  }
}

// Мобилка үчүн оптималдаштырылган сүрөт (2x жок, quality төмөн)
export const urlForMobile = (
  source: SanityImageSource,
  width: number,
  height: number,
  quality: number = 70
) => {
  if (!source) return '/placeholder.jpg';

  const cloudinaryUrl = isCloudinaryUrl(source);
  if (cloudinaryUrl) {
    return cloudinaryTransform(cloudinaryUrl, width, height, quality);
  }

  try {
    return builder
      .image(source)
      .width(width)
      .height(height)
      .quality(quality)
      .auto('format')
      .url()
  } catch {
    return '/placeholder.jpg';
  }
}

// Responsive сүрөт - srcSet үчүн бир нече өлчөм
export const getResponsiveImageUrls = (
  source: SanityImageSource,
  baseWidth: number,
  baseHeight: number
) => {
  const placeholder = '/placeholder.jpg';
  if (!source) {
    return { small: placeholder, medium: placeholder, large: placeholder };
  }

  const aspectRatio = baseHeight / baseWidth;

  // Cloudinary URL текшерүү
  const cloudinaryUrl = isCloudinaryUrl(source);
  if (cloudinaryUrl) {
    return {
      small: cloudinaryTransform(cloudinaryUrl, 640, Math.round(640 * aspectRatio), 70),
      medium: cloudinaryTransform(cloudinaryUrl, 1024, Math.round(1024 * aspectRatio), 80),
      large: cloudinaryTransform(cloudinaryUrl, 1600, Math.round(1600 * aspectRatio), 85),
    };
  }

  try {
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
  } catch {
    return { small: placeholder, medium: placeholder, large: placeholder };
  }
}
