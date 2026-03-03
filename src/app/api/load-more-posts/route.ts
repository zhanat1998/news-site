import { NextResponse } from 'next/server';
import { getPostsByCategory } from '@/lib/strapi/api';
import { adaptPosts } from '@/lib/strapi/adapters';

export async function POST(request: Request) {
  try {
    const { categorySlug, offset, limit } = await request.json();

    const postsRaw = await getPostsByCategory(
      categorySlug,
      parseInt(limit),
      parseInt(offset)
    );

    const posts = adaptPosts(postsRaw);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
