import '../styles/globals.scss';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import MainNavigation from "@/components/layout/MainNavigation/MainNavigation";

export const metadata = {
  title: 'NewsKG - Жаңылыктар',
  description: 'Кыргызстандын көз карандысыз жаңылыктар булагы',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ky">
    <body>
    <Header />
    <MainNavigation/>
    <main>{children}</main>
    <Footer />
    </body>
    </html>
  );
}