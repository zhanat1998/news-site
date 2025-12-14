// app/news/[date]/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.scss';
import RelatedNews from "@/components/news/RelatedNews/RelatedNews";
import NewsGrid from "@/components/news/NewsGrid/NewsGrid";
import {PortableText} from "@portabletext/react";
import {portableTextComponents} from "@/components/portable-text/PortableTextComponents";

// Mock data - кийин Sanity'ден келет
const mockArticle = {
  category: 'Жаңылыктар',
  subcategory: 'Конфликт',
  title: 'Мьянма аскерлери ооруканага бомба ташташкандыгын моюнга алышты',
  subtitle: 'Ооруканадагы күбөлөр жана БУУ чабуул медиктерди, бейтаптарды өлтүргөнүн жана согуш кылмышы болушу мүмкүн экенин айтышты.',
  image: 'https://picsum.photos/900/600?random=100',
  imageCaption: 'Мьянманын батыш Ракхайн штатындагы Мраук-У шаарындагы жалпы ооруканага аба соккусу 33 адамды өлтүрдү [AFP]',
  author: {
    name: 'Сокол Медиа жана Маалымат агенттиктери',
    avatar: 'https://picsum.photos/50/50?random=101'
  },
  date: '13 Дек 2025',
  content: [
    {
      type: 'paragraph',
      text: 'Мьянманын аскерлери Ракхайндин батыш штатындагы ооруканага аба соккусун бергенин моюнга алышты, бул 33 адамды өлтүрдү. Алар өлгөндөрдү оппозициялык топтордун куралдуу мүчөлөрү жана алардын колдоочулары деп айыпташты, бирок жарандык адамдар эмес.'
    },
    {
      type: 'paragraph',
      text: 'Күбөлөр, жардам кызматкерлери, козголоңчу топтор жана Бириккен Улуттар Уюму ооруканадагы курмандыктар жарандык адамдар болгонун айтышты.'
    },
    {
      type: 'heading',
      text: 'СУНУШТАЛГАН МАКАЛАЛАР'
    },
    {
      type: 'recommended',
      items: [
        { title: 'Мьянманын шаардык киллерлери: аскерлер издеген согушкерлер', slug: 'myanmar-assassins' },
        { title: 'Мьянма аскерлери онлайн алдамчылык борборуна рейд жасап, Тай чек арасында 350гө жакын адамды камады', slug: 'myanmar-scam' },
        { title: 'Трамп администрациясы Мьянма жарандары үчүн убактылуу иммиграция статусун токтотту', slug: 'trump-myanmar' },
      ]
    },
    {
      type: 'paragraph',
      text: 'Ишембиде мамлекеттик Global New Light of Myanmar гезитинде жарыяланган билдирүүдө аскердик маалымат кеңсеси этникалык Аракан Армиясы жана Элдик Коргоо Күчтөрү сыяктуу куралдуу топтор ооруканыны база катары колдонушкан деп айтты.'
    },
    {
      type: 'paragraph',
      text: 'Аскер зарыл коопсуздук чараларын көргөнүн жана шаршемби күнү Мраук-У шаарындагы жалпы ооруканага каршы терроризмге каршы операция баштаганын айтты.'
    },
    {
      type: 'paragraph',
      text: 'Бирок, Бириккен Улуттар Уюму бейшемби күнү аймакта шашылыш жардам, акушердик жана хирургиялык кызматтарды көрсөткөн мекемеге кол салууну айыптады, бул жарандык адамдарга жана жарандык объекттерге зыян келтирген соккулардын кеңири үлгүсүнүн бир бөлүгү экенин айтты.'
    },
    {
      type: 'alert',
      text: 'Кызыккан темаларыңыз боюнча тез эскертмелерди жана жаңыртууларды алыңыз. Чоң окуялар болгондо биринчилерден болуп билиңиз.',
      buttonText: 'Ооба, мени жаңыртыңыз'
    },
    {
      type: 'paragraph',
      text: 'Мьянма 2021-жылы аскерлер бийликти басып алгандан бери башаламандыкта. Аскердик бийликке каршы көптөгөн оппозиционерлер курал алышты жана өлкөнүн чоң бөлүгү азыр конфликтке тартылган.'
    }
  ],
  video: {
    thumbnail: 'https://picsum.photos/800/450?random=102',
    duration: '1:50',
    title: 'Мьянма хунтасынын ооруканага аба соккусу ондогон адамды өлтүрдү'
  },
  relatedVideos: [
    { title: 'Мьянма хунтасынын ооруканага аба соккусу ондогон адамды өлтүрдү', duration: '01:50', thumbnail: 'https://picsum.photos/200/120?random=103', slug: 'video-1', isPlaying: true },
    { title: 'Дейтон келишиминен 30 жыл өттү: миңдеген адамдар Боснияда жер которулган бойдон', duration: '02:27', thumbnail: 'https://picsum.photos/200/120?random=104', slug: 'video-2', isNext: true },
    { title: 'Дитвах циклонунун кесепеттери: Шри-Ланка армиясы ташкындаган дарыяны токтотууга аракет кылууда', duration: '02:13', thumbnail: 'https://picsum.photos/200/120?random=105', slug: 'video-3' },
    { title: 'Чили президенттик шайлоосунун экинчи туру: Мигранттар күтүлгөн катуу чараларга чейин кирүүгө аракет кылууда', duration: '03:30', thumbnail: 'https://picsum.photos/200/120?random=106', slug: 'video-4' },
    { title: 'Гондурас президенттик шайлоосу: Алдамчылык айыптоолорунун фонунда атайын кайра эсептөө жүрүүдө', duration: '02:20', thumbnail: 'https://picsum.photos/200/120?random=107', slug: 'video-5' },
  ],
  sidebar: [
    {
      title: 'Россия Украинанын эки портуна чабуулда түрк кемелерин бузду',
      image: 'https://picsum.photos/300/180?random=108',
      slug: 'russia-turkey'
    },
    {
      title: 'Камбоджанын Коргоо министрлиги Тай F-16 учактары Трамп тынчтык жарыялагандан кийин да өлкө ичиндеги бутага бомба ташташын улантууда деп билдирди',
      image: 'https://picsum.photos/300/180?random=109',
      slug: 'cambodia-thailand'
    },
    {
      title: 'Булар Россиянын Украинага каршы согушунун 1388-күнүндөгү негизги өнүгүүлөр',
      image: 'https://picsum.photos/300/180?random=110',
      slug: 'russia-ukraine-day'
    }
  ]
};
const relatedNews = [
  {
    title: 'Жаңы Камбоджа-Таиланд кагылышуусу: Трамп "токтоткон" башка согуштар менен эмне болду?',
    slug: 'trump-wars',
    image: 'https://picsum.photos/300/200?random=120',
    excerpt: 'АКШ президенти сегиз согушту токтоткондугу үчүн мактанып жатат, бирок бардык тынчтык келишимдери сакталган жок.',
    date: '2025-12-09'
  },
  {
    title: 'Сүрөттөр: Камбоджа-Таиланд чек арасындагы кагылышуулар жарым миллион адамды паанага алып кетти',
    slug: 'cambodia-photos',
    image: 'https://picsum.photos/300/200?random=121',
    excerpt: 'Талаштуу чек аралдагы кагылышуулар 11 адамды өлтүрдү жана жүздөгөн миңдегендерди көчүрдү.',
    date: '2025-12-10',
    photoCount: 7
  },
  {
    title: 'Камбоджа-Таиланд чыңалуусу "жамандан жаманга карай баратат"',
    slug: 'tension-worse',
    image: 'https://picsum.photos/300/200?random=122',
    excerpt: '"Ким биринчи аткандыгына карабастан, алар токтошу керек."',
    date: '2025-12-11',
    duration: '01:11',
    source: 'Quotable'
  },
  {
    title: 'Таиланддын премьер-министри парламентти таркатууга өттү, шайлооого жол ачты',
    slug: 'thailand-parliament',
    image: 'https://picsum.photos/300/200?random=123',
    excerpt: 'Мыйзам чыгаруу тоскоолдугу жана чек ара согушу Таиландды коомчулуктун басымынын астында мөөнөтүнөн мурда шайлоого мажбурлады.',
    date: '2025-12-11'
  }
];

const moreFromNews = [
  {
    title: 'Виртуалдык реалдуулук Израилдин согушунда жарадар болгон Газа балдарына качууну сунуштайт',
    slug: 'vr-gaza',
    image: 'https://picsum.photos/200/140?random=130',
    date: '2025-12-13'
  },
  {
    title: 'Колумбиянын ELN козголоңчулары Трамптын "кийлигишүү" коркунучунун фонунда салгылашууга даярданууда',
    slug: 'colombia-eln',
    image: 'https://picsum.photos/200/140?random=131',
    date: '2025-12-13'
  },
  {
    title: 'Түндүк Кореянын Ким Украинадагы согушта курман болгон жоокерлерге "баатыр" наамын ыйгарды',
    slug: 'north-korea-kim',
    image: 'https://picsum.photos/200/140?random=132',
    date: '2025-12-12'
  },
  {
    title: 'Мьянма аскерлери куралдуу топтор бомбалаган ооруканасын колдонушкан деп айтышты',
    slug: 'myanmar-hospital',
    image: 'https://picsum.photos/200/140?random=133',
    date: '2025-12-12'
  }
];

const mostPopular = [
  {
    title: 'АКШ күчтөрү Кытайдан Иранга бараткан жүк ташуучу кемени басып алды: Отчет',
    slug: 'us-cargo-ship',
    image: 'https://picsum.photos/200/140?random=140',
    date: '2025-12-13'
  },
  {
    title: 'Россия Украинанын эки портуна чабуулда түрк кемелерин бузду',
    slug: 'russia-turkey-ships',
    image: 'https://picsum.photos/200/140?random=141',
    date: '2025-12-13'
  },
  {
    title: 'Россиянын күчтөрү Купянсктан "толугу менен кесилди" деп Украинанын командири айтты',
    slug: 'kupiansk-cut-off',
    image: 'https://picsum.photos/200/140?random=142',
    date: '2025-12-12'
  },
  {
    title: 'Венесуэла Эл аралык кылмыш сотунун Рим Статутунан чыгууну суранууда',
    slug: 'venezuela-icc',
    image: 'https://picsum.photos/200/140?random=143',
    date: '2025-12-12'
  }
];

type Props = {
  params: { date: string; slug: string };
};

export default function NewsDetailPage({ params }: Props) {
  const { date, slug } = params;
  const article = mockArticle;

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.layout}>
          {/* Main Content */}
          <article className={styles.article}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
              <Link href="/news">{article.category}</Link>
              <span className={styles.separator}>|</span>
              <Link href={`/category/${article.subcategory.toLowerCase()}`}>{article.subcategory}</Link>
            </div>

            {/* Title */}
            <h1 className={styles.title}>{article.title}</h1>

            {/* Subtitle */}
            <p className={styles.subtitle}>{article.subtitle}</p>

            {/* Main Image */}
            <figure className={styles.mainFigure}>
              <div className={styles.mainImage}>
                <Image src={article.image} alt={article.title} fill priority />
              </div>
              <figcaption className={styles.imageCaption}>{article.imageCaption}</figcaption>
            </figure>

            {/* Author & Meta */}
            <div className={styles.meta}>
              <div className={styles.author}>
                <div className={styles.authorAvatar}>
                  <Image src={article.author.avatar} alt={article.author.name} fill />
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorBy}>By</span>
                  <span className={styles.authorName}>{article.author.name}</span>
                </div>
              </div>
              <time className={styles.date}>{article.date}</time>
            </div>

            {/* Share Buttons */}
            <div className={styles.shareButtons}>
              <button className={styles.shareBtn}>
                <span>↗</span> Бөлүшүү
              </button>
              <button className={styles.saveBtn}>
                <span>🔖</span> Сактоо
              </button>
            </div>

            {/* Content */}
            <div className={styles.content}>
              <div className={styles.content}>
                {/*<PortableText*/}
                {/*  value={article.body}*/}
                {/*  components={portableTextComponents}*/}
                {/*/>*/}
              </div>
              {article.content.map((block, index) => {
                if (block.type === 'paragraph') {
                  return <p key={index}>{block.text}</p>;
                }
                if (block.type === 'heading') {
                  return <h2 key={index} className={styles.sectionHeading}>{block.text}</h2>;
                }
                if (block.type === 'recommended') {
                  return (
                    <ul key={index} className={styles.recommendedList}>
                      {block.items?.map((item, i) => (
                        <li key={i}>
                          <Link href={`/news/${date}/${item.slug}`}>{item.title}</Link>
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (block.type === 'alert') {
                  return (
                    <div key={index} className={styles.alertBox}>
                      <div className={styles.alertIcon}>🔔</div>
                      <div className={styles.alertContent}>
                        <p>{block.text}</p>
                        <button className={styles.alertButton}>{block.buttonText}</button>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Video Section */}
            <div className={styles.videoSection}>
              <div className={styles.mainVideo}>
                <div className={styles.videoThumbnail}>
                  <Image src={article.video.thumbnail} alt={article.video.title} fill />
                  <div className={styles.playButton}>▶</div>
                  <div className={styles.videoDuration}>
                    <span>▶</span> {article.video.duration}
                  </div>
                  <div className={styles.videoProgress}></div>
                </div>
              </div>
            </div>
            <RelatedNews items={relatedNews} />

            <NewsGrid title="ЖАҢЫЛЫКТАРДАН ДАГЫ" items={moreFromNews} />

            <NewsGrid title="ЭҢ ПОПУЛЯРДУУ" items={mostPopular} />
          </article>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {article.sidebar.map((item, index) => (
              <Link key={index} href={`/news/${date}/${item.slug}`} className={styles.sidebarCard}>
                <div className={styles.sidebarImage}>
                  <Image src={item.image} alt={item.title} fill />
                  <div className={styles.sidebarLogo}>С</div>
                </div>
                <p className={styles.sidebarTitle}>{item.title}</p>
                <button className={styles.readMoreBtn}>Read More</button>
              </Link>
            ))}

            {/* Advertisement */}
            <div className={styles.adSection}>
              <span className={styles.adLabel}>Жарнама</span>
              <div className={styles.adBanner}>
                <Image src="https://picsum.photos/300/250?random=111" alt="Ad" fill />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}