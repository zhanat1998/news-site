import '../styles/globals.scss';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import MainNavigation from "@/components/layout/MainNavigation/MainNavigation";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Metadata } from 'next';
import Image from 'next/image';
import { Noto_Sans } from 'next/font/google';
import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const YANDEX_METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

const notoSans = Noto_Sans({
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-noto-sans',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Сокол.Медиа - Кыргызстандын жаңылыктар порталы',
    template: '%s | Сокол.Медиа',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-icon.png',
  },
  description: 'Кыргызстандагы акыркы жаңылыктар, саясат, экономика, коом, спорт, маданият жана дүйнөлүк окуялар. Ишенимдүү жана оперативдүү маалымат булагы.',
  keywords: ['жаңылыктар', 'Кыргызстан', 'саясат', 'экономика', 'спорт', 'маданият', 'Бишкек', 'акыркы кабарлар', 'новости Кыргызстана'],
  authors: [{ name: 'Сокол.Медиа' }],
  creator: 'Сокол.Медиа',
  publisher: 'Сокол.Медиа',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ky_KG',
    url: siteUrl,
    siteName: 'Сокол.Медиа',
    title: 'Сокол.Медиа - Кыргызстандын жаңылыктар порталы',
    description: 'Кыргызстандагы акыркы жаңылыктар, саясат, экономика, коом, спорт, маданият жана дүйнөлүк окуялар.',
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
    title: 'Сокол.Медиа - Кыргызстандын жаңылыктар порталы',
    description: 'Кыргызстандагы акыркы жаңылыктар, саясат, экономика, коом, спорт, маданият.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: 'XjghPsMDshvIxQumQTJrUDHOdR-1SIIv8RsyZ5bmCLI',
    // Yandex Webmaster
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ky" className={notoSans.variable}>
    <body>
      {/* Google Analytics */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}

      {/* Yandex Metrika */}
      {YANDEX_METRIKA_ID && (
        <>
          <Script id="yandex-metrika" strategy="afterInteractive">
            {`
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}', 'ym');

              ym(${YANDEX_METRIKA_ID}, 'init', {
                ssr:true,
                webvisor:true,
                clickmap:true,
                ecommerce:"dataLayer",
                accurateTrackBounce:true,
                trackLinks:true
              });
            `}
          </Script>
          <noscript>
            <div>
              <img src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`} style={{ position: 'absolute', left: '-9999px' }} alt="" />
            </div>
          </noscript>
        </>
      )}

    <LanguageProvider>
      <ScrollToTop />
      <Header />
      <MainNavigation/>
      <main>{children}</main>
      <Footer />
    </LanguageProvider>
    </body>
    </html>
  );
}