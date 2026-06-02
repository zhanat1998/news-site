import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {videoType} from "@/sanity/schemaTypes/videoType";
import {adType} from './adType'
import {dailyStatType} from './dailyStatType'
import {bannerStatType} from './bannerStatType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, authorType, videoType, adType, dailyStatType, bannerStatType],
}
