import Link from 'next/link';
import { categories } from '@/constants';

export default function NavLinksList({ className }: { className?: string }) {
  return (
    <>
      {categories.map(({ id, href, title }) => (
        <Link key={id} href={href} className={className ?? ''}>
          {title}
        </Link>
      ))}
    </>
  );
}