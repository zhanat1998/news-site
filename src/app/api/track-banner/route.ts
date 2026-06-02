import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/client';

export async function POST(request: NextRequest) {
  try {
    const { adId, advertiser, placement, eventType } = await request.json();

    if (!adId || !eventType) {
      return NextResponse.json({ error: 'adId жана eventType керек' }, { status: 400 });
    }

    const date = new Date().toISOString().split('T')[0];
    const statId = `bannerStat-${adId}-${date}`;
    const field = eventType === 'click' ? 'clicks' : 'views';

    await writeClient
      .createIfNotExists({
        _id: statId,
        _type: 'bannerStat',
        date,
        adId,
        advertiser: advertiser || 'Unknown',
        placement: placement || 'unknown',
        views: 0,
        clicks: 0,
      })
      .then(() =>
        writeClient
          .patch(statId)
          .inc({ [field]: 1 })
          .commit()
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track banner error:', error);
    return NextResponse.json({ error: 'Ката чыкты' }, { status: 500 });
  }
}
