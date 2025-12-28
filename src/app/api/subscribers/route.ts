import { NextRequest, NextResponse } from 'next/server';

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

export async function GET(request: NextRequest) {
  if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
    return NextResponse.json(
      { error: 'OneSignal credentials not configured' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get subscribers list
    const playersResponse = await fetch(
      `https://onesignal.com/api/v1/players?app_id=${ONESIGNAL_APP_ID}&limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`,
        },
      }
    );

    const playersData = await playersResponse.json();

    // Get app info for total count
    const appResponse = await fetch(
      `https://onesignal.com/api/v1/apps/${ONESIGNAL_APP_ID}`,
      {
        headers: {
          'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`,
        },
      }
    );

    const appData = await appResponse.json();

    // Format subscribers data
    const subscribers = (playersData.players || []).map((player: any) => ({
      id: player.id,
      createdAt: player.created_at,
      lastActive: player.last_active,
      deviceType: getDeviceType(player.device_type),
      deviceModel: player.device_model,
      deviceOs: player.device_os,
      timezone: player.timezone,
      country: player.country,
      city: player.ip ? 'Hidden' : null,
      subscribed: player.notification_types > 0,
      sessionCount: player.session_count,
    }));

    return NextResponse.json({
      subscribers,
      total: appData.players || playersData.total_count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

function getDeviceType(type: number): string {
  const types: Record<number, string> = {
    0: 'iOS',
    1: 'Android',
    2: 'Amazon',
    3: 'WindowsPhone',
    4: 'Chrome Apps',
    5: 'Chrome Web',
    6: 'Windows',
    7: 'Safari',
    8: 'Firefox',
    9: 'macOS',
    10: 'Alexa',
    11: 'Email',
    12: 'Edge',
    13: 'SMS',
  };
  return types[type] || 'Unknown';
}