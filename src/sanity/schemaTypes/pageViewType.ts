// sanity/schemaTypes/pageViewType.ts
import { BarChartIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const pageViewType = defineType({
  name: 'pageView',
  title: 'Просмотр',
  type: 'document',
  icon: BarChartIcon,

  fields: [
    defineField({
      name: 'post',
      title: 'Пост',
      type: 'reference',
      to: { type: 'post' },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'viewedAt',
      title: 'Убакыт',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'userAgent',
      title: 'User Agent',
      type: 'string',
    }),

    defineField({
      name: 'referer',
      title: 'Referer',
      type: 'string',
    }),

    defineField({
      name: 'country',
      title: 'Өлкө',
      type: 'string',
    }),
  ],

  preview: {
    select: {
      title: 'post.title',
      viewedAt: 'viewedAt',
    },
    prepare(selection) {
      const { title, viewedAt } = selection
      const date = viewedAt
        ? new Date(viewedAt).toLocaleString('ky-KG')
        : ''
      return {
        title: title || 'Белгисиз пост',
        subtitle: date,
      }
    },
  },
})