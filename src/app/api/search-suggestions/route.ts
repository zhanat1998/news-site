import { NextRequest, NextResponse } from 'next/server';
import { searchPosts } from '@/lib/strapi/api';
import { adaptPosts } from '@/lib/strapi/adapters';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const postsRaw = await searchPosts(query, 8);
    const results = adaptPosts(postsRaw).map(post => ({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      publishedAt: post.publishedAt,
    }));

    return NextResponse.json({ suggestions: results });
  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}
