// app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

// Секреттүү ачкыч - .env файлынан алынат
const ANALYTICS_SECRET = process.env.NEXT_PUBLIC_ANALYTICS_SECRET || '';

export async function GET(request: NextRequest) {
  // Секреттүү ачкычты текшерүү
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== ANALYTICS_SECRET) {
    return NextResponse.json({ error: 'Уруксат жок' }, { status: 401 });
  }

  const period = request.nextUrl.searchParams.get('period') || 'week';

  // Убакыт аралыгын эсептөө
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  const startDateISO = startDate.toISOString();

  try {
    // Жалпы көрүүлөр
    const totalViews = await client.fetch(
      `count(*[_type == "pageView" && viewedAt >= $startDate])`,
      { startDate: startDateISO }
    );

    // Эң популярдуу посттор
    const topPosts = await client.fetch(
      `*[_type == "pageView" && viewedAt >= $startDate] {
        "postId": post._ref
      } | order(postId) {
        postId
      }`,
      { startDate: startDateISO }
    );

    // Посттор боюнча топтоо
    const postCounts: Record<string, number> = {};
    topPosts.forEach((view: { postId: string }) => {
      postCounts[view.postId] = (postCounts[view.postId] || 0) + 1;
    });

    // Топ 20 пост ID'лери
    const sortedPosts = Object.entries(postCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    const topPostIds = sortedPosts.map(([id]) => id);

    // Пост маалыматтарын алуу
    const postsData = await client.fetch(
      `*[_type == "post" && _id in $ids] {
        _id,
        title,
        slug,
        publishedAt,
        "category": categories[0]->title,
        mainImage { asset-> { url } }
      }`,
      { ids: topPostIds }
    );

    // Пост маалыматтарын көрүү саны менен бириктирүү
    const topPostsWithViews = sortedPosts.map(([id, views]) => {
      const post = postsData.find((p: any) => p._id === id);
      return {
        ...post,
        views,
      };
    }).filter(p => p.title);

    // Күнү боюнча статистика
    const viewsByDay = await client.fetch(
      `*[_type == "pageView" && viewedAt >= $startDate] {
        "day": viewedAt
      }`,
      { startDate: startDateISO }
    );

    // Күндөр боюнча топтоо
    const dailyStats: Record<string, number> = {};
    viewsByDay.forEach((view: { day: string }) => {
      const day = view.day.split('T')[0];
      dailyStats[day] = (dailyStats[day] || 0) + 1;
    });

    // Өлкө боюнча статистика
    const viewsByCountry = await client.fetch(
      `*[_type == "pageView" && viewedAt >= $startDate && country != null] {
        country
      }`,
      { startDate: startDateISO }
    );

    const countryStats: Record<string, number> = {};
    viewsByCountry.forEach((view: { country: string }) => {
      const country = view.country || 'Unknown';
      countryStats[country] = (countryStats[country] || 0) + 1;
    });

    const sortedCountries = Object.entries(countryStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));

    return NextResponse.json({
      period,
      totalViews,
      topPosts: topPostsWithViews,
      dailyStats: Object.entries(dailyStats)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      countryStats: sortedCountries,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Ката чыкты' }, { status: 500 });
  }
}