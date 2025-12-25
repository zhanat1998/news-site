import { NextRequest, NextResponse } from 'next/server';
import { sendPushNotification } from '@/lib/onesignal';

const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';

// Sanity webhook payload type
interface SanityWebhookPayload {
  _id: string;
  _type: string;
  title?: string;
  slug?: { current: string };
  excerpt?: string;
  mainImage?: {
    asset?: {
      url?: string;
    };
  };
  publishedAt?: string;
  sendPushNotification?: boolean;
}

// Store for scheduled notifications (in production, use Redis or database)
const scheduledNotifications = new Map<string, NodeJS.Timeout>();

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const secret = request.headers.get('x-sanity-webhook-secret');
    if (WEBHOOK_SECRET && secret !== WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: SanityWebhookPayload = await request.json();

    // Only process posts
    if (body._type !== 'post') {
      return NextResponse.json({ message: 'Skipped: not a post' });
    }

    // Check if push notification is enabled
    if (!body.sendPushNotification) {
      return NextResponse.json({ message: 'Skipped: sendPushNotification is false' });
    }

    // Check if already scheduled
    if (scheduledNotifications.has(body._id)) {
      clearTimeout(scheduledNotifications.get(body._id));
      scheduledNotifications.delete(body._id);
    }

    // Get post URL
    const dateSlug = body.publishedAt
      ? new Date(body.publishedAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const postUrl = `${SITE_URL}/news/${dateSlug}/${body.slug?.current}`;

    // Get image URL
    const imageUrl = body.mainImage?.asset?.url;

    // Schedule notification for 5 minutes later
    const DELAY_MS = 5 * 60 * 1000; // 5 minutes

    const timeoutId = setTimeout(async () => {
      try {
        const result = await sendPushNotification({
          title: 'Жаңы макала: ' + (body.title || 'Жаңылык'),
          message: body.excerpt || body.title || 'Жаңы макала жарыяланды!',
          url: postUrl,
          imageUrl: imageUrl,
        });

        console.log('Push notification sent:', result);
        scheduledNotifications.delete(body._id);
      } catch (error) {
        console.error('Failed to send push notification:', error);
        scheduledNotifications.delete(body._id);
      }
    }, DELAY_MS);

    scheduledNotifications.set(body._id, timeoutId);

    return NextResponse.json({
      success: true,
      message: `Notification scheduled for ${body.title}`,
      scheduledFor: new Date(Date.now() + DELAY_MS).toISOString(),
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'push-notifications',
    scheduledCount: scheduledNotifications.size,
  });
}
