// components/PortableTextComponents.tsx
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

const components = {
  types: {
    image: ({ value }: any) => (
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <Image
          src={urlFor(value).width(800).url()}
          alt={value.alt || ''}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

export default function CustomPortableText({ value }: { value: any }) {
  return <PortableText value={value} components={components} />;
}