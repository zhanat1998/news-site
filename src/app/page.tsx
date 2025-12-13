// app/page.tsx
import styles from './page.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import {categoryColumnsData, categoryNewsData, mockVideos, sportData} from "@/constants";
import VideoCarousel from "@/components/video/VideoCarousel/VideoCarousel";
import CategoryNewsGrid from "@/components/news/CategoryNewsGrid/CategoryNewsGrid";
import SportSection from "@/components/news/SportSection/SportSection";
import CategoryColumns from "@/components/news/CategoryColumns/CategoryColumns";
import DateDisplay from "@/components/ui/DateDisplay/DateDisplay";
import {formatDateForUrl} from "@/utils/date";

// Mock data - Al Jazeera стилинде
const mockData = {
  trending: [
    { title: 'Борбор Азиядагы жаңылыктар', slug: 'central-asia' },
    { title: 'Россия-Украина согушу', slug: 'russia-ukraine' },
    { title: 'Кыргызстан саясаты', slug: 'kyrgyzstan-politics' },
    { title: 'Экономика', slug: 'economy' },
    { title: 'Дональд Трамп', slug: 'trump' },
  ],

  // Left - Hero
  heroMain: {
    title: 'Он төрт палестиналык, анын ичинде балдар, Газада Байрон бороонунда каза болду',
    excerpt: 'Израилдин согушунан качкан Газанын үй-бүлөлөрү бороон учурунда кыйроого жана үшүккө дуушар болушту.',
    slug: 'gaza-storm',
    image: 'https://picsum.photos/600/400?random=1',
    category: 'Жаңылыктар',
    publishedAt: '2025-12-13T10:30:00Z'
  },
  heroSecond: {
    title: 'БУУнун Башкы Ассамблеясы Израилге Газага жардам берүүнү талап кылган резолюция кабыл алды',
    excerpt: 'БУУга мүчө мамлекеттер ЭСКнын тыянактарын колдоп, Израилди оккупациялык милдеттерин аткарууга чакырды.',
    slug: 'un-resolution',
    image: 'https://picsum.photos/400/250?random=2',
    publishedAt: '2025-12-13T09:15:00Z'
  },

  // Center
  centerMain: {
    title: 'Трамп Таиланд менен Камбоджа өлтүрүүчү кагылышуулардан кийин согушту токтотууга макул болушту деп айтты',
    slug: 'thailand-cambodia',
    image: 'https://picsum.photos/500/300?random=3',
    publishedAt: '2025-12-13T08:45:00Z'
  },
  centerNews: [
    {
      title: 'Качкындар M23 негизги ДРК шаарын контролдогондо кошуналарынын өлтүрүлгөнүн айтышты',
      slug: 'refugees-drc',
      image: 'https://picsum.photos/150/100?random=4',
      publishedAt: '2025-12-13T07:30:00Z'
    },
    {
      title: 'Газанын көчүрүлгөндөрү бороон кырсыгына дээрлик эч нерсесиз туруштук беришти',
      slug: 'gaza-displaced',
      image: 'https://picsum.photos/150/100?random=5',
      publishedAt: '2025-12-13T06:20:00Z'
    },
  ],
  centerLinks: [
    { title: 'АКШ Конгресси Трамп жана Клинтон менен Эпштейн сүрөттөрүн жарыялады', slug: 'epstein-photos', publishedAt: '2025-12-12T22:00:00Z' },
    { title: 'ЕБ жүз миллиарддаган Россия каражаттарын түбөлүккө тоңдурду', slug: 'eu-russia-funds', publishedAt: '2025-12-12T20:30:00Z' },
    { title: '"Мадуро бийликтен кетет": Мачадо Венесуэланын жетекчилигинин өзгөрүшүн убадалады', slug: 'venezuela', publishedAt: '2025-12-12T18:45:00Z' },
    { title: 'Сакчылар Трамптын Ак үйдөгү бал залын курууну токтотуу үчүн доо коюшту', slug: 'trump-ballroom', publishedAt: '2025-12-12T16:00:00Z' },
  ],

  // Right Sidebar
  mustReads: [
    {
      title: 'Мексиканын аэрокосмос тармагы өсүүдө. USMCA карап чыгуусунда кыскарабы?',
      slug: 'mexico-aerospace',
      image: 'https://picsum.photos/100/70?random=6',
      publishedAt: '2025-12-12T14:00:00Z'
    },
    { title: '"Коркунучтуу" өлкөбү? Кылмыш тынчсыздануулары президенттик шайлоонун алдында Чилини кармады', slug: 'chile-crime', publishedAt: '2025-12-12T12:30:00Z' },
    { title: 'Россиянын күчтөрү Купянсктан "толугу менен кесилди" деп Украинанын командири айтты', slug: 'kupiansk', publishedAt: '2025-12-12T10:00:00Z' },
  ],
  moreHeadlines: [
    {
      title: 'Израил ири аннексиялоо аракетинде Батыш Жээкте 19 жаңы конушту бекитти',
      slug: 'israel-settlements',
      image: 'https://picsum.photos/100/70?random=7',
      publishedAt: '2025-12-11T23:00:00Z'
    },
    { title: 'Нобель сыйлыгынын ээси Наргес Мохаммади Иранда камакка алынды деп колдоочулар айтты', slug: 'iran-arrest', publishedAt: '2025-12-11T20:00:00Z' },
    { title: 'Eurovision жеңүүчүсү Немо Израилдин катышуусуна каршылык билдирип, трофейин кайтарды', slug: 'eurovision', publishedAt: '2025-12-11T17:00:00Z' },
  ],
  opinions: [
    {
      title: 'Жаңы Дели аба булгануусу менен күрөштө Кытайдан эмне үйрөнө алат',
      author: 'Азхар Азам',
      slug: 'delhi-pollution',
      avatar: 'https://picsum.photos/50/50?random=10',
      publishedAt: '2025-12-11T14:00:00Z'
    },
    {
      title: 'АКШ Венесуэла менен согушуп жатат',
      author: 'Белен Фернандес',
      slug: 'us-venezuela',
      avatar: 'https://picsum.photos/50/50?random=11',
      publishedAt: '2025-12-11T11:00:00Z'
    },
  ]
};

export default function Home() {
  const { trending, heroMain, heroSecond, centerMain, centerNews, centerLinks, mustReads, moreHeadlines, opinions } = mockData;

  return (
    <div className={styles.page}>
      {/* Trending Bar */}
      <div className={styles.trendingBar}>
        <div className="container">
          <div className={styles.trendingInner}>
            <span className={styles.trendingLabel}>🔥 Тренд</span>
            <div className={styles.trendingLinks}>
              {trending.map((item) => (
                <Link key={item.slug} href={`/news/${item.slug}`} className={styles.trendingLink}>
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <DateDisplay/>
        <section className={styles.heroSection}>
          {/* Left - Main Hero */}
          <div className={styles.heroLeft}>
            <Link href={`/news/${formatDateForUrl(heroMain.publishedAt)}/${heroMain.slug}`}
                className={styles.heroMainCard}>
              <div className={styles.heroMainImage}>
                <Image src={heroMain.image} alt={heroMain.title} fill priority />
              </div>
              <div className={styles.heroMainAccent}></div>
              <h1 className={styles.heroMainTitle}>{heroMain.title}</h1>
              <p className={styles.heroMainExcerpt}>{heroMain.excerpt}</p>
            </Link>

            <Link href={`/news/${formatDateForUrl(heroSecond.publishedAt)}/${heroSecond.slug}`}
                className={styles.heroSecondCard}>
              <div className={styles.heroSecondContent}>
                <h2 className={styles.heroSecondTitle}>{heroSecond.title}</h2>
                <p className={styles.heroSecondExcerpt}>{heroSecond.excerpt}</p>
              </div>
              <div className={styles.heroSecondImage}>
                <Image src={heroSecond.image} alt={heroSecond.title} fill />
              </div>
            </Link>
          </div>

          {/* Center */}
          <div className={styles.heroCenter}>
            <Link
              href={`/news/${formatDateForUrl(centerMain.publishedAt)}/${centerMain.slug}`}
              className={styles.centerMainCard}>
              <div className={styles.centerMainImage}>
                <Image src={centerMain.image} alt={centerMain.title} fill />
              </div>
              <h2 className={styles.centerMainTitle}>{centerMain.title}</h2>
            </Link>

            <div className={styles.centerNewsList}>
              {centerNews.map((news) => (
                <Link key={news.slug}
                      href={`/news/${formatDateForUrl(news.publishedAt)}/${news.slug}`}
                      className={styles.centerNewsItem}>
                  <p className={styles.centerNewsTitle}>{news.title}</p>
                  <div className={styles.centerNewsImage}>
                    <Image src={news.image} alt={news.title} fill />
                  </div>
                </Link>
              ))}
            </div>

            <div className={styles.centerLinks}>
              {centerLinks.map((link) => (
                <Link key={link.slug}
                      href={`/news/${formatDateForUrl(link.publishedAt)}/${link.slug}`}
                      className={styles.centerLink}>
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className={styles.heroRight}>
            {/* Must Reads */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>
                <span className={styles.sidebarAccent}></span>
                ОКУУ КЕРЕК
              </h3>
              {mustReads.map((item, index) => (
                <Link
                  key={item.slug}
                  href={`/news/${formatDateForUrl(item.publishedAt)}/${item.slug}`}
                  className={styles.sidebarItem}>
                  {item.image && (
                    <div className={styles.sidebarItemImage}>
                      <Image src={item.image} alt={item.title} fill />
                    </div>
                  )}
                  <p className={styles.sidebarItemTitle}>{item.title}</p>
                </Link>
              ))}
            </div>

            {/* More Headlines */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>
                <span className={styles.sidebarAccent}></span>
                ДАГЫ ЖАҢЫЛЫКТАР
              </h3>
              {moreHeadlines.map((item) => (
                <Link
                  key={item.slug}
                  href={`/news/${formatDateForUrl(item.publishedAt)}/${item.slug}`}
                  className={styles.sidebarItem}>
                  {item.image && (
                    <div className={styles.sidebarItemImage}>
                      <Image src={item.image} alt={item.title} fill />
                    </div>
                  )}
                  <p className={styles.sidebarItemTitle}>{item.title}</p>
                </Link>
              ))}
            </div>

            {/* Opinion */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>
                <span className={styles.sidebarAccent}></span>
                ПИКИР
              </h3>
              {opinions.map((item) => (
                <Link
                  key={item.slug}
                  href={`/news/${formatDateForUrl(item.publishedAt)}/${item.slug}`}
                  className={styles.opinionItem}>
                  <div className={styles.opinionAvatar}>
                    <Image src={item.avatar} alt={item.author} fill />
                  </div>
                  <div className={styles.opinionContent}>
                    <p className={styles.opinionTitle}>{item.title}</p>
                    <span className={styles.opinionAuthor}>{item.author}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
      <VideoCarousel
        title="КӨРҮҮ КЕРЕК"
        link="/video"
        items={mockVideos}
      />
      <CategoryColumns categories={categoryColumnsData} />
      <CategoryNewsGrid categories={categoryNewsData} />

      <SportSection
        bannerImage={sportData.bannerImage}
        mainNews={sportData.mainNews}
        sideNews={sportData.sideNews}
        link="/category/sport"
      />
    </div>
  );
}