// sanity/schemaTypes/adType.ts
import { ImageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const adType = defineType({
  name: 'ad',
  title: 'Жарнама',
  type: 'document',
  icon: ImageIcon,

  fields: [
    defineField({
      name: 'title',
      title: 'Аталышы',
      type: 'string',
      description: 'Жарнаманы аныктоо үчүн ат (сайтта көрүнбөйт)',
      validation: (rule) => rule.required().error('Аталыш милдеттүү'),
    }),

    defineField({
      name: 'image',
      title: 'Сүрөт',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required().error('Сүрөт милдеттүү'),
      fields: [
        defineField({
          name: 'alt',
          title: 'Альтернативдик текст',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'link',
      title: 'Шилтеме (URL)',
      type: 'url',
      description: 'Жарнамага басканда кайда өтөт',
      validation: (rule) => rule.required().error('Шилтеме милдеттүү'),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
})
