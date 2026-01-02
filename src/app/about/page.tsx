import { Metadata } from 'next';
import styles from './about.module.scss';
import SocialIcons from '@/components/ui/SocialIcons/SocialIcons';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';

export const metadata: Metadata = {
  title: 'Биз жөнүндө',
  description: 'Сокол.Медиа - Кыргызстандын ишенимдүү жаңылыктар порталы. Биздин максат - калкка так, оперативдүү жана объективдүү маалымат берүү.',
  keywords: ['Сокол.Медиа', 'биз жөнүндө', 'жаңылыктар порталы', 'Кыргызстан', 'редакция'],
  openGraph: {
    type: 'website',
    locale: 'ky_KG',
    url: `${siteUrl}/about`,
    title: 'Биз жөнүндө - Сокол.Медиа',
    description: 'Сокол.Медиа - Кыргызстандын ишенимдүү жаңылыктар порталы',
    siteName: 'Сокол.Медиа',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Сокол.Медиа',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Биз жөнүндө - Сокол.Медиа',
    description: 'Сокол.Медиа - Кыргызстандын ишенимдүү жаңылыктар порталы',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="container">
      <article className={styles.about}>
        <header className={styles.header}>
          <h1 className={styles.title}>Биз жөнүндө</h1>
          <p className={styles.subtitle}>Канаттын кагылышы, мезгилдин чагылышы.</p>
        </header>

        <section className={styles.section}>
          <h2>Сокол.Медиа деген эмне?</h2>
          <p>
            <strong>Сокол.Медиа</strong> — бул Кыргызстандын заманбап жаңылыктар порталы.
            Биз окурмандарыбызга так, оперативдүү жана объективдүү маалымат берүүгө
            умтулабыз. Биздин аталышыбыздагы «Сокол» — бул тездик, курчтук жана
            эркиндиктин символу.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Биздин миссиябыз</h2>
          <p>
            Коомду маанилүү окуялар жөнүндө тез жана так маалымдоо — биздин негизги
            милдетибиз. Биз журналистиканын этикалык принциптерин сактап, ар бир
            маалыматты текшерип, окурмандарыбызга ишенимдүү кабарларды жеткирүүгө
            аракеттенебиз.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Биз эмне жөнүндө жазабыз?</h2>
          <ul className={styles.list}>
            <li><strong>Саясат</strong> — ички жана тышкы саясий жаңылыктар</li>
            <li><strong>Коом</strong> — социалдык маселелер жана коомдук турмуш</li>
            <li><strong>Экономика</strong> — бизнес, финансы жана экономикалык кабарлар</li>
            <li><strong>Дүйнө</strong> — эл аралык жаңылыктар</li>
            <li><strong>Маданият</strong> — искусство, музыка, кино жана маданий окуялар</li>
            <li><strong>Спорт</strong> — спорттук жаңылыктар жана мелдештер</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Биздин баалуулуктар</h2>
          <div className={styles.values}>
            <div className={styles.value}>
              <h3>Чындык</h3>
              <p>Биз фактыларга негизделген, текшерилген маалыматтарды гана жарыялайбыз.</p>
            </div>
            <div className={styles.value}>
              <h3>Оперативдүүлүк</h3>
              <p>Жаңылыктарды биринчи болуп жеткирүүгө умтулабыз.</p>
            </div>
            <div className={styles.value}>
              <h3>Объективдүүлүк</h3>
              <p>Ар бир маселеге ар тараптуу караш менен мамиле кылабыз.</p>
            </div>
            <div className={styles.value}>
              <h3>Көз карандысыздык</h3>
              <p>Редакциялык саясатыбыз эч кандай тышкы кийлигишүүдөн эркин.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Эмне үчүн Сокол.Медиа?</h2>
          <ul className={styles.list}>
            <li><strong>24/7 жаңылыктар</strong> — Күнү-түнү актуалдуу кабарлар</li>
            <li><strong>Мультимедиа</strong> — Видео, аудио жана фото материалдар</li>
            <li><strong>Мобилдик версия</strong> — Каалаган жерден, каалаган убакта окуңуз</li>
            <li><strong>Социалдык тармактар</strong> — Instagram, Facebook, Telegram, YouTube аркылуу байланышта болуңуз</li>
            <li><strong>Профессионал команда</strong> — Тажрыйбалуу журналисттер жана редакторлор</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Биздин тарых</h2>
          <p>
            Сокол.Медиа Кыргызстандын медиа мейкиндигинде жаңы үн болуп кирди.
            Биздин максат — заманбап технологияларды колдонуп, окурмандарга сапаттуу
            жана ылдам маалымат берүү. Биз салттуу журналистиканын баалуулуктарын
            сактоо менен бирге, жаңы медиа форматтарын да өздөштүрүп келебиз.
          </p>
          <p>
            Биздин аудиториябыз — бул Кыргызстанда жана чет өлкөлөрдө жашаган
            кыргызстандыктар. Биз алар үчүн өлкөдөгү жана дүйнөдөгү маанилүү
            окуялар жөнүндө маалымат беребиз.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Редакциялык саясат</h2>
          <p>
            Биз ар бир жаңылыкты жарыялоодон мурун кылдат текшеребиз. Маалыматтын
            булагын ырастоо, фактыларды салыштыруу жана объективдүү баяндоо —
            биздин негизги принциптерибиз. Биз коммерциялык же саясий кызыкчылыктарга
            баш ийбейбиз.
          </p>
          <p>
            Эгер материалдарыбызда ката же так эмес маалымат байкасаңыз,
            бизге кабарлаңыз — биз аны оңдоого даярбыз.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Кызматташуу</h2>
          <p>
            Биз ар дайым жаңы кызматташтыктарга ачыкпыз. Эгер сизде:
          </p>
          <ul className={styles.list}>
            <li><strong>Жаңылык материалы</strong> — маанилүү окуя жөнүндө кабарлагыңыз келсе</li>
            <li><strong>Жарнама</strong> — бизнесиңизди жарнамалагыңыз келсе</li>
            <li><strong>Медиа кызматташтык</strong> — биргеликте долбоор жүргүзгүңүз келсе</li>
            <li><strong>Иш сунушу</strong> — командабызга кошулгуңуз келсе</li>
          </ul>
          <p>
            Бизге жазыңыз — бардык сунуштарды карайбыз!
          </p>
        </section>

        <section className={styles.section}>
          <h2>Байланыш</h2>
          <p>
            Бизге кайрылууларыңыз, сунуштарыңыз же жаңылык материалдарыңыз болсо,
            байланышыңыз:
          </p>
          <div className={styles.contact}>
            <p><strong>Email:</strong> <a href="mailto:info@sokol.media">info@sokol.media</a></p>
            <div className={styles.socialRow}>
              <strong>Социалдык тармактар:</strong>
              <SocialIcons />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.slogan}>
            Сокол.Медиа — сиздин ишенимдүү маалымат булагыңыз!
          </p>
        </section>
      </article>
    </div>
  );
}