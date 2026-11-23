import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

// Бардык үч Sanity окуу 300 сек кэштелет (бир суроо бир мезгилге 5 мүнөттө бир гана жолу)
const CACHE = { next: { revalidate: 300, tags: ['analytics'] } };

export async function GET(request: NextRequest) {
  const period = request.nextUrl.searchParams.get('period') || 'week';

  const now = new Date();
  let startDate: Date;
  switch (period) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'month':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }

  const startDateStr = startDate.toISOString().split('T')[0];

  try {
    const [dailyStats, bannerStats, topPosts] = await Promise.all([
      // Пост көрүүлөр
      client.fetch(
        `*[_type == "dailyStat" && date >= $startDate] | order(date asc)`,
        { startDate: startDateStr },
        CACHE
      ),
      // Баннер статистика
      client.fetch(
        `*[_type == "bannerStat" && date >= $startDate] | order(date asc)`,
        { startDate: startDateStr },
        CACHE
      ),
      // Топ посттор
      client.fetch(
        `*[_type == "post"] {
          _id, title, slug, publishedAt,
          "viewCount": coalesce(viewCount, 0) + coalesce(*[_id == "postViews-" + ^._id][0].viewCount, 0),
          "category": categories[0]->title
        } | order(viewCount desc)[0...20]`,
        {},
        CACHE
      ),
    ]);

    // Жалпы пост көрүүлөр
    const totalPostViews = dailyStats.reduce((s: number, d: any) => s + (d.totalViews || 0), 0);

    // Жалпы баннер статистика
    const totalBannerViews = bannerStats.reduce((s: number, d: any) => s + (d.views || 0), 0);
    const totalBannerClicks = bannerStats.reduce((s: number, d: any) => s + (d.clicks || 0), 0);

    // Күн боюнча пост + баннер бириктирилет
    const dateMap: Record<string, { date: string; postViews: number; bannerViews: number; bannerClicks: number }> = {};

    for (const d of dailyStats as any[]) {
      if (!dateMap[d.date]) dateMap[d.date] = { date: d.date, postViews: 0, bannerViews: 0, bannerClicks: 0 };
      dateMap[d.date].postViews += d.totalViews || 0;
    }
    for (const d of bannerStats as any[]) {
      if (!dateMap[d.date]) dateMap[d.date] = { date: d.date, postViews: 0, bannerViews: 0, bannerClicks: 0 };
      dateMap[d.date].bannerViews += d.views || 0;
      dateMap[d.date].bannerClicks += d.clicks || 0;
    }

    const dailyResult = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));

    // Рекламодатель боюнча баннер статистика
    const advertiserMap: Record<string, { advertiser: string; views: number; clicks: number }> = {};
    for (const d of bannerStats as any[]) {
      const key = d.advertiser || 'Unknown';
      if (!advertiserMap[key]) advertiserMap[key] = { advertiser: key, views: 0, clicks: 0 };
      advertiserMap[key].views += d.views || 0;
      advertiserMap[key].clicks += d.clicks || 0;
    }
    const advertiserStats = Object.values(advertiserMap).sort((a, b) => b.views - a.views);

    return NextResponse.json({
      period,
      totalPostViews,
      totalBannerViews,
      totalBannerClicks,
      dailyStats: dailyResult,
      topPosts: topPosts.map((p: any) => ({ ...p, views: p.viewCount || 0 })),
      advertiserStats,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Ката чыкты' }, { status: 500 });
  }
}
