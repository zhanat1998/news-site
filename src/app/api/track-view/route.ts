// app/api/track-view/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/client';
import {
  isPlainSanityId,
  recordView,
  sanitizeCountry,
  type Mutation,
} from '@/lib/stats/counterMutations';

// ONE writeClient.mutate call = ONE Sanity request
const sanityMutator = {
  mutate: (m: Mutation[]) => writeClient.mutate(m as unknown as Parameters<typeof writeClient.mutate>[0]),
};

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();

    // postId керек (slug боюнча издөө алынды: ал экинчи Sanity суроо эле)
    if (!isPlainSanityId(postId)) {
      return NextResponse.json({ error: 'postId керек' }, { status: 400 });
    }

    const country = sanitizeCountry(
      request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry')
    ); // объект ачкычы коопсуз болсун

    const dateKey = new Date().toISOString().split('T')[0]; // "2026-04-27"

    // Бир Sanity суроо: postViews + dailyStat бир транзакцияда
    await recordView(sanityMutator, postId, country, dateKey);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track view error:', error);
    return NextResponse.json({ error: 'Ката чыкты' }, { status: 500 });
  }
}
