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

    // Get post URL
    const dateSlug = body.publishedAt
      ? new Date(body.publishedAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const postUrl = `${SITE_URL}/news/${dateSlug}/${body.slug?.current}`;

    // Get image URL
    const imageUrl = body.mainImage?.asset?.url;

    // Дароо уведомление жөнөтүү
    try {
      const result = await sendPushNotification({
        title: body.title || 'Жаңылык',
        message: body.excerpt || 'Жаңы макала жарыяланды!',
        url: postUrl,
        imageUrl: imageUrl,
      });

      console.log('Push notification sent:', result);

      return NextResponse.json({
        success: true,
        message: `Notification sent for ${body.title}`,
        result,
      });
    } catch (notifError) {
      console.error('Failed to send push notification:', notifError);
      return NextResponse.json({
        success: false,
        error: 'Failed to send notification',
      });
    }

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
  });
}
