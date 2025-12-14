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
      return NextResponse.json(
        { message: 'Bad request - no _type' },
        { status: 400 }
      );
    }

    // Тип боюнча revalidation
    switch (body._type) {
      case 'post':
        revalidateTag('posts');
        revalidateTag('breaking');  // ← КОШ
        revalidatePath('/');

        if (body.category?.slug?.current) {
          revalidatePath(`/category/${body.category.slug.current}`);
        }

        if (body.slug?.current) {
          revalidatePath(`/news`, 'layout');
        }

        console.log('Revalidated: posts, breaking, /, news');
        break;

      case 'category':
        revalidateTag('categories');
        revalidatePath('/');
        console.log('Revalidated: categories, /');
        break;

      case 'author':
        revalidateTag('authors');
        console.log('Revalidated: authors');
        break;

      default:
        // Башка типтер үчүн жалпы revalidation
        revalidatePath('/');
        console.log('Revalidated: /');
    }

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      now: Date.now(),
    });

  } catch (error: any) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// GET method — webhook тестирлөө үчүн
export async function GET() {
  return NextResponse.json({
    message: 'Revalidation endpoint is working',
    timestamp: new Date().toISOString(),
  });
}