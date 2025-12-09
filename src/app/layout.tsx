import '../styles/globals.scss';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';

export const metadata = {
  title: 'NewsKG - Жаңылыктар',
  description: 'Кыргызстандын көз карандысыз жаңылыктар булагы',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ky">
    <body>
    <Header />
    <main>{children}</main>
    <Footer />
    </body>
    </html>
  );
}