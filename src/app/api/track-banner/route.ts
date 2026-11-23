import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/client';
import { isPlainSanityId, recordBanner } from '@/lib/stats/counterMutations';

export async function POST(request: NextRequest) {
  try {
    const { adId, advertiser, placement, eventType } = await request.json();

    if (!adId || !eventType || !isPlainSanityId(adId)) {
      return NextResponse.json({ error: 'adId жана eventType керек' }, { status: 400 });
    }

    const date = new Date().toISOString().split('T')[0];

    // Бир Sanity суроо: createIfNotExists + inc бир транзакцияда
    await recordBanner(writeClient, { adId, advertiser, placement, eventType }, date);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track banner error:', error);
    return NextResponse.json({ error: 'Ката чыкты' }, { status: 500 });
  }
}
