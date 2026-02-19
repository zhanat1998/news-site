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
      name: 'placement',
      title: 'Жайгашкан жери',
      type: 'string',
      options: {
        list: [
          { title: 'Башкы бет - үстү', value: 'home_top' },
          { title: 'Башкы бет - ортосу', value: 'home_middle' },
          { title: 'Башкы бет - аягы', value: 'home_bottom' },
          { title: 'Категория барактары', value: 'category_page' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required().error('Жайгашкан жерин тандаңыз'),
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
      placement: 'placement',
      media: 'image',
    },
    prepare(selection) {
      const { title, placement } = selection
      const placementLabels: Record<string, string> = {
        home_top: 'Башкы бет - үстү',
        home_middle: 'Башкы бет - ортосу',
        home_bottom: 'Башкы бет - аягы',
        category_page: 'Категория барактары',
      }
      return {
        ...selection,
        subtitle: placementLabels[placement] || placement,
      }
    },
  },
})
