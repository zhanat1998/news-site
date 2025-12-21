import {paths} from "@/config/paths";

export const categories = [
  { id: 0, title: 'БАШКЫ БЕТ', href: paths.HOME },
  { id: 1, title: 'САЯСАТ', href: paths.POLITICS },
  { id: 2, title: 'КООМ', href: paths.SOCIETY },
  { id: 3, title: 'ЭКОНОМИКА', href: paths.ECONOMY },
  { id: 4, title: 'ДҮЙНӨ', href: paths.WORLD },
  { id: 5, title: 'МАДАНИЯТ', href: paths.CULTURE },
  { id: 6, title: 'СПОРТ', href: paths.SPORT },
  { id: 7, title: 'ВИДЕО', href: paths.VIDEO },
  { id: 8, title: 'КЫЛМЫШ-КЫРСЫК', href: paths.CRIME },
];

export const CATEGORY_TITLES = {
  POLITICS: 'САЯСАТ',
  SOCIETY: 'КООМ',
  ECONOMY: 'ЭКОНОМИКА',
  WORLD: 'ДҮЙНӨ',
  CULTURE: 'МАДАНИЯТ',
  SPORT: 'СПОРТ',
}

// constants/categories.ts
export const CATEGORIES = [
  {
    id: 'politics',
    title: 'САЯСАТ',
    slug: 'sayasat',
    description: 'Кыргызстандын жана дүйнөнүн саясий жаңылыктары',
    color: '#d32f2f',
    keywords: ['саясат', 'политика', 'шайлоо', 'парламент', 'президент'],
  },
  {
    id: 'society',
    title: 'КООМ',
    slug: 'koom',
    description: 'Коомдук жаңылыктар, социалдык маселелер',
    color: '#1976d2',
    keywords: ['коом', 'социалдык', 'элдик', 'жашоо'],
  },
  {
    id: 'economy',
    title: 'ЭКОНОМИКА',
    slug: 'ekonomika',
    description: 'Экономикалык жаңылыктар, бизнес, финансы',
    color: '#388e3c',
    keywords: ['экономика', 'бизнес', 'финансы', 'акча', 'сом'],
  },
  {
    id: 'world',
    title: 'ДҮЙНӨ',
    slug: 'duino',
    description: 'Эл аралык жаңылыктар, дүйнөлүк окуялар',
    color: '#7b1fa2',
    keywords: ['дүйнө', 'эл аралык', 'чет өлкө', 'глобалдык'],
  },
  {
    id: 'culture',
    title: 'МАДАНИЯТ',
    slug: 'madaniyat',
    description: 'Маданият, искусство, өнөр жаңылыктары',
    color: '#f57c00',
    keywords: ['маданият', 'искусство', 'музыка', 'кино', 'театр'],
  },
  {
    id: 'sport',
    title: 'СПОРТ',
    slug: 'sport',
    description: 'Спорт жаңылыктары, мелдештер, жыйынтыктар',
    color: '#00796b',
    keywords: ['спорт', 'футбол', 'мелдеш', 'олимпиада'],
  },
] as const;

export const name_of_site = 'Сокол Медиа';


export enum SectionTitles {
  LATEST_NEWS = 'Соңку жаңылыктар',
  POPULAR_NEWS = 'Популярдуу жаңылыктар',
  NEWS = 'Жаңылыктар',
  TOP_STORIES = 'Башкы темалар',
  SPOTLIGHT = 'Негизги жаңылыктар',
  BREAKING_NEWS = 'Шашылыш кабарлар',
}

export const socialLinks = [
  { icon: 'instagram', href: 'https://www.instagram.com/sokol.media_/' },
  { icon: 'facebook', href: 'https://www.facebook.com/groups/309724122880487' },
  { icon: 'telegram', href: 'https://t.me' },
  { icon: 'youtube', href: 'https://www.youtube.com/results?search_query=sokol+media' },
];
