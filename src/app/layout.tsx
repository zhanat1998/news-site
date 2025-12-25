import '../styles/globals.scss';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import MainNavigation from "@/components/layout/MainNavigation/MainNavigation";
import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Сокол.Медиа - Кыргызстандын жаңылыктар порталы',
    template: '%s | Сокол.Медиа',
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
  const oneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

  return (
    <html lang="ky">
    <head>
      {oneSignalAppId && (
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          defer
          strategy="afterInteractive"
        />
      )}
      {oneSignalAppId && (
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "${oneSignalAppId}",
                safari_web_id: "${process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID || ''}",
                notifyButton: {
                  enable: false,
                },
                allowLocalhostAsSecureOrigin: true,
              });
            });
          `}
        </Script>
      )}
    </head>
    <body>
    <Header />
    <MainNavigation/>
    <div className="mobile-decoration">
      <Image
        src="/new-year.png"
        alt="Жаңы жыл"
        width={1200}
        height={200}
        style={{ width: '100%', height: '70px' }}
      />
    </div>
    <main>{children}</main>
    <Footer />
    </body>
    </html>
  );
}