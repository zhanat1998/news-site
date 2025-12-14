require('dotenv').config();
const { createClient } = require('@sanity/client');
const fetch = require('node-fetch');

const WP_URL = process.env.WP_URL;
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_TOKEN = process.env.SANITY_TOKEN;

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: 'production',
  token: SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function getAllPosts() {
  let allPosts = [];
  let page = 1;

  console.log('📥 WordPress\'тен посттор жүктөлүүдө...\n');

  while (true) {
    try {
      const res = await fetch(
        `${WP_URL}/wp-json/wp/v2/posts?per_page=100&page=${page}`
      );
      if (!res.ok) break;
      const posts = await res.json();
      if (posts.length === 0) break;
      allPosts = [...allPosts, ...posts];
      console.log(`   📄 Бет ${page}: ${posts.length} пост (Жалпы: ${allPosts.length})`);
      page++;
      await sleep(300);
    } catch (e) {
      break;
    }
  }
  return allPosts;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .trim();
}

function htmlToPortableText(html) {
  if (!html) return [];
  const blocks = [];
  const paragraphs = html.split(/<\/p>/gi);
  paragraphs.forEach((p, i) => {
    const text = stripHtml(p);
    if (text.length > 0) {
      blocks.push({
        _type: 'block',
        _key: `b${i}${Date.now()}`,
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: `s${i}`, text, marks: [] }],
      });
    }
  });
  return blocks;
}

async function migrate() {
  console.log('═══════════════════════════════════════');
  console.log('   🚀 WordPress → Sanity Миграция');
  console.log('═══════════════════════════════════════\n');

  const posts = await getAllPosts();
  console.log(`\n📊 Жалпы табылды: ${posts.length} пост\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    try {
      const doc = {
        _type: 'post',
        title: stripHtml(post.title?.rendered || 'Аталышсыз'),
        slug: { _type: 'slug', current: post.slug || `post-${post.id}` },
        excerpt: stripHtml(post.excerpt?.rendered || '').substring(0, 500),
        publishedAt: post.date,
        section: 'news',
        isBreaking: false,
        isFeatured: false,
        body: htmlToPortableText(post.content?.rendered || ''),
      };

      await sanity.create(doc);
      success++;

      const title = doc.title.length > 45 ? doc.title.substring(0, 45) + '...' : doc.title;
      console.log(`✅ [${i + 1}/${posts.length}] ${title}`);
    } catch (err) {
      failed++;
      console.error(`❌ [${i + 1}/${posts.length}] Ката: ${err.message}`);
    }
    await sleep(400);
  }

  console.log('\n═══════════════════════════════════════');
  console.log(`   ✅ Ийгиликтүү: ${success}`);
  console.log(`   ❌ Ката: ${failed}`);
  console.log('═══════════════════════════════════════');
  console.log('\n🎉 Миграция аяктады!');
}

migrate();