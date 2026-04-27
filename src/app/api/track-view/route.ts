// app/api/track-view/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/client';

export async function POST(request: NextRequest) {
  try {
    const { postId, slug } = await request.json();

    if (!postId && !slug) {
      return NextResponse.json({ error: 'postId же slug керек' }, { status: 400 });
    }

    // Пост табуу
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

    const country = (
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      'Unknown'
    ).replace(/[^A-Za-z_]/g, '_'); // объект ачкычы коопсуз болсун

    const dateKey = new Date().toISOString().split('T')[0]; // "2026-04-27"
    const dailyStatId = `dailyStat-${dateKey}`;

    await Promise.all([
      // 1. Посттун viewCount'ун +1 кыл
      writeClient
        .patch(resolvedPostId)
        .setIfMissing({ viewCount: 0 })
        .inc({ viewCount: 1 })
        .commit({ autoGenerateArrayKeys: true }),

      // 2. Бүгүнкү күндүк статистиканы жаңырт (бир документ/күн)
      writeClient
        .createIfNotExists({
          _id: dailyStatId,
          _type: 'dailyStat',
          date: dateKey,
          totalViews: 0,
          countryViews: {},
        })
        .then(() =>
          writeClient
            .patch(dailyStatId)
            .setIfMissing({ countryViews: {} })
            .inc({ totalViews: 1, [`countryViews.${country}`]: 1 })
            .commit()
        ),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track view error:', error);
    return NextResponse.json({ error: 'Ката чыкты' }, { status: 500 });
  }
}
