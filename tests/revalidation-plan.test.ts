import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planRevalidation, lookupId, slugOf, ALL_TAGS } from '../src/lib/revalidation/plan.ts';

test('post with known slug: posts + post:<slug>, home page only', () => {
  const p = planRevalidation({ _type: 'post', _id: 'x', slug: { current: 'my-slug' } }, 'my-slug');
  assert.deepEqual(p.tags, ['posts', 'post:my-slug']);
  assert.deepEqual(p.paths, [{ path: '/', type: 'page' }]);
  assert.equal(p.skipped, false);
  assert.ok(!p.paths.some((x) => x.type === 'layout'));
});

test('post with unknown slug: posts + post-pages (fail-safe)', () => {
  const p = planRevalidation({ _type: 'post', _id: 'x' });
  assert.deepEqual(p.tags, ['posts', 'post-pages']);
  assert.ok(!p.paths.some((x) => x.type === 'layout'));
});

test('video: videos tag, /video and / pages, no layout', () => {
  const p = planRevalidation({ _type: 'video', _id: 'v' });
  assert.deepEqual(p.tags, ['videos']);
  assert.deepEqual(p.paths, [
    { path: '/video', type: 'page' },
    { path: '/', type: 'page' },
  ]);
});

test('category: as before', () => {
  const p = planRevalidation({ _type: 'category' });
  assert.deepEqual(p.tags, ['categories']);
  assert.deepEqual(p.paths, [
    { path: '/', type: 'layout' },
    { path: '/category', type: 'layout' },
  ]);
});

test('ad: as before', () => {
  const p = planRevalidation({ _type: 'ad' });
  assert.deepEqual(p.tags, ['ads']);
  assert.deepEqual(p.paths, [{ path: '/', type: 'page' }]);
});

test('stat types and stat ids are skipped', () => {
  for (const b of [
    { _type: 'dailyStat' },
    { _type: 'bannerStat' },
    { _type: 'postViews' },
    { _type: 'pageView' },
    { model: 'dailyStat' },
    { _id: 'dailyStat-2026-11-23' },
    { _id: 'bannerStat-a-2026-11-23' },
    { _id: 'postViews-abc' },
  ]) {
    const p = planRevalidation(b);
    assert.equal(p.skipped, true, JSON.stringify(b));
    assert.deepEqual(p.tags, []);
    assert.deepEqual(p.paths, []);
  }
});

test('unknown model and no model: revalidate everything', () => {
  for (const b of [{ _type: 'author' }, {}, null, undefined]) {
    const p = planRevalidation(b as any);
    assert.equal(p.skipped, false);
    assert.equal(p.all, true);
    assert.deepEqual(p.tags, ALL_TAGS);
    assert.ok(p.paths.some((x) => x.type === 'layout'));
  }
  assert.ok(ALL_TAGS.includes('post-pages') && ALL_TAGS.includes('posts'));
});

test('model field (strapi-style) is read too', () => {
  assert.deepEqual(planRevalidation({ model: 'ad' }).tags, ['ads']);
});

test('slugOf and lookupId', () => {
  assert.equal(slugOf({ slug: { current: 'a' } }), 'a');
  assert.equal(slugOf({ slug: { current: '' } }), undefined);
  assert.equal(slugOf({}), undefined);
  assert.equal(lookupId({ _id: 'drafts.abc' }), 'abc');
  assert.equal(lookupId({ _id: 'abc' }), 'abc');
  assert.equal(lookupId({}), undefined);
});
