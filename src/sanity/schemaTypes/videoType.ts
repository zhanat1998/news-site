// sanity/schemaTypes/videoType.ts
import { defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const videoType = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Аталышы',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Сүрөттөмө',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'videoSource',
      title: 'Видео булагы',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube', value: 'youtube' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'TikTok', value: 'tiktok' },
        ],
        layout: 'radio',
      },
      initialValue: 'youtube',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube шилтемеси',
      type: 'string',
      description: 'YouTube шилтемесин киргизиңиз. Мисалы: https://www.youtube.com/watch?v=dc2PNSdRHtY же https://youtu.be/dc2PNSdRHtY',
      hidden: ({ parent }) => parent?.videoSource !== 'youtube',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram шилтемеси',
      type: 'string',
      description: 'Instagram шилтемесин киргизиңиз. Мисалы: https://www.instagram.com/reel/ABC123/',
      hidden: ({ parent }) => parent?.videoSource !== 'instagram',
    }),
    defineField({
      name: 'tiktokUrl',
      title: 'TikTok шилтемеси',
      type: 'string',
      description: 'TikTok шилтемесин киргизиңиз. Мисалы: https://www.tiktok.com/@user/video/123456',
      hidden: ({ parent }) => parent?.videoSource !== 'tiktok',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Сүрөт (Thumbnail)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'duration',
      title: 'Узундугу',
      type: 'string',
      description: 'Мисалы: 5:43',
    }),
    defineField({
      name: 'category',
      title: 'Категория',
      type: 'reference',
      to: { type: 'category' },
    }),
    defineField({
      name: 'author',
      title: 'Автор',
      type: 'reference',
      to: { type: 'author' },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Жарыяланган күнү',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Башкы бетте көрсөтүү',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      duration: 'duration',
      media: 'thumbnail',
    },
    prepare({ title, duration }) {
      return {
        title,
        subtitle: duration || 'Видео',
      }
    },
  },
})