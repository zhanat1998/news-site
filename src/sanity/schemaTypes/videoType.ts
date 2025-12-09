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
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Сүрөт',
      type: 'image',
    }),
    defineField({
      name: 'duration',
      title: 'Узундугу (мис: 5:43)',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
  ],
})