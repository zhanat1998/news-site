// sanity/schemaTypes/categoryType.ts
import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Категория',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Аталышы',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Сүрөттөмө',
      type: 'text',
    }),
    defineField({
      name: 'color',
      title: 'Түсү',
      type: 'string',
      description: 'Мисалы: #fa9000',
    }),
  ],
})