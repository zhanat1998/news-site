// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Sanity webhook body type
interface SanityWebhookBody {
  _type: string;
  _id: string;
  slug?: { current: string };
  category?: { slug: { current: string } };
}

// Бардык кэшти тазалоо функциясы
function revalidateAll() {
  // Бардык тегдерди revalidate
  revalidateTag('posts');
  revalidateTag('breaking');
  revalidateTag('categories');
  revalidateTag('authors');
  revalidateTag('videos');

  // Бардык негизги жолдорду revalidate
  revalidatePath('/', 'layout');
  revalidatePath('/news', 'layout');
  revalidatePath('/category', 'layout');
  revalidatePath('/video', 'layout');
}

export async function POST(request: NextRequest) {
  try {
    // Secret текшерүү
    const secret = request.headers.get('x-sanity-webhook-secret');

    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      console.log('Invalid webhook secret');
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    const body: SanityWebhookBody = await request.json();
    console.log('Webhook received:', body);

    if (!body?._type) {
      // Эгер _type жок болсо - баарын revalidate кыл (delete учурунда)
      revalidateAll();
      return NextResponse.json({
        revalidated: true,
        type: 'all',
        now: Date.now(),
      });
    }

    // Тип боюнча revalidation
    switch (body._type) {
      case 'post':
      case 'video':
        // Бардыгын revalidate кыл - delete/create/update баары үчүн
        revalidateAll();
        console.log('Revalidated: ALL (post/video change)');
        break;

      case 'category':
        revalidateTag('categories');
        revalidatePath('/', 'layout');
        revalidatePath('/category', 'layout');
        console.log('Revalidated: categories');
        break;

      case 'author':
        revalidateTag('authors');
        revalidateTag('posts');
        revalidatePath('/', 'layout');
        console.log('Revalidated: authors, posts');
        break;

      default:
        // Башка типтер үчүн баарын revalidate
        revalidateAll();
        console.log('Revalidated: ALL (unknown type)');
    }

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      now: Date.now(),
    });

  } catch (error: any) {
    console.error('Revalidation error:', error);
    // Ката болсо да баарын revalidate кылып кой
    try {
      revalidateAll();
    } catch (e) {}
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
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