import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function POST(request: Request) {
  try {
    const { categorySlug, offset, limit } = await request.json();

    const query = `*[_type == "post" && $categorySlug in categories[]->slug.current]
      | order(publishedAt desc) [$offset...($offset + $limit)] {
      title,
      excerpt,
      slug,
      mainImage {
        asset -> { url },
        alt
      },
      publishedAt
    }`;

    const posts = await client.fetch(query, {
      categorySlug,
      offset: parseInt(offset),
      limit: parseInt(limit),
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}