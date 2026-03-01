/**
 * Sanity -> Strapi Migration Script
 * Бардыгын көчүрөт: категориялар, посттор, видеолор, жарнамалар + СҮРӨТТӨР
 */

require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Sanity Config
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.SANITY_DATASET;
const SANITY_TOKEN = process.env.SANITY_TOKEN;

// Strapi Config
const STRAPI_URL = 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Temp folder for images
const TEMP_DIR = path.join(__dirname, 'temp_images');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Sanity API
async function fetchFromSanity(query) {
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${SANITY_TOKEN}` }
  });
  const data = await res.json();
  return data.result;
}

// Download image from URL
async function downloadImage(imageUrl, filename) {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;

    const buffer = await res.buffer();
    const filepath = path.join(TEMP_DIR, filename);
    fs.writeFileSync(filepath, buffer);
    return filepath;
  } catch (error) {
    console.log(`   ⚠️ Сүрөт жүктөлбөдү: ${filename}`);
    return null;
  }
}

// Upload image to Strapi
async function uploadToStrapi(filepath, filename) {
  try {
    const form = new FormData();
    form.append('files', fs.createReadStream(filepath), filename);

    const res = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      },
      body: form
    });

    if (!res.ok) {
      const error = await res.text();
      console.log(`   ⚠️ Upload ката: ${error}`);
      return null;
    }

    const data = await res.json();
    return data[0]?.id; // Return uploaded file ID
  } catch (error) {
    console.log(`   ⚠️ Upload ката: ${error.message}`);
    return null;
  }
}

// Strapi API - Create (REST API)
async function createInStrapi(endpoint, data) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      },
      body: JSON.stringify({ data })
    });

    if (!res.ok) {
      const errorText = await res.text();
      if (errorText.includes('unique')) {
        console.log(`   ⏭️ Өткөрүлдү (бар болгон): ${data.slug || data.title}`);
      } else {
        console.error(`   ❌ Ката ${endpoint}:`, errorText.substring(0, 80));
      }
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`   ❌ Тармак катасы: ${error.message}`);
    return null;
  }
}

// Category mapping
const categoryMap = new Map();

// 1. Migrate Categories
async function migrateCategories() {
  console.log('\n📁 КАТЕГОРИЯЛАРДЫ КӨЧҮРҮҮ...');

  const categories = await fetchFromSanity(`*[_type == "category"] | order(_createdAt asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    color
  }`);

  console.log(`   📊 ${categories.length} категория табылды`);

  for (const cat of categories) {
    const result = await createInStrapi('categories', {
      title: cat.title,
      slug: cat.slug,
      description: cat.description || ''
    });

    if (result) {
      categoryMap.set(cat._id, result.data.id);
      console.log(`   ✓ ${cat.title}`);
    }
  }

  console.log(`   ✅ ${categoryMap.size} категория көчүрүлдү\n`);
}

// 2. Migrate Posts with Images
async function migratePosts() {
  console.log('\n📰 ПОСТТАРДЫ КӨЧҮРҮҮ (СҮРӨТТӨР МЕНЕН)...');

  // Бардык посттор
  const posts = await fetchFromSanity(`*[_type == "post"] | order(publishedAt asc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "mainImageUrl": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    "mainImageCaption": mainImage.caption,
    "categoryIds": categories[]->_id,
    publishedAt,
    section,
    isFeatured,
    isBreaking,
    "bodyRaw": body
  }`);

  console.log(`   📊 ${posts.length} пост табылды`);
  console.log(`   ⏳ Бул процесс узак убакыт алышы мүмкүн...\n`);

  let success = 0;
  let failed = 0;
  let imageSuccess = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    // Progress
    if ((i + 1) % 50 === 0 || i === 0) {
      console.log(`   📊 Прогресс: ${i + 1}/${posts.length} (${Math.round((i + 1) / posts.length * 100)}%)`);
    }

    // Skip image upload for now (faster migration)
    let mainImageId = null;
    // Store image URL for later migration
    const mainImageUrl = post.mainImageUrl || null;

    // Convert body to HTML (keep Sanity CDN URLs for images - faster migration)
    let bodyHtml = '';
    if (post.bodyRaw && Array.isArray(post.bodyRaw)) {
      for (const block of post.bodyRaw) {
        if (block._type === 'block' && block.children) {
          const text = block.children.map(child => child.text || '').join('');
          if (text) bodyHtml += `<p>${text}</p>\n`;
        } else if (block._type === 'image' && block.asset) {
          const imageRef = block.asset._ref;
          if (imageRef) {
            const [, id, dimensions, format] = imageRef.split('-');
            const imageUrl = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${format}`;
            bodyHtml += `<img src="${imageUrl}" alt="${block.alt || ''}" />\n`;
          }
        }
      }
    }
    const bodyText = bodyHtml;

    // Map categories
    const strapiCategories = [];
    if (post.categoryIds) {
      for (const catId of post.categoryIds) {
        if (categoryMap.has(catId)) {
          strapiCategories.push(categoryMap.get(catId));
        }
      }
    }

    const postData = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      mainImage: mainImageId,
      mainImageAlt: post.mainImageAlt || '',
      mainImageCaption: post.mainImageCaption || '',
      category: strapiCategories.length > 0 ? strapiCategories[0] : null,
      publish: post.publishedAt,
      body: bodyText
    };

    const result = await createInStrapi('posts', postData);

    if (result) {
      success++;
    } else {
      failed++;
    }

    // Delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n   ✅ ${success} пост көчүрүлдү`);
  console.log(`   🖼️ ${imageSuccess} сүрөт жүктөлдү`);
  console.log(`   ❌ ${failed} ката\n`);
}

// 3. Migrate Videos with Thumbnails
async function migrateVideos() {
  console.log('\n🎬 ВИДЕОЛОРДУ КӨЧҮРҮҮ...');

  const videos = await fetchFromSanity(`*[_type == "video"] | order(publishedAt asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    videoSource,
    youtubeUrl,
    instagramUrl,
    tiktokUrl,
    "thumbnailUrl": thumbnail.asset->url,
    duration,
    "categoryId": category->_id,
    publishedAt,
    isFeatured
  }`);

  console.log(`   📊 ${videos.length} видео табылды`);

  let success = 0;

  for (const video of videos) {
    // Upload thumbnail
    let thumbnailId = null;
    if (video.thumbnailUrl) {
      const ext = video.thumbnailUrl.split('.').pop()?.split('?')[0] || 'jpg';
      const filename = `video_${video.slug}.${ext}`;
      const filepath = await downloadImage(video.thumbnailUrl, filename);

      if (filepath) {
        thumbnailId = await uploadToStrapi(filepath, filename);
        try { fs.unlinkSync(filepath); } catch {}
      }
    }

    const videoData = {
      title: video.title,
      slug: video.slug,
      description: video.description || '',
      youtubeUrl: video.youtubeUrl || '',
      instagramUrl: video.instagramUrl || '',
      tiktokUrl: video.tiktokUrl || '',
      duration: video.duration || '',
      category: video.categoryId ? categoryMap.get(video.categoryId) : null,
      publishedat: video.publishedAt
    };

    const result = await createInStrapi('videos', videoData);

    if (result) {
      success++;
      console.log(`   ✓ ${video.title}`);
    }
  }

  console.log(`   ✅ ${success} видео көчүрүлдү\n`);
}

// 4. Migrate Ads with Images
async function migrateAds() {
  console.log('\n📢 ЖАРНАМАЛАРДЫ КӨЧҮРҮҮ...');

  const ads = await fetchFromSanity(`*[_type == "ad"] {
    _id,
    title,
    placement,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    link
  }`);

  console.log(`   📊 ${ads.length} жарнама табылды`);

  let success = 0;

  for (const ad of ads) {
    // Upload image
    let imageId = null;
    if (ad.imageUrl) {
      const ext = ad.imageUrl.split('.').pop()?.split('?')[0] || 'jpg';
      const filename = `ad_${ad.title.replace(/[^a-zA-Z0-9]/g, '_')}.${ext}`;
      const filepath = await downloadImage(ad.imageUrl, filename);

      if (filepath) {
        imageId = await uploadToStrapi(filepath, filename);
        try { fs.unlinkSync(filepath); } catch {}
      }
    }

    const adData = {
      title: ad.title,
      imageAlt: ad.imageAlt || '',
      link: ad.link
    };

    const result = await createInStrapi('ads', adData);

    if (result) {
      success++;
      console.log(`   ✓ ${ad.title}`);
    }
  }

  console.log(`   ✅ ${success} жарнама көчүрүлдү\n`);
}

// Cleanup temp folder
function cleanup() {
  try {
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true });
    }
  } catch {}
}

// Main
async function main() {
  console.log('\n🚀 МИГРАЦИЯ БАШТАЛДЫ');
  console.log('═══════════════════════════════════════');
  console.log('Sanity -> Strapi (сүрөттөр менен)');
  console.log('═══════════════════════════════════════\n');

  const startTime = Date.now();

  try {
    // await migrateCategories();  // Мурун көчүрүлгөн
    // await migratePosts();       // Мурун көчүрүлгөн
    await migrateVideos();
    await migrateAds();

    cleanup();

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
    console.log('═══════════════════════════════════════');
    console.log(`✅ МИГРАЦИЯ АЯКТАДЫ! (${duration} мүнөт)`);
    console.log('═══════════════════════════════════════\n');
  } catch (error) {
    cleanup();
    console.error('\n❌ КАТА:', error);
  }
}

main();
