// sanity/schemaTypes/postType.ts
import { DocumentTextIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Пост',
  type: 'document',
  icon: DocumentTextIcon,

  fields: [
    defineField({
      name: 'title',
      title: 'Башкы аталыш',
      type: 'string',
      validation: (rule) => rule
        .required().error('Аталыш милдеттүү')
    }),

    defineField({
      name: 'slug',
      title: 'Шилтеме (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200,
      },
      validation: (rule) => rule
        .required().error('Slug милдеттүү — Generate басыңыз')
    }),

    defineField({
      name: 'excerpt',
      title: 'Кыскача сүрөттөмө',
      type: 'text',
      rows: 3,
      description: 'Карточкаларда көрүнөт (1-2 сүйлөм)',
      validation: (rule) => rule
        .required().error('Кыскача сүрөттөмө милдеттүү')
    }),

    defineField({
      name: 'author',
      title: 'Автору',
      type: 'reference',
      to: { type: 'author' },
      validation: (rule) => rule
        .required().error('Автор тандаңыз'),
    }),

    defineField({
      name: 'mainImage',
      title: 'Башкы сүрөт',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule
        .required().error('Башкы сүрөт милдеттүү'),
      fields: [
        defineField({
          name: 'alt',
          title: 'Альтернативдик текст',
          type: 'string',
          validation: (rule) => rule
            .required().error('Alt текст милдеттүү (SEO үчүн)'),
        }),
        defineField({
          name: 'caption',
          title: 'Сүрөттүн сүрөттөмөсү',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'categories',
      title: 'Категориялар',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      description: 'Бир нече категория тандай аласыз',
    }),

    defineField({
      name: 'publishedAt',
      title: 'Жарыяланган убактысы',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule
        .required().error('Жарыялоо убактысы милдеттүү'),
    }),

    defineField({
      name: 'section',
      title: 'Секция',
      type: 'string',
      options: {
        list: [
          { title: 'Шашылыш кабар', value: 'breaking' },
          { title: 'Башкы темалар (Hero)', value: 'hero' },
          { title: 'Жаңылыктар', value: 'news' },
          { title: 'Көңүл чордонунда', value: 'spotlight' },
          { title: 'Редактордун тандоосу', value: 'editor_choice' },
          { title: 'Борбор Азия', value: 'central_asia' },
          { title: 'Иликтөө', value: 'investigation' },
          { title: 'Пикир', value: 'opinion' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule
        .required().error('Секция тандаңыз'),
    }),

    defineField({
      name: 'isFeatured',
      title: 'Башкы бетте көрсөтүү',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'isBreaking',
      title: 'Шашылыш кабар',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'sendPushNotification',
      title: 'Push уведомление жиберүү',
      type: 'boolean',
      description: 'Бул постту жарыялаганда подписчиктерге push уведомление жөнөтүлөт (5 мүнөттөн кийин)',
      initialValue: false,
    }),

    defineField({
      name: 'body',
      title: 'Негизги текст (Макаланын мазмуну)',
      type: 'blockContent',
      description: 'H2 = Subtitle, Blockquote = Цитата, + "Дагы караңыз" блоктору',
      validation: (rule) => rule
        .required().error('Негизги текст милдеттүү'),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      section: 'section',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const { author, section, publishedAt } = selection
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString('ky-KG')
        : ''
      return {
        ...selection,
        subtitle: `${date} • ${section || 'Секция жок'} ${author ? '• ' + author : ''}`,
      }
    },
  },
})