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
          { title: 'Bunny CDN', value: 'bunny' },
        ],
        layout: 'radio',
      },
      initialValue: 'youtube',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube шилтемеси',
      type: 'url',
      description: 'Толук YouTube шилтемесин киргизиңиз. Мисалы: https://www.youtube.com/watch?v=dc2PNSdRHtY',
      hidden: ({ parent }) => parent?.videoSource !== 'youtube',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { videoSource?: string }
          if (parent?.videoSource === 'youtube' && !value) {
            return 'YouTube шилтемесин киргизиңиз'
          }
          if (value && !value.includes('youtube.com') && !value.includes('youtu.be')) {
            return 'Туура YouTube шилтемеси киргизиңиз'
          }
          return true
        }),
    }),
    defineField({
      name: 'bunnyVideoId',
      title: 'Bunny Video ID',
      type: 'string',
      description: 'Bunny dashboard → Video → Copy Video ID',
      hidden: ({ parent }) => parent?.videoSource !== 'bunny',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { videoSource?: string }
          if (parent?.videoSource === 'bunny' && !value) {
            return 'Bunny Video ID киргизиңиз'
          }
          return true
        }),
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