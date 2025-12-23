// sanity/structure.ts
import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Контент')
    .items([
      S.listItem()
        .title('Посттор')
        .schemaType('post')
        .child(
          S.documentTypeList('post')
            .title('Посттор')
            .defaultOrdering([
              { field: '_createdAt', direction: 'desc' }  // ← _createdAt колдон
            ])
        ),
      S.divider(),
      S.documentTypeListItem('video').title('Видеолор'),
      S.documentTypeListItem('category').title('Категориялар'),
      S.documentTypeListItem('author').title('Авторлор'),
      S.documentTypeListItem('ad').title('Жарнамалар'),
    ])