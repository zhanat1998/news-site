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
      name: 'bunnyVideoId',
      title: 'Bunny Video ID',
      type: 'string',
      description: 'Bunny dashboard → Video → Copy Video ID',
      validation: (Rule) => Rule.required(),
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