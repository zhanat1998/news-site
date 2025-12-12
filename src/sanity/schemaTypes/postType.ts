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
    }),
    defineField({
      name: 'slug',
      title: 'Шилтеме (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
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
        })
      ]
    }),
    defineField({
      name: 'categories',
      title: 'Категориялар',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Саясат', value: 'politics'},
          {title: 'Спорт', value: 'sport'},
          {title: 'Маданият', value: 'culture'},
          {title: 'Экономика', value: 'economy'},
        ],
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Жарыяланган убактысы',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'section',
      title: 'Пост тармактарына бөлүү',
      type: 'string',
      options: {
        list: [
          {title: 'Шашылыш кабар', value: 'breaking'},
          {title: 'Башкы темалар', value: 'main_topics'},
          {title: 'Жанылыктар', value: 'news'},
          {title: 'Көңүл чордонунда', value: 'spotlight'},
          {title: 'Дүйнө Сокол медианын назарында', value: 'sokol_media'},
          {title: 'Редактордун тандоосу', value: 'editor_choice'},
          {title: 'Элдик экономика', value: 'economy'},
          {title: 'Борбор Азия', value: 'central_asia'},
          {title: 'Иликтөө', value: 'investigation'},
          {title: 'Өзгөчө пикир', value: 'opinion'},
          {title: 'Маданият', value: 'culture'},
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required().error('Тармакты тандаңыз'),
    }),
    defineField({
      name: 'body',
      title: 'Негизги текст (Макаланын мазмуну)',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
