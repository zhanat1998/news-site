// sanity/schemaTypes/blockContentType.ts
import {defineType, defineArrayMember} from 'sanity'
import {ImageIcon, LinkIcon, DocumentIcon} from '@sanity/icons'

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    // Негизги текст блогу
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Кадимки', value: 'normal'},
        {title: 'H2 (Subtitle)', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Цитата', value: 'blockquote'},
      ],
      lists: [
        {title: 'Тизме', value: 'bullet'},
        {title: 'Номерленген', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Калың', value: 'strong'},
          {title: 'Курсив', value: 'em'},
          {title: 'Астын сызуу', value: 'underline'},
        ],
        annotations: [
          {
            title: 'Шилтеме',
            name: 'link',
            type: 'object',
            icon: LinkIcon,
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
              {
                title: 'Жаңы табта ачуу',
                name: 'blank',
                type: 'boolean',
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),

    // Сүрөт
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Альтернативдик текст',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Сүрөт сүрөттөмөсү',
        },
      ],
    }),

    // "Дагы караңыз" блогу (inline related)
    defineArrayMember({
      type: 'object',
      name: 'relatedBlock',
      title: 'Дагы караңыз',
      icon: DocumentIcon,
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Заголовок',
          initialValue: 'ДАГЫ КАРАҢЫЗ',
        },
        {
          name: 'relatedPost',
          type: 'reference',
          title: 'Байланыштуу макала',
          to: [{type: 'post'}],
        },
      ],
      preview: {
        select: {
          title: 'relatedPost.title',
          media: 'relatedPost.mainImage',
        },
        prepare({title, media}) {
          return {
            title: title || 'Макала тандалган жок',
            subtitle: 'Дагы караңыз',
            media,
          }
        },
      },
    }),

    // Bunny видео
    defineArrayMember({
      type: 'object',
      name: 'bunnyVideo',
      title: 'Bunny видео',
      fields: [
        {
          name: 'videoId',
          type: 'string',
          title: 'Bunny Video ID',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Видео сүрөттөмөсү',
        },
      ],
      preview: {
        select: { videoId: 'videoId' },
        prepare({ videoId }) {
          return {
            title: 'Bunny видео',
            subtitle: videoId || 'ID жок',
          }
        },
      },
    }),
  ],
})