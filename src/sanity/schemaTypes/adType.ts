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
      title: 'Аталышы (ички колдонуу үчүн)',
      type: 'string',
      description: 'Жарнаманы аныктоо үчүн ат',
      validation: (rule) => rule.required().error('Аталыш милдеттүү'),
    }),

    defineField({
      name: 'placement',
      title: 'Жайгашкан жери',
      type: 'string',
      options: {
        list: [
          { title: 'Баннер - Башкы бет үстү', value: 'home_top' },
          { title: 'Баннер - Башкы бет ортосу', value: 'home_middle' },
          { title: 'Сайдбар - Оң жак', value: 'sidebar' },
          { title: 'Макала ичинде', value: 'in_article' },
          { title: 'Видео бөлүмү', value: 'video_section' },
          { title: 'Категория беттери', value: 'category_page' },
          { title: 'Футер үстү', value: 'above_footer' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required().error('Жайгашкан жерин тандаңыз'),
    }),

    defineField({
      name: 'adType',
      title: 'Жарнама түрү',
      type: 'string',
      options: {
        list: [
          { title: 'Сүрөт', value: 'image' },
          { title: 'HTML/Script (Google Ads ж.б.)', value: 'html' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'image',
      title: 'Жарнама сүрөтү',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.adType !== 'image',
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
      hidden: ({ parent }) => parent?.adType !== 'image',
    }),

    defineField({
      name: 'htmlCode',
      title: 'HTML/Script коду',
      type: 'text',
      rows: 10,
      description: 'Google Ads же башка жарнама кодун киргизиңиз',
      hidden: ({ parent }) => parent?.adType !== 'html',
    }),

    defineField({
      name: 'size',
      title: 'Өлчөмү',
      type: 'string',
      options: {
        list: [
          { title: 'Leaderboard (728x90)', value: '728x90' },
          { title: 'Large Leaderboard (970x90)', value: '970x90' },
          { title: 'Banner (468x60)', value: '468x60' },
          { title: 'Medium Rectangle (300x250)', value: '300x250' },
          { title: 'Wide Skyscraper (160x600)', value: '160x600' },
          { title: 'Half Page (300x600)', value: '300x600' },
          { title: 'Billboard (970x250)', value: '970x250' },
          { title: 'Mobile Banner (320x50)', value: '320x50' },
          { title: 'Large Mobile Banner (320x100)', value: '320x100' },
          { title: 'Responsive (Ийкемдүү)', value: 'responsive' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'responsive',
    }),

    defineField({
      name: 'isActive',
      title: 'Активдүү',
      type: 'boolean',
      description: 'Жарнаманы көрсөтүү/жашыруу',
      initialValue: true,
    }),

    defineField({
      name: 'startDate',
      title: 'Башталуу датасы',
      type: 'datetime',
      description: 'Качан баштап көрүнөт (бош болсо - дароо)',
    }),

    defineField({
      name: 'endDate',
      title: 'Аяктоо датасы',
      type: 'datetime',
      description: 'Качанга чейин көрүнөт (бош болсо - түбөлүккө)',
    }),

    defineField({
      name: 'priority',
      title: 'Приоритет',
      type: 'number',
      description: 'Чоң сан = жогорку приоритет',
      initialValue: 0,
    }),

    defineField({
      name: 'advertiser',
      title: 'Жарнама берүүчү',
      type: 'string',
      description: 'Компания же адам аты',
    }),

    defineField({
      name: 'notes',
      title: 'Эскертүүлөр',
      type: 'text',
      rows: 3,
      description: 'Ички эскертүүлөр (сайтта көрүнбөйт)',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      placement: 'placement',
      isActive: 'isActive',
      media: 'image',
    },
    prepare(selection) {
      const { title, placement, isActive } = selection
      const placementLabels: Record<string, string> = {
        home_top: 'Башкы бет үстү',
        home_middle: 'Башкы бет ортосу',
        sidebar: 'Сайдбар',
        in_article: 'Макала ичинде',
        video_section: 'Видео бөлүмү',
        category_page: 'Категория беттери',
        above_footer: 'Футер үстү',
      }
      return {
        ...selection,
        subtitle: `${placementLabels[placement] || placement} • ${isActive ? '✅ Активдүү' : '❌ Өчүрүлгөн'}`,
      }
    },
  },

  orderings: [
    {
      title: 'Приоритет боюнча',
      name: 'priorityDesc',
      by: [{ field: 'priority', direction: 'desc' }],
    },
    {
      title: 'Жайгашкан жери боюнча',
      name: 'placementAsc',
      by: [{ field: 'placement', direction: 'asc' }],
    },
  ],
})