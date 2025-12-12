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
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'Мисалы: https://www.youtube.com/watch?v=VIDEO_ID',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Сүрөт (Thumbnail)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
        }),
      ],
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
      author: 'author.name',
      media: 'thumbnail',
      duration: 'duration',
    },
    prepare(selection) {
      const { title, author, duration } = selection
      return {
        ...selection,
        title: title,
        subtitle: `${duration || ''} ${author ? '• ' + author : ''}`,
      }
    },
  },
})
