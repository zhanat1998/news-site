import { NextRequest, NextResponse } from 'next/server';
import { sendPushNotification } from '@/lib/onesignal';

const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// Sanity webhook payload type
interface SanityWebhookPayload {
  _id: string;
  _type: string;
  title?: string;
  slug?: { current: string };
  excerpt?: string;
  mainImage?: {
    asset?: {
      _ref?: string;
      url?: string;
    };
  };
  publishedAt?: string;
  sendPushNotification?: boolean;
}

// Sanity image reference'ти URL'га айландыруу
function sanityImageUrl(ref?: string): string | undefined {
  if (!ref) return undefined;
  // ref format: image-{id}-{dimensions}-{format}
  // example: image-b287e2542185cf2a40052afee1c3fa358e210266-1474x820-png
  const match = ref.match(/^image-([a-zA-Z0-9]+)-(\d+x\d+)-(\w+)$/);
  if (!match) return undefined;
  const [, id, dimensions, format] = match;
  return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${format}`;
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const secret = request.headers.get('x-sanity-webhook-secret');
    if (WEBHOOK_SECRET && secret !== WEBHOOK_SECRET) {
      console.log('Webhook unauthorized: secret mismatch');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: SanityWebhookPayload = await request.json();
    console.log('Webhook received:', JSON.stringify(body, null, 2));

    // Only process posts
    if (body._type !== 'post') {
      console.log('Skipped: not a post, type:', body._type);
      return NextResponse.json({ message: 'Skipped: not a post' });
    }

    // Check if push notification is enabled
    if (!body.sendPushNotification) {
      console.log('Skipped: sendPushNotification is false');
      return NextResponse.json({ message: 'Skipped: sendPushNotification is false' });
    }

    // Get post URL
    const dateSlug = body.publishedAt
      ? new Date(body.publishedAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const postUrl = `${SITE_URL}/news/${dateSlug}/${body.slug?.current}`;

    // Get image URL - webhook'тон же reference'тен
    const imageUrl = body.mainImage?.asset?.url || sanityImageUrl(body.mainImage?.asset?._ref);

    console.log('Preparing notification:', {
      title: body.title,
      postUrl,
      imageUrl,
      hasOneSignalAppId: !!process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
      hasOneSignalKey: !!process.env.ONESIGNAL_REST_API_KEY,
    });

    // Дароо уведомление жөнөтүү
    const result = await sendPushNotification({
      title: body.title || 'Жаңылык',
      message: body.excerpt || 'Жаңы макала жарыяланды!',
      url: postUrl,
      imageUrl: imageUrl,
    });

    console.log('Push notification result:', result);

    if (result.errors) {
      return NextResponse.json({
        success: false,
        errors: result.errors,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Notification sent for ${body.title}`,
      result,
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
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
