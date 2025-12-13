// sanity/schemaTypes/postType.ts
import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Пост',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Аталышы',
      type: 'string',
      validation: (rule) => rule.required().error('Аталышы керек'),
    }),
    defineField({
      name: 'slug',
      title: 'Шилтеме (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Slug керек'),
    }),
    defineField({
      name: 'excerpt',
      title: 'Кыскача сүрөттөмө',
      type: 'text',
      rows: 3,
      description: 'Макаланын кыскача баяндамасы (карточкаларда көрүнөт)',
    }),
    defineField({
      name: 'author',
      title: 'Автору',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      title: 'Башкы сүрөт',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Альтернативдик текст',
          type: 'string',
        }),
        defineField({
          name: 'caption',
          title: 'Сүрөттүн сүрөттөмөсү',
          type: 'string',
        }),
      ]
    }),
    defineField({
      name: 'category',
      title: 'Категория',
      type: 'reference',
      to: {type: 'category'},
      validation: (rule) => rule.required().error('Категория тандаңыз'),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Жарыяланган убактысы',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'section',
      title: 'Секция (кайсы жерде көрүнсүн)',
      type: 'string',
      options: {
        list: [
          {title: 'Шашылыш кабар', value: 'breaking'},
          {title: 'Башкы темалар (Hero)', value: 'hero'},
          {title: 'Жаңылыктар', value: 'news'},
          {title: 'Көңүл чордонунда', value: 'spotlight'},
          {title: 'Редактордун тандоосу', value: 'editor_choice'},
          {title: 'Элдик экономика', value: 'economy'},
          {title: 'Борбор Азия', value: 'central_asia'},
          {title: 'Иликтөө', value: 'investigation'},
          {title: 'Өзгөчө пикир', value: 'opinion'},
        ],
        layout: 'dropdown',
      },
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
      name: 'body',
      title: 'Негизги текст',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      section: 'section',
    },
    prepare(selection) {
      const {author, section} = selection
      return {
        ...selection,
        subtitle: `${section || 'Секция жок'} ${author ? '• ' + author : ''}`
      }
    },
  },
})