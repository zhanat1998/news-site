/**
 * Sanity сүрөт URL'дерин Strapi mainImageUrl талаасына көчүрүү
 * БИР ЖОЛУ иштетилет
 */

const fetch = require('node-fetch');

const SANITY_PROJECT_ID = 'ehul4q4a';
const SANITY_DATASET = 'production';
const STRAPI_URL = 'http://localhost:1337';

async function main() {
  console.log('\n🖼️  SANITY СҮРӨТ URL → STRAPI\n');

  // 1. Sanity'ден slug жана сүрөт URL алуу
  console.log('📥 Sanity\'ден алуу...');
  const query = `*[_type == "post"]{ "slug": slug.current, "imageUrl": mainImage.asset->url }`;
  const sanityRes = await fetch(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`
  );
  const sanityData = await sanityRes.json();
  const sanityPosts = sanityData.result;

  const imageMap = new Map();
  sanityPosts.forEach(p => p.slug && p.imageUrl && imageMap.set(p.slug, p.imageUrl));
  console.log(`   ${imageMap.size} сүрөт табылды`);

  // Debug: Show first 3 slugs
  const firstSlugs = Array.from(imageMap.keys()).slice(0, 3);
  console.log(`   Sanity slug үлгү: ${firstSlugs.join(', ')}\n`);

  // 2. Strapi посттордун алуу
  console.log('📥 Strapi\'ден алуу...');
  let allPosts = [];
  let page = 1;
  while (true) {
    const res = await fetch(`${STRAPI_URL}/api/posts?pagination[page]=${page}&pagination[pageSize]=100&fields[0]=slug&fields[1]=documentId`);
    const data = await res.json();
    allPosts.push(...data.data);
    if (data.data.length < 100) break;
    page++;
  }
  console.log(`   ${allPosts.length} пост Strapi'де`);

  // Debug: Show first 3 slugs
  const strapiSlugs = allPosts.slice(0, 3).map(p => p.slug);
  console.log(`   Strapi slug үлгү: ${strapiSlugs.join(', ')}\n`);

  // 3. Жаңыртуу
  console.log('🔄 Жаңыртуу...');
  let updated = 0;
  for (let i = 0; i < allPosts.length; i++) {
    const post = allPosts[i];
    const imageUrl = imageMap.get(post.slug);
    if (!imageUrl) continue;

    const res = await fetch(`${STRAPI_URL}/api/posts/${post.documentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { mainImageUrl: imageUrl } })
    });

    if (res.ok) {
      updated++;
    } else {
      const err = await res.text();
      if (i < 3) console.log(`   ❌ Ката: ${err.substring(0, 100)}`);
    }
    if ((i + 1) % 200 === 0) console.log(`   ${i + 1}/${allPosts.length}...`);
    await new Promise(r => setTimeout(r, 30));
  }

  console.log(`\n✅ ${updated} пост жаңыртылды!\n`);
}

main().catch(console.error);
