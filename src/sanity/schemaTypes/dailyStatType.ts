// sanity/schemaTypes/dailyStatType.ts
import { defineField, defineType } from 'sanity'

export const dailyStatType = defineType({
  name: 'dailyStat',
  title: 'Күндүк статистика',
  type: 'document',
  // Studio'до көрсөтүлбөйт — API аркылуу гана башкарылат
  fields: [
    defineField({
      name: 'date',
      title: 'Күн (YYYY-MM-DD)',
      type: 'string',
    }),
    defineField({
      name: 'totalViews',
      title: 'Жалпы көрүүлөр',
      type: 'number',
      initialValue: 0,
    }),
    // countryViews схемасыз объект катары сакталат: { KG: 100, RU: 50 }
  ],
})
