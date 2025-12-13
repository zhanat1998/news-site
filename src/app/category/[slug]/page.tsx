// app/category/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.scss';

// Категория аталыштары
const categoryNames: Record<string, string> = {
  'politics': 'Саясат',
  'economy': 'Экономика',
  'world': 'Дүйнө',
  'sport': 'Спорт',
  'culture': 'Маданият',
  'tech': 'Технология',
  'human-rights': 'Адам укуктары',
  'conflict': 'Конфликт',
  'opinion': 'Пикир',
};

// Mock data
const mockCategoryNews = {
  // Hero - сол жак
  hero: {
    title: 'Израил ири аннексиялоо аракетинде Батыш Жээкте 19 жаңы конушту бекитти',
    excerpt: 'Палестина расмийлери Израилдин жаңы конуш планы аннексиялоону тездетип, оккупацияланган аймакта зомбулукту тереңдетет деп эскертишти.',
    slug: 'israel-settlements',
    image: 'https://picsum.photos/700/500?random=200',
    date: '12 Дек 2025',
    publishedAt: '2025-12-12'
  },

  // Орто колонка - үстү
  centerTop: {
    title: 'Эмне үчүн 27 мамлекет Европанын адам укуктары конвенциясын өзгөрткүсү келет?',
    slug: 'europe-human-rights',
    image: 'https://picsum.photos/400/250?random=201',
    date: '12 Дек 2025',
    publishedAt: '2025-12-12',
    duration: '28:58',
    source: 'Inside Story'
  },

  // Орто колонка - тизме
  centerList: [
    {
      title: 'Качкындар M23 негизги ДРК шаарын контролдогондо кошуналарынын өлтүрүлгөнүн айтышты',
      slug: 'refugees-drc',
      image: 'https://picsum.photos/150/100?random=202',
      date: '12 Дек 2025',
      publishedAt: '2025-12-12'
    },
    {
      title: 'Ымыркай ташкындаган чатырда үшүп каза болду, Байрон бороону Газаны уруп жатканда',
      slug: 'baby-storm-gaza',
      image: 'https://picsum.photos/150/100?random=203',
      date: '11 Дек 2025',
      publishedAt: '2025-12-11'
    },
    {
      title: 'Видео: Al Jazeera Камбоджанын көчүрүлгөндөр лагеринен репортаж берди',
      slug: 'cambodia-camp',
      image: 'https://picsum.photos/150/100?random=204',
      date: '11 Дек 2025',
      publishedAt: '2025-12-11',
      duration: '01:52',
      source: 'NewsFeed'
    },
  ],

  // Оң колонка - үстү
  rightTop: {
    title: 'Нобель сыйлыгынын ээси Наргес Мохаммади Иранда камакка алынды деп колдоочулар айтышты',
    slug: 'narges-mohammadi',
    image: 'https://picsum.photos/400/250?random=205',
    date: '12 Дек 2025',
    publishedAt: '2025-12-12'
  },

  // Оң колонка - тизме
  rightList: [
    {
      title: 'Венесуэла Эл аралык кылмыш сотунун Рим Статутунан чыгууну суранууда',
      slug: 'venezuela-icc',
      image: 'https://picsum.photos/150/100?random=206',
      date: '12 Дек 2025',
      publishedAt: '2025-12-12'
    },
    {
      title: 'Бута Тегеран',
      slug: 'target-tehran',
      image: 'https://picsum.photos/150/100?random=207',
      date: '11 Дек 2025',
      publishedAt: '2025-12-11',
      duration: '33:06',
      source: 'Fault Lines'
    },
    {
      title: 'Эмне үчүн Улуу Британия ЕАКУнун алкагында башпаанек укугун чектөөдө алдыда баратат?',
      slug: 'uk-asylum',
      image: 'https://picsum.photos/150/100?random=208',
      date: '11 Дек 2025',
      publishedAt: '2025-12-11',
      label: 'ТҮШҮНДҮРМӨ'
    },
  ],

  // Кошумча жаңылыктар
  moreNews: [
    {
      title: 'Газадагы качкындар бороон кырсыгына дээрлик эч нерсесиз туруштук беришти',
      slug: 'gaza-storm-refugees',
      image: 'https://picsum.photos/400/280?random=210',
      excerpt: 'Миңдеген үй-бүлөлөр суук жана нымдуу шарттарда жашоого аргасыз болушту.',
      date: '10 Дек 2025',
      publishedAt: '2025-12-10'
    },
    {
      title: 'БУУ Мьянмадагы ооруканага жасалган чабуулду айыптады',
      slug: 'un-myanmar',
      image: 'https://picsum.photos/400/280?random=211',
      excerpt: 'Аба соккусу 33 адамды өлтүрдү, анын ичинде бейтаптар жана медициналык кызматкерлер.',
      date: '10 Дек 2025',
      publishedAt: '2025-12-10'
    },
    {
      title: 'Сирия качкындары: "Биз үйгө кайтууну каалайбыз"',
      slug: 'syria-refugees',
      image: 'https://picsum.photos/400/280?random=212',
      excerpt: 'Миллиондогон сирияликтер согуштан качкандан кийин туулган жерине кайтууну кыялданышат.',
      date: '9 Дек 2025',
      publishedAt: '2025-12-09'
    },
    {
      title: 'Украинада жарандык инфраструктурага соккулар улантууда',
      slug: 'ukraine-infrastructure',
      image: 'https://picsum.photos/400/280?random=213',
      excerpt: 'Россиянын ракета соккулары энергетикалык объекттерди бутага алууда.',
      date: '9 Дек 2025',
      publishedAt: '2025-12-09'
    },
    {
      title: 'Афганстандагы аялдардын укуктары чектелүүдө',
      slug: 'afghanistan-women',
      image: 'https://picsum.photos/400/280?random=214',
      excerpt: 'Талибан өкмөтү аялдарга карата жаңы чектөөлөрдү киргизди.',
      date: '8 Дек 2025',
      publishedAt: '2025-12-08'
    },
    {
      title: 'Йемендеги гуманитардык кризис начарлоодо',
      slug: 'yemen-crisis',
      image: 'https://picsum.photos/400/280?random=215',
      excerpt: 'Миллиондогон адамдар тамак-аш жетишсиздигине дуушар болууда.',
      date: '8 Дек 2025',
      publishedAt: '2025-12-08'
    },
  ]
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categoryTitle = categoryNames[slug] || slug;
  const news = mockCategoryNews;

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Category Title */}
        <h1 className={styles.categoryTitle}>{categoryTitle}</h1>

        {/* Main Grid */}
        <div className={styles.mainGrid}>
          {/* Left - Hero */}
          <div className={styles.heroColumn}>
            <Link href={`/news/${news.hero.publishedAt}/${news.hero.slug}`} className={styles.heroCard}>
              <div className={styles.heroImage}>
                <Image src={news.hero.image} alt={news.hero.title} fill priority />
              </div>
              <div className={styles.heroAccent}></div>
              <h2 className={styles.heroTitle}>{news.hero.title}</h2>
              <p className={styles.heroExcerpt}>{news.hero.excerpt}</p>
              <time className={styles.heroDate}>{news.hero.date}</time>
            </Link>
          </div>

          {/* Center Column */}
          <div className={styles.centerColumn}>
            {/* Top Card */}
            <Link href={`/news/${news.centerTop.publishedAt}/${news.centerTop.slug}`} className={styles.topCard}>
              <div className={styles.topImage}>
                <Image src={news.centerTop.image} alt={news.centerTop.title} fill />
                {news.centerTop.duration && (
                  <span className={styles.duration}>▶ {news.centerTop.duration}</span>
                )}
              </div>
              {news.centerTop.source && (
                <span className={styles.source}>From: {news.centerTop.source}</span>
              )}
              <h3 className={styles.topTitle}>{news.centerTop.title}</h3>
              <time className={styles.topDate}>{news.centerTop.date}</time>
            </Link>

            {/* List */}
            <div className={styles.newsList}>
              {news.centerList.map((item) => (
                <Link
                  key={item.slug}
                  href={`/news/${item.publishedAt}/${item.slug}`}
                  className={styles.listCard}
                >
                  <div className={styles.listContent}>
                    {item.source && (
                      <span className={styles.listSource}>From: {item.source}</span>
                    )}
                    <h4 className={styles.listTitle}>{item.title}</h4>
                    <time className={styles.listDate}>{item.date}</time>
                  </div>
                  <div className={styles.listImage}>
                    <Image src={item.image} alt={item.title} fill />
                    {item.duration && (
                      <span className={styles.listDuration}>▶ {item.duration}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Top Card */}
            <Link href={`/news/${news.rightTop.publishedAt}/${news.rightTop.slug}`} className={styles.topCard}>
              <div className={styles.topImage}>
                <Image src={news.rightTop.image} alt={news.rightTop.title} fill />
              </div>
              <h3 className={styles.topTitle}>{news.rightTop.title}</h3>
              <time className={styles.topDate}>{news.rightTop.date}</time>
            </Link>

            {/* List */}
            <div className={styles.newsList}>
              {news.rightList.map((item) => (
                <Link
                  key={item.slug}
                  href={`/news/${item.publishedAt}/${item.slug}`}
                  className={styles.listCard}
                >
                  <div className={styles.listContent}>
                    {item.source && (
                      <span className={styles.listSource}>From: {item.source}</span>
                    )}
                    {item.label && (
                      <span className={styles.listLabel}>{item.label}</span>
                    )}
                    <h4 className={styles.listTitle}>{item.title}</h4>
                    <time className={styles.listDate}>{item.date}</time>
                  </div>
                  <div className={styles.listImage}>
                    <Image src={item.image} alt={item.title} fill />
                    {item.duration && (
                      <span className={styles.listDuration}>▶ {item.duration}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* More News Grid */}
        <section className={styles.moreSection}>
          <h2 className={styles.moreTitle}>Дагы жаңылыктар</h2>
          <div className={styles.moreGrid}>
            {news.moreNews.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.publishedAt}/${item.slug}`}
                className={styles.moreCard}
              >
                <div className={styles.moreImage}>
                  <Image src={item.image} alt={item.title} fill />
                </div>
                <h3 className={styles.moreCardTitle}>{item.title}</h3>
                <p className={styles.moreExcerpt}>{item.excerpt}</p>
                <time className={styles.moreDate}>{item.date}</time>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// SEO Metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const categoryTitle = categoryNames[slug] || slug;

  return {
    title: `${categoryTitle} - Сокол Медиа`,
    description: `${categoryTitle} боюнча акыркы жаңылыктар жана макалалар`,
  };
}