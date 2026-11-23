// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { after, NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import {
  isSkipped,
  lookupId,
  modelOf,
  planRevalidation,
  revalidateAllPlan,
  slugOf,
  type RevalidationPlan,
  type WebhookBody,
} from '@/lib/revalidation/plan';

// The delayed second purge runs after the response; allow the function to live that long.
export const maxDuration = 60;

// Sanity API CDN may still serve the old result for a few seconds after a publish.
// With a 12 h ISR window a stale re-render would stick, so purge again after this delay.
const SECOND_PURGE_DELAY_MS = 15_000;

function purge(plan: RevalidationPlan) {
  for (const tag of plan.tags) revalidateTag(tag);
  for (const { path, type } of plan.paths) revalidatePath(path, type);
}

function purgeAgainLater(plan: RevalidationPlan) {
  after(async () => {
    await new Promise((resolve) => setTimeout(resolve, SECOND_PURGE_DELAY_MS));
    try {
      purge(plan);
      console.log('Revalidated (second purge):', plan.tags.join(','));
    } catch (error) {
      console.error('Second purge failed:', error);
    }
  });
}

// One read to find the slug when the webhook body has none. Failure = "slug unknown".
async function lookupSlug(body: WebhookBody): Promise<string | undefined> {
  const id = lookupId(body);
  if (!id) return undefined;
  try {
    const slug = await client.fetch<string | null>(
      `*[_id == $id][0].slug.current`,
      { id },
      { cache: 'no-store' }
    );
    return typeof slug === 'string' && slug ? slug : undefined;
  } catch (error) {
    console.error('Slug lookup failed:', error);
    return undefined;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Secret текшерүү
    const secret = request.headers.get('x-sanity-webhook-secret');

    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    let body: WebhookBody = {};
    try {
      body = await request.json();
    } catch {
      // Body жок болсо да иштейт
    }

    const model = modelOf(body);

    if (isSkipped(body)) {
      return NextResponse.json({ revalidated: false, model, skipped: true });
    }

    console.log('Webhook received:', { _type: model, _id: body?._id });

    let slug = slugOf(body);
    let slugFrom: 'body' | 'lookup' | 'unknown' = slug ? 'body' : 'unknown';
    if (!slug && model === 'post') {
      slug = await lookupSlug(body);
      if (slug) slugFrom = 'lookup';
    }

    const plan = planRevalidation(body, slug);
    purge(plan);
    purgeAgainLater(plan);
    console.log('Revalidated:', { model: model || 'all', slug: slug || null, slugFrom, tags: plan.tags, paths: plan.paths });

    return NextResponse.json({
      revalidated: true,
      model: model || 'all',
      event: body?.event || 'manual',
      slugFrom,
      tags: plan.tags,
      paths: plan.paths,
      now: Date.now(),
    });

  } catch (error: unknown) {
    console.error('Revalidation error:', error);
    // Ката болсо да баарын revalidate кылып кой
    try {
      purge(revalidateAllPlan());
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
// Колдонуу: /api/revalidate?secret=<SANITY_WEBHOOK_SECRET>
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret === process.env.SANITY_WEBHOOK_SECRET) {
    purge(revalidateAllPlan());
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