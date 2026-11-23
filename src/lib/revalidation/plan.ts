// Pure planner: webhook body -> which cache tags and paths to purge.
// No imports of next/* or '@/...' aliases, so node:test can load this file.

export interface WebhookBody {
  _type?: string;
  _id?: string;
  event?: string;
  model?: string;
  slug?: { current?: string } | null;
}

export type PathKind = 'page' | 'layout';
export interface PathPurge {
  path: string;
  type: PathKind;
}

export interface RevalidationPlan {
  skipped: boolean;
  model?: string;
  tags: string[];
  paths: PathPurge[];
  // true for the fail-safe purge of everything
  all?: boolean;
}

// Stat documents don't change site content.
export const IGNORED_TYPES = new Set(['dailyStat', 'bannerStat', 'postViews', 'pageView']);
const STAT_ID = /^(dailyStat|bannerStat|postViews)-/;

export const ALL_TAGS = [
  'posts',
  'post-pages',
  'breaking',
  'categories',
  'authors',
  'videos',
  'instagram',
  'tiktok',
  'hero',
  'ads',
];
export const ALL_PATHS: PathPurge[] = [
  { path: '/', type: 'page' },
  { path: '/news', type: 'page' },
  { path: '/category', type: 'page' },
  { path: '/video', type: 'page' },
  { path: '/', type: 'layout' },
];

export function modelOf(body: WebhookBody | null | undefined): string | undefined {
  return body?._type || body?.model;
}

export function isSkipped(body: WebhookBody | null | undefined): boolean {
  const model = modelOf(body);
  return Boolean((model && IGNORED_TYPES.has(model)) || STAT_ID.test(body?._id || ''));
}

export function slugOf(body: WebhookBody | null | undefined): string | undefined {
  const s = body?.slug?.current;
  return typeof s === 'string' && s.length > 0 ? s : undefined;
}

// Id used for the slug lookup: published id, no "drafts." prefix.
export function lookupId(body: WebhookBody | null | undefined): string | undefined {
  const id = body?._id;
  if (typeof id !== 'string' || !id) return undefined;
  return id.replace(/^drafts\./, '');
}

export function revalidateAllPlan(model?: string): RevalidationPlan {
  return { skipped: false, model, tags: [...ALL_TAGS], paths: ALL_PATHS.map((p) => ({ ...p })), all: true };
}

// `slug` is body.slug.current, or the result of the route's one lookup (undefined = unknown).
export function planRevalidation(body: WebhookBody | null | undefined, slug?: string): RevalidationPlan {
  if (isSkipped(body)) {
    return { skipped: true, model: modelOf(body), tags: [], paths: [] };
  }
  const model = modelOf(body);
  switch (model) {
    case 'post':
      if (slug) {
        return {
          skipped: false,
          model,
          tags: ['posts', `post:${slug}`],
          paths: [{ path: '/', type: 'page' }],
        };
      }
      return { skipped: false, model, tags: ['posts', 'post-pages'], paths: [{ path: '/', type: 'page' }] };
    case 'video':
      return {
        skipped: false,
        model,
        tags: ['videos'],
        paths: [
          { path: '/video', type: 'page' },
          { path: '/', type: 'page' },
        ],
      };
    case 'category':
      return {
        skipped: false,
        model,
        tags: ['categories'],
        paths: [
          { path: '/', type: 'layout' },
          { path: '/category', type: 'layout' },
        ],
      };
    case 'ad':
      return { skipped: false, model, tags: ['ads'], paths: [{ path: '/', type: 'page' }] };
    default:
      // unknown model or no model: fail-safe purge of everything
      return revalidateAllPlan(model);
  }
}
