// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Strapi webhook body type
interface StrapiWebhookBody {
  event?: string;
  model?: string;
  entry?: Record<string, unknown>;
}

// Бардык кэшти тазалоо функциясы
function revalidateAll() {
  // Бардык тегдерди revalidate
  revalidateTag('posts');
  revalidateTag('breaking');
  revalidateTag('categories');
  revalidateTag('authors');
  revalidateTag('videos');
  revalidateTag('instagram');
  revalidateTag('tiktok');
  revalidateTag('hero');
  revalidateTag('ads');

  // Бардык негизги жолдорду revalidate (page типи менен)
  revalidatePath('/', 'page');
  revalidatePath('/news', 'page');
  revalidatePath('/category', 'page');
  revalidatePath('/video', 'page');

  // Layout да revalidate
  revalidatePath('/', 'layout');
}

export async function POST(request: NextRequest) {
  try {
    // Secret текшерүү
    const secret = request.headers.get('x-sanity-webhook-secret');

    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      console.log('Invalid webhook secret, received:', secret);
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Strapi webhook body
    let body: StrapiWebhookBody = {};
    try {
      body = await request.json();
    } catch {
      // Body жок болсо да иштейт
    }

    console.log('Webhook received:', body);

    // Strapi event же model бар болсо
    const model = body?.model;

    if (model) {
      switch (model) {
        case 'post':
        case 'video':
          revalidateAll();
          console.log(`Revalidated: ALL (${model} change)`);
          break;
        case 'category':
          revalidateTag('categories');
          revalidatePath('/', 'layout');
          revalidatePath('/category', 'layout');
          console.log('Revalidated: categories');
          break;
        case 'ad':
          revalidateTag('ads');
          revalidatePath('/', 'page');
          console.log('Revalidated: ads');
          break;
        default:
          revalidateAll();
          console.log('Revalidated: ALL (unknown model)');
      }
    } else {
      // Model жок болсо баарын revalidate
      revalidateAll();
      console.log('Revalidated: ALL');
    }

    return NextResponse.json({
      revalidated: true,
      model: model || 'all',
      event: body?.event || 'manual',
      now: Date.now(),
    });

  } catch (error: unknown) {
    console.error('Revalidation error:', error);
    // Ката болсо да баарын revalidate кылып кой
    try {
      revalidateAll();
    } catch {
      // ignore
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message, revalidated: true },
      { status: 200 } // 200 кайтар, ката болсо да
    );
  }
}

// GET method — кол менен revalidate кылуу үчүн
// Колдонуу: /api/revalidate?secret=sokol-media-webhook-secret-2024
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret === process.env.SANITY_WEBHOOK_SECRET) {
    revalidateAll();
    return NextResponse.json({
      revalidated: true,
      message: 'All caches cleared',
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    message: 'Revalidation endpoint is working. Add ?secret=YOUR_SECRET to force revalidate.',
    timestamp: new Date().toISOString(),
  });
}