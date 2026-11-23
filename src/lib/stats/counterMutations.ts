// Pure builders for the view and banner counters. Each event is ONE Sanity request:
// the route sends the whole mutation list in one transaction.
// No imports of next/* or '@/...' aliases, so node:test can load this file.

export type Mutation = Record<string, unknown>;

export interface MutationClient {
  mutate(mutations: Mutation[]): Promise<unknown>;
}

// A plain Sanity document id: no "drafts.", no dots, at most 128 chars.
const PLAIN_ID = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

export function isPlainSanityId(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 128 && PLAIN_ID.test(value);
}

export function sanitizeCountry(raw: string | null | undefined): string {
  return (raw || 'Unknown').replace(/[^A-Za-z_]/g, '_');
}

export function buildViewMutations(postId: string, country: string, dateKey: string): Mutation[] {
  const postViewsId = `postViews-${postId}`;
  const dailyStatId = `dailyStat-${dateKey}`;
  const countryPath = `countryViews.${country}`;
  return [
    {
      createIfNotExists: {
        _id: postViewsId,
        _type: 'postViews',
        post: { _type: 'reference', _ref: postId, _weak: true },
        viewCount: 0,
      },
    },
    { patch: { id: postViewsId, inc: { viewCount: 1 } } },
    {
      createIfNotExists: {
        _id: dailyStatId,
        _type: 'dailyStat',
        date: dateKey,
        totalViews: 0,
        countryViews: {},
      },
    },
    // inc does not create a missing nested path, so set it first (separate patches).
    { patch: { id: dailyStatId, setIfMissing: { countryViews: {} } } },
    { patch: { id: dailyStatId, setIfMissing: { [countryPath]: 0 } } },
    { patch: { id: dailyStatId, inc: { totalViews: 1, [countryPath]: 1 } } },
  ];
}

export interface BannerEvent {
  adId: string;
  advertiser?: string;
  placement?: string;
  eventType: string;
}

export function buildBannerMutations(event: BannerEvent, date: string): Mutation[] {
  const statId = `bannerStat-${event.adId}-${date}`;
  const field = event.eventType === 'click' ? 'clicks' : 'views';
  return [
    {
      createIfNotExists: {
        _id: statId,
        _type: 'bannerStat',
        date,
        adId: event.adId,
        advertiser: event.advertiser || 'Unknown',
        placement: event.placement || 'unknown',
        views: 0,
        clicks: 0,
      },
    },
    { patch: { id: statId, inc: { [field]: 1 } } },
  ];
}

// Exactly one client call per event.
export async function recordView(
  client: MutationClient,
  postId: string,
  country: string,
  dateKey: string
): Promise<void> {
  await client.mutate(buildViewMutations(postId, country, dateKey));
}

export async function recordBanner(
  client: MutationClient,
  event: BannerEvent,
  date: string
): Promise<void> {
  await client.mutate(buildBannerMutations(event, date));
}
