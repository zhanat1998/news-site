import { defineField, defineType } from 'sanity'

export const bannerStatType = defineType({
  name: 'bannerStat',
  title: 'Баннер статистикасы',
  type: 'document',
  fields: [
    defineField({ name: 'date', title: 'Күн (YYYY-MM-DD)', type: 'string' }),
    defineField({ name: 'adId', title: 'Жарнама ID', type: 'string' }),
    defineField({ name: 'advertiser', title: 'Рекламодатель', type: 'string' }),
    defineField({ name: 'placement', title: 'Жайгашкан жери', type: 'string' }),
    defineField({ name: 'views', title: 'Көрүүлөр', type: 'number', initialValue: 0 }),
    defineField({ name: 'clicks', title: 'Кликтер', type: 'number', initialValue: 0 }),
  ],
})
