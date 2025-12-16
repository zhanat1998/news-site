import {paths} from "@/config/paths";

export const categories = [
  { id: 0, title: 'БАШКЫ БЕТ', href: paths.HOME },
  { id: 1, title: 'САЯСАТ', href: paths.POLITICS },
  { id: 2, title: 'КООМ', href: paths.SOCIETY },
  { id: 3, title: 'ЭКОНОМИКА', href: paths.ECONOMY },
  { id: 4, title: 'ДҮЙНӨ', href: paths.WORLD },
  { id: 5, title: 'МАДАНИЯТ', href: paths.CULTURE },
  { id: 6, title: 'СПОРТ', href: paths.SPORT },
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

// Type export
export type CategoryId = typeof CATEGORIES[number]['id'];
export type Category = typeof CATEGORIES[number];

// Helper функциялар
export const getCategoryBySlug = (slug: string) =>
  CATEGORIES.find(c => c.slug === slug);

export const getCategoryById = (id: string) =>
  CATEGORIES.find(c => c.id === id);

export const name_of_site = 'Сокол Медиа';


export const navLinks = [
  { id: 1, title: 'Подкаст', href: paths.VIDEO },
  { id: 2, title: 'БИЗ ЖОНУНДО', href: paths.ABOUT },
  { id: 3, title: 'Байланыш', href: paths.CONTACT },
];

export enum SectionTitles {
  LATEST_NEWS = 'Соңку жаңылыктар',
  POPULAR_NEWS = 'Популярдуу жаңылыктар',
  NEWS = 'Жаңылыктар',
  TOP_STORIES = 'Башкы темалар',
  SPOTLIGHT = 'Негизги жаңылыктар',
  BREAKING_NEWS = 'Шашылыш кабарлар',
}

export const categoryNewsData = [
  {
    title: 'Элдик экономика',
    slug: 'economy',
    mainNews: {
      title: 'Кыргызстанда инфляция 10% га жетти: эксперттер эскертүү берүүдө',
      slug: 'inflation-kyrgyzstan',
      image: 'https://picsum.photos/400/250?random=30'
    },
    smallNews: [
      {
        title: 'Сом долларга карата 5% га начарлады: эмне күтүүгө болот',
        slug: 'som-dollar',
        image: 'https://picsum.photos/150/100?random=31'
      },
      {
        title: 'Жаңы салык реформасы ишкерлерди кандай таасир этет',
        slug: 'tax-reform',
        image: 'https://picsum.photos/150/100?random=32'
      },
      {
        title: 'Алтын кени: Кумтөрдөн кийинки келечек',
        slug: 'gold-mining',
        image: 'https://picsum.photos/150/100?random=33'
      }
    ]
  },
  {
    title: 'Борбор Азия',
    slug: 'central-asia',
    mainNews: {
      title: 'Казакстан менен Өзбекстан суу маселеси боюнча жаңы келишим түзүштү',
      slug: 'water-deal',
      image: 'https://picsum.photos/400/250?random=34'
    },
    smallNews: [
      {
        title: 'Тажикстанда парламенттик шайлоолор өтөт: негизги талапкерлер',
        slug: 'tajik-elections',
        image: 'https://picsum.photos/150/100?random=35'
      },
      {
        title: 'Түркмөнстан газ экспортун Кытайга көбөйтөт',
        slug: 'turkmen-gas',
        image: 'https://picsum.photos/150/100?random=36'
      },
      {
        title: 'Афганстан чек арасында чыңалуу: акыркы жаңылыктар',
        slug: 'afghan-border',
        image: 'https://picsum.photos/150/100?random=37'
      }
    ]
  },
  {
    title: 'Иликтөө',
    slug: 'investigation',
    mainNews: {
      title: 'Коррупция иши: мурдагы министрге 15 жыл түрмө жазасы суралды',
      slug: 'corruption-case',
      image: 'https://picsum.photos/400/250?random=38'
    },
    smallNews: [
      {
        title: 'Контрабанда тармагы: кантип миллиондор чек арадан өтөт',
        slug: 'smuggling-network',
        image: 'https://picsum.photos/150/100?random=39'
      },
      {
        title: 'Жасалма дипломдор: билим тармагындагы көйгөй',
        slug: 'fake-diplomas',
        image: 'https://picsum.photos/150/100?random=40'
      },
      {
        title: 'Мыйзамсыз куруулар: ким жооптуу?',
        slug: 'illegal-construction',
        image: 'https://picsum.photos/150/100?random=41'
      }
    ]
  },
  {
    title: 'Өзгөчө пикир',
    slug: 'opinion',
    mainNews: {
      title: 'Демократия жолунда: Кыргызстан туура багытта баратабы?',
      slug: 'democracy-opinion',
      image: 'https://picsum.photos/400/250?random=42'
    },
    smallNews: [
      {
        title: 'Жаштар эмне үчүн чет өлкөгө кетүүдө: социолог пикири',
        slug: 'youth-migration',
        image: 'https://picsum.photos/150/100?random=43'
      },
      {
        title: 'Билим системасын реформалоо: эксперттин сунушу',
        slug: 'education-reform',
        image: 'https://picsum.photos/150/100?random=44'
      },
      {
        title: 'Экология кризиси: биз эмне кыла алабыз?',
        slug: 'ecology-crisis',
        image: 'https://picsum.photos/150/100?random=45'
      }
    ]
  }
];
export const sportData = {
  bannerImage: 'https://picsum.photos/1200/400?random=50',
  mainNews: {
    title: 'Футбол боюнча дүйнө чемпионатына алты ай калды: FIFA World Cup 2026 жөнүндө баары',
    slug: 'fifa-world-cup-2026',
    image: 'https://picsum.photos/600/400?random=51',
    excerpt: 'Дүйнөлүк футболдун эң чоң мелдеши 11-июнда башталат. FIFAнын эң чоң дүйнө чемпионатына жарым жыл калды.',
    label: 'ТҮШҮНДҮРМӨ'
  },
  sideNews: [
    {
      title: 'Сурякумар жана Гилл Индиянын T20 дүйнө кубогундагы формасын кайтарууга даяр',
      slug: 'india-t20',
      image: 'https://picsum.photos/200/150?random=52'
    },
    {
      title: 'Күйөрмандар FIFAны сынга алышты: 2026 дүйнө кубогунун билеттери өтө кымбат',
      slug: 'fifa-tickets',
      image: 'https://picsum.photos/200/150?random=53'
    },
    {
      title: 'Палестина Сауд Аравиясынан FIFA Arab Cup Qatar 2025 чейрек финалында утулду',
      slug: 'palestine-saudi',
      image: 'https://picsum.photos/200/150?random=54'
    },
    {
      title: 'Олимпиада чемпиону Мишель Гизин Швейцариядагы кырсыктан кийин тик учакка алынды',
      slug: 'michelle-gisin',
      image: 'https://picsum.photos/200/150?random=55'
    }
  ]
};

export const categoryColumnsData = [
  {
    title: 'Технология',
    slug: 'tech',
    mainNews: {
      title: 'Жаңы курстар медициналык технология боюнча адистерди даярдайт',
      slug: 'medical-tech-courses',
      image: 'https://picsum.photos/400/250?random=60',
      excerpt: 'Жаңы квалификациялар адамдарды кийилүүчү технология жана диагностикалык куралдар менен иштөөгө үйрөтөт.'
    },
    links: [
      { title: 'AI терапия чатботу "эмоция менен жакшы иштейт"', slug: 'ai-therapy', isVideo: false },
      { title: 'Быйылкы Game Awards жеңүүчүлөрү', slug: 'game-awards', isVideo: true },
      { title: 'ScotRail AI диктор талашынан кийин жаңы үн киргизди', slug: 'scotrail-ai', isVideo: true }
    ]
  },
  {
    title: 'Илим жана Ден-соолук',
    slug: 'science-health',
    mainNews: {
      title: 'Франциядан 5000 жыл мурунку деңиз түбүндөгү дубал табылды',
      slug: 'undersea-wall',
      image: 'https://picsum.photos/400/250?random=61',
      excerpt: '120 метрлик дубал балык кармоочу же деңиз деңгээлинин көтөрүлүшүнөн коргоочу болгон деп археологдор эсептейт.'
    },
    links: [
      { title: 'Грипп жана иш таштоолордун "кош соккусу" бейтаптарга коркунуч туудурат', slug: 'flu-strikes', isVideo: false },
      { title: 'АКШ Европа жана Азияда колдонулган күнгө каршы ингредиент кошууну пландап жатат', slug: 'sunscreen', isVideo: false },
      { title: 'Covid океандын үнүн кантип өзгөрттү', slug: 'covid-ocean', isVideo: false }
    ]
  },
  {
    title: 'Маданият',
    slug: 'culture',
    mainNews: {
      title: 'Жазуучу Жоанна Троллоп 82 жашында дүйнөдөн кайтты',
      slug: 'joanna-trollope',
      image: 'https://picsum.photos/400/250?random=62',
      excerpt: 'Жазуучу Англиянын айыл жериндеги романтика жана интригалар жөнүндөгү окуялары менен белгилүү болгон.'
    },
    links: [
      { title: 'Primal Scream антисемиттик сүрөт боюнча концерт залынын кечирим сурашы', slug: 'primal-scream', isVideo: false },
      { title: 'Комик Стэнли Бакстер 99 жашында дүйнөдөн кайтты', slug: 'stanley-baxter', isVideo: false },
      { title: 'Eurovision жеңүүчүсү Немо Израилге каршылык билдирип трофейин кайтарды', slug: 'nemo-eurovision', isVideo: false }
    ]
  },
  {
    title: 'Искусство',
    slug: 'arts',
    mainNews: {
      title: 'Кыйшык айнек мунарадан алтын балык скульптурасына - Фрэнк Геринин эң белгилүү эмгектери',
      slug: 'frank-gehry',
      image: 'https://picsum.photos/400/250?random=63',
      excerpt: 'Архитектуранын эң провокациялык жана чыгармачыл күчтөрүнүн бири катары Фрэнк Гери бүткүл дүйнөдө кызыктуу имараттарды жаратты.'
    },
    links: [
      { title: 'Сашико: окуялар тигүү өнөрү', slug: 'sashiko', isVideo: true },
      { title: 'Байыркы аялдар секс жөнүндө эмне ойлошкон', slug: 'ancient-women', isVideo: false },
      { title: '80-жылдардагы Рождество ТВ коркунучу Британияны титиретти', slug: 'christmas-horror', isVideo: false }
    ]
  }
];