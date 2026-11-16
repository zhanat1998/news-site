import { defineField, defineType } from 'sanity'

export const postViewsType = defineType({
  name: 'postViews',
  title: 'Пост көрүүлөрү',
  type: 'document',
  fields: [
    defineField({
      name: 'post',
      title: 'Пост',
      type: 'reference',
      to: [{ type: 'post' }],
      weak: true,
    }),
    defineField({
      name: 'viewCount',
      title: 'Көрүүлөр',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
  ],
})
