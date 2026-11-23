import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildViewMutations,
  buildBannerMutations,
  isPlainSanityId,
  sanitizeCountry,
  recordView,
  recordBanner,
  type Mutation,
} from '../src/lib/stats/counterMutations.ts';

test('view mutations: order, ids, fields, country key', () => {
  const m = buildViewMutations('abc123', 'KG', '2026-11-23');
  assert.equal(m.length, 6);
  assert.deepEqual(m[0], {
    createIfNotExists: {
      _id: 'postViews-abc123',
      _type: 'postViews',
      post: { _type: 'reference', _ref: 'abc123', _weak: true },
      viewCount: 0,
    },
  });
  assert.deepEqual(m[1], { patch: { id: 'postViews-abc123', inc: { viewCount: 1 } } });
  assert.deepEqual(m[2], {
    createIfNotExists: {
      _id: 'dailyStat-2026-11-23',
      _type: 'dailyStat',
      date: '2026-11-23',
      totalViews: 0,
      countryViews: {},
    },
  });
  assert.deepEqual(m[3], { patch: { id: 'dailyStat-2026-11-23', setIfMissing: { countryViews: {} } } });
  assert.deepEqual(m[4], { patch: { id: 'dailyStat-2026-11-23', setIfMissing: { 'countryViews.KG': 0 } } });
  assert.deepEqual(m[5], {
    patch: { id: 'dailyStat-2026-11-23', inc: { totalViews: 1, 'countryViews.KG': 1 } },
  });
});

test('view mutations: setIfMissing comes before inc on dailyStat', () => {
  const m = buildViewMutations('p1', 'Unknown', '2026-01-01');
  const keys = m.map((x) => Object.keys((x as any).patch ?? { create: 1 }).join(','));
  const inc = m.findIndex((x: any) => x.patch?.inc?.totalViews === 1);
  const setNested = m.findIndex((x: any) => x.patch?.setIfMissing?.['countryViews.Unknown'] === 0);
  const setObj = m.findIndex((x: any) => x.patch?.setIfMissing?.countryViews);
  assert.ok(setObj < setNested && setNested < inc, keys.join(' | '));
});

test('country sanitising matches the old route', () => {
  assert.equal(sanitizeCountry(null), 'Unknown');
  assert.equal(sanitizeCountry('K.G'), 'K_G');
  assert.equal(sanitizeCountry('a b$c'), 'a_b_c');
});

test('banner mutations: view and click', () => {
  const v = buildBannerMutations({ adId: 'ad1', advertiser: 'Acme', placement: 'home_top', eventType: 'view' }, '2026-11-23');
  assert.deepEqual(v[0], {
    createIfNotExists: {
      _id: 'bannerStat-ad1-2026-11-23',
      _type: 'bannerStat',
      date: '2026-11-23',
      adId: 'ad1',
      advertiser: 'Acme',
      placement: 'home_top',
      views: 0,
      clicks: 0,
    },
  });
  assert.deepEqual(v[1], { patch: { id: 'bannerStat-ad1-2026-11-23', inc: { views: 1 } } });
  const c = buildBannerMutations({ adId: 'ad1', eventType: 'click' }, '2026-11-23');
  assert.deepEqual(c[1], { patch: { id: 'bannerStat-ad1-2026-11-23', inc: { clicks: 1 } } });
  assert.equal((c[0] as any).createIfNotExists.advertiser, 'Unknown');
  assert.equal((c[0] as any).createIfNotExists.placement, 'unknown');
  // unknown eventType counts as a view, as before
  const o = buildBannerMutations({ adId: 'ad1', eventType: 'whatever' }, '2026-11-23');
  assert.deepEqual(o[1], { patch: { id: 'bannerStat-ad1-2026-11-23', inc: { views: 1 } } });
});

test('exactly one client call per view event', async () => {
  const calls: Mutation[][] = [];
  const fake = { mutate: async (m: Mutation[]) => void calls.push(m) };
  await recordView(fake, 'p1', 'KG', '2026-11-23');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].length, 6);
});

test('exactly one client call per banner event', async () => {
  const calls: Mutation[][] = [];
  const fake = { mutate: async (m: Mutation[]) => void calls.push(m) };
  await recordBanner(fake, { adId: 'a', eventType: 'click' }, '2026-11-23');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].length, 2);
});

test('plain sanity id validation', () => {
  for (const ok of ['abc', 'A1', 'a-b_c', 'x'.repeat(128)]) assert.equal(isPlainSanityId(ok), true, ok);
  for (const bad of [undefined, null, 5, '', 'drafts.abc', 'a.b', '-abc', '_abc', 'a b', 'a/b', 'x'.repeat(129), {}, ['a']]) {
    assert.equal(isPlainSanityId(bad), false, String(bad));
  }
});
