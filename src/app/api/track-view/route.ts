// app/api/track-view/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/client';

export async function POST(request: NextRequest) {
  try {
    const { postId, slug } = await request.json();

    if (!postId && !slug) {
      return NextResponse.json({ error: 'postId же slug керек' }, { status: 400 });
    }

    // Пост табуу (slug же id менен)
    let resolvedPostId = postId;
    if (!postId && slug) {
      const post = await writeClient.fetch(
        `*[_type == "post" && slug.current == $slug][0]{ _id }`,
        { slug }
      );
      if (!post) {
        return NextResponse.json({ error: 'Пост табылган жок' }, { status: 404 });
      }
      resolvedPostId = post._id;
    }

    // User маалыматтары
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';

    // Геолокация (Vercel headers)
    const country = request.headers.get('x-vercel-ip-country') ||
                    request.headers.get('cf-ipcountry') ||
                    'Unknown';

    // Жаңы pageView түзүү
    await writeClient.create({
      _type: 'pageView',
      post: {
        _type: 'reference',
        _ref: resolvedPostId,
      },
      viewedAt: new Date().toISOString(),
      userAgent: userAgent.substring(0, 500), // Узундугун чектөө
      referer: referer.substring(0, 500),
      country,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track view error:', error);
    return NextResponse.json({ error: 'Ката чыкты' }, { status: 500 });
  }
}