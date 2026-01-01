import { NextRequest, NextResponse } from 'next/server';
import { sanityFetch } from '@/sanity/lib/client';

const suggestionsQuery = `
  *[_type == "post" && title match $searchQuery] | order(publishedAt desc) [0...8] {
    _id,
    title,
    "slug": slug.current,
    publishedAt
  }
`;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const results = await sanityFetch<any[]>({
      query: suggestionsQuery,
      params: { searchQuery: `${query}*` },
      tags: ['posts'],
      revalidate: 60,
    });

    return NextResponse.json({ suggestions: results });
  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}