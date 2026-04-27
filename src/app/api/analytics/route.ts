// app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

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
    default: // week
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }

  const startDateStr = startDate.toISOString().split('T')[0]; // "2026-04-20"

  try {
    // Мезгил ичиндеги dailyStat документтери
    const dailyStats: Array<{ date: string; totalViews: number; countryViews?: Record<string, number> }> =
      await client.fetch(
        `*[_type == "dailyStat" && date >= $startDate] | order(date asc)`,
        { startDate: startDateStr }
      );

    // Жалпы көрүүлөр
    const totalViews = dailyStats.reduce((sum, d) => sum + (d.totalViews || 0), 0);

    // Күн боюнча статистика
    const dailyStatsResult = dailyStats.map((d) => ({
      date: d.date,
      count: d.totalViews || 0,
    }));

    // Өлкө боюнча статистика
    const countryTotals: Record<string, number> = {};
    for (const d of dailyStats) {
      for (const [country, count] of Object.entries(d.countryViews || {})) {
        countryTotals[country] = (countryTotals[country] || 0) + (count as number);
      }
    }
    const countryStats = Object.entries(countryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));

    // Эң популярдуу посттор (viewCount боюнча)
    const topPosts = await client.fetch(
      `*[_type == "post" && defined(viewCount) && viewCount > 0]
        | order(viewCount desc)[0...20] {
          _id,
          title,
          slug,
          publishedAt,
          viewCount,
          "category": categories[0]->title,
          mainImage { asset-> { url } }
        }`
    );

    return NextResponse.json({
      period,
      totalViews,
      topPosts: topPosts.map((p: any) => ({ ...p, views: p.viewCount })),
      dailyStats: dailyStatsResult,
      countryStats,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Ката чыкты' }, { status: 500 });
  }
}
