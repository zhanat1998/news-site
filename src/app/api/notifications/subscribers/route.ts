import { NextRequest, NextResponse } from 'next/server';
import { getSubscribersCount, getSubscribers } from '@/lib/onesignal';

// Get subscribers count and list
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get('detailed') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (detailed) {
      // Get detailed subscriber list
      const data = await getSubscribers(limit, offset);
      return NextResponse.json({
        subscribers: data.subscribers.map((sub: any) => ({
          id: sub.id,
          device_type: sub.device_type,
          created_at: sub.created_at,
          last_active: sub.last_active,
          language: sub.language,
        })),
        total: data.total,
        limit,
        offset,
      });
    } else {
      // Just get count
      const count = await getSubscribersCount();
      return NextResponse.json({
        count,
        message: `${count} подписчик бар`,
      });
    }
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}
