require('dotenv').config();
const { createClient } = require('@sanity/client');
const fetch = require('node-fetch');
const https = require('https');
const axios = require('axios');

console.log('🚀 WordPress → Sanity ТОЛУК МИГРАЦИЯ\n');

const WP_URL = process.env.WP_URL;
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.SANITY_DATASET || 'production';
const SANITY_TOKEN = process.env.SANITY_TOKEN;

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

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
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

async function htmlToPortableText(html) {
  if (!html) return [];

  const blocks = [];

  // 1. Суроттарды издөө
  const imgRegex = /<img[^>]+src="([^">]+)"[^>]*alt="([^"]*)"[^>]*>/g;
  let match;
  const foundImages = [];

  while ((match = imgRegex.exec(html)) !== null) {
    foundImages.push({
      url: match[1],
      alt: match[2] || 'Image',
    });
  }

  // 2. HTML'ди тазалоо (суроттарды алып салуу)
  let cleanHtml = html.replace(/<img[^>]+>/g, '___IMAGE___');

  // 3. Paragraph'тарга бөлүү
  const parts = cleanHtml.split(/<\/p>|___IMAGE___/gi);

  let imageIndex = 0;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    // Эгер бул сурот орду болсо
    if (i > 0 && cleanHtml.includes('___IMAGE___')) {
      const imgData = foundImages[imageIndex];

      if (imgData) {
        // Суротту жүктөп, Sanity'ге кошуу
        console.log(`      📸 Content сурот ${imageIndex + 1}/${foundImages.length}`);

        try {
          const filename = imgData.url.split('/').pop() || `content-img-${Date.now()}.jpg`;
          const asset = await uploadImageToSanity(imgData.url, filename);

          if (asset) {
            blocks.push({
              _type: 'image',
              _key: `img${i}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              asset: {
                _type: 'reference',
                _ref: asset._id,
              },
              alt: imgData.alt,
            });
            console.log(`      ✅ Жүктөлдү`);
          }
        } catch (err) {
          console.log(`      ⚠️  Skip: ${err.message}`);
        }

        imageIndex++;
      }
    }

    // Эгер бул текст болсо
    let text = part.replace(/<p[^>]*>/gi, '');
    text = stripHtml(text);

    if (text.length > 0) {
      blocks.push({
        _type: 'block',
        _key: `block${i}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        style: 'normal',
        markDefs: [],
        children: [{
          _type: 'span',
          _key: `span${i}`,
          text: text,
          marks: [],
        }],
      });
    }
  }

  return blocks.length > 0 ? blocks : [{
    _type: 'block',
    _key: 'empty',
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: 'emptyspan', text: '', marks: [] }],
  }];
}

async function uploadImageToSanity(imageUrl, filename) {
  try {
    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream',
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      timeout: 30000,
    });

    const asset = await sanity.assets.upload('image', response.data, {
      filename: filename,
    });

    return asset;
  } catch (error) {
    return null;
  }
}

// ═══════════════════════════════════════
// КАТЕГОРИЯЛАРДЫ СИНХРОНДОО
// ═══════════════════════════════════════

async function syncCategories() {
  console.log('═══════════════════════════════════════');
  console.log('📁 КАТЕГОРИЯЛАРДЫ СИНХРОНДОО');
  console.log('═══════════════════════════════════════\n');

  try {
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/categories?per_page=100`);
    const wpCategories = await res.json();

    console.log(`📊 WordPress'те ${wpCategories.length} категория\n`);

    const categoryMap = {};

    for (const wpCat of wpCategories) {
      const sanityId = `category-wp-${wpCat.id}`;

      const sanityCategory = {
        _id: sanityId,
        _type: 'category',
        title: wpCat.name,
        slug: {
          _type: 'slug',
          current: wpCat.slug,
        },
        description: stripHtml(wpCat.description || ''),
      };

      await sanity.createOrReplace(sanityCategory);
      console.log(`✅ ${wpCat.name} (ID: ${wpCat.id})`);
      categoryMap[wpCat.id] = sanityId;

      await sleep(100);
    }

    console.log(`\n✅ ${Object.keys(categoryMap).length} категория синхрондолду\n`);
    return categoryMap;

  } catch (error) {
    console.error('❌ Категориялар катасы:', error.message);
    return {};
  }
}

// ═══════════════════════════════════════
// АВТОРЛОРДУ СИНХРОНДОО
// ═══════════════════════════════════════

async function syncAuthors() {
  console.log('═══════════════════════════════════════');
  console.log('👤 АВТОРЛОРДУ СИНХРОНДОО');
  console.log('═══════════════════════════════════════\n');

  try {
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/users?per_page=100`);
    const wpAuthors = await res.json();

    console.log(`📊 WordPress'те ${wpAuthors.length} автор\n`);

    const authorMap = {};

    for (const wpAuthor of wpAuthors) {
      const sanityId = `author-wp-${wpAuthor.id}`;

      const sanityAuthor = {
        _id: sanityId,
        _type: 'author',
        name: wpAuthor.name || 'Автор',
        slug: {
          _type: 'slug',
          current: wpAuthor.slug || `author-${wpAuthor.id}`,
        },
        bio: wpAuthor.description ? [{
          _type: 'block',
          _key: 'bio',
          style: 'normal',
          children: [{
            _type: 'span',
            _key: 'biospan',
            text: stripHtml(wpAuthor.description),
            marks: [],
          }],
        }] : undefined,
      };

      await sanity.createOrReplace(sanityAuthor);
      console.log(`✅ ${wpAuthor.name}`);
      authorMap[wpAuthor.id] = sanityId;

      await sleep(100);
    }

    console.log(`\n✅ ${Object.keys(authorMap).length} автор синхрондолду\n`);
    return authorMap;

  } catch (error) {
    console.error('❌ Авторлор катасы:', error.message);
    return {};
  }
}

// ═══════════════════════════════════════
// ПОСТТОР МИГРАЦИЯСЫ
// ═══════════════════════════════════════

async function migratePost(post, categoryMap, authorMap, index, total) {
  const title = stripHtml(post.title?.rendered || 'Аталышсыз');
  const shortTitle = title.length > 45 ? title.substring(0, 45) + '...' : title;

  console.log(`\n[${index + 1}/${total}] 📝 ${shortTitle}`);

  try {
    // 1. Башкы сурот (МИЛДЕТТҮҮ)
    let mainImage = null;
    if (post._embedded?.['wp:featuredmedia']?.[0]) {
      const media = post._embedded['wp:featuredmedia'][0];
      if (media.source_url) {
        const filename = media.source_url.split('/').pop() || `img-${post.id}.jpg`;
        const asset = await uploadImageToSanity(media.source_url, filename);

        if (asset) {
          mainImage = {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
            alt: media.alt_text || title,
            caption: stripHtml(media.caption?.rendered || ''),
          };
          console.log(`   ✅ Башкы сурот`);
        }
      }
    }

    // Эгер сурот жок болсо - skip
    if (!mainImage) {
      console.log(`   ⚠️  Сурот жок - SKIP`);
      return { success: false, error: 'No image' };
    }

    // 2. Автор (МИЛДЕТТҮҮ)
    let author = null;
    if (post.author && authorMap[post.author]) {
      author = {
        _type: 'reference',
        _ref: authorMap[post.author],
      };
      console.log(`   ✅ Автор`);
    } else {
      console.log(`   ⚠️  Автор жок - SKIP`);
      return { success: false, error: 'No author' };
    }

    // 3. КАТЕГОРИЯЛАР - БААРЫН АЛАБЫЗ (массив)
    let categories = [];
    if (post.categories && post.categories.length > 0) {
      console.log(`   🏷️  Категориялар:`);

      for (const catId of post.categories) {
        if (categoryMap[catId]) {
          categories.push({
            _type: 'reference',
            _ref: categoryMap[catId],
            _key: `cat-${catId}`,
          });

          // Категория атын көрсөтүү
          try {
            const catRes = await fetch(`${WP_URL}/wp-json/wp/v2/categories/${catId}`);
            const catData = await catRes.json();
            console.log(`      - ${catData.name}`);
          } catch (e) {
            console.log(`      - ID ${catId}`);
          }
        }
      }
    }

    // 4. Excerpt (МИЛДЕТТҮҮ)
    const excerptText = stripHtml(post.excerpt?.rendered || '');
    if (!excerptText) {
      console.log(`   ⚠️  Excerpt жок - SKIP`);
      return { success: false, error: 'No excerpt' };
    }

    // 5. Body (МИЛДЕТТҮҮ)
    const body = await htmlToPortableText(post.content?.rendered || '');

    // 6. Section (МИЛДЕТТҮҮ)
    const section = post.sticky ? 'hero' : 'news';

    // 7. PublishedAt (МИЛДЕТТҮҮ)
    const publishedAt = new Date(post.date).toISOString();

    // 8. Sanity документ
    const doc = {
      _type: 'post',
      _id: `post-wp-${post.id}`,

      title: title,
      slug: {
        _type: 'slug',
        current: post.slug || `post-${post.id}`,
      },
      excerpt: excerptText.substring(0, 500),

      mainImage: mainImage,
      author: author,

      // КАТЕГОРИЯЛАР (массив)
      ...(categories.length > 0 && { categories }),

      publishedAt: publishedAt,
      section: section,
      isBreaking: post.sticky || false,
      isFeatured: false,

      body: body,
    };

    await sanity.createOrReplace(doc);
    console.log(`   ✅ САКТАЛДЫ`);

    return { success: true };

  } catch (error) {
    console.error(`   ❌ ${error.message}`);
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════
// НЕГИЗГИ ФУНКЦИЯ
// ═══════════════════════════════════════

async function fullMigration() {
  console.log('═══════════════════════════════════════');
  console.log('   🚀 ТОЛУК МИГРАЦИЯ');
  console.log('   🏷️  КӨП КАТЕГОРИЯЛАР МЕНЕН');
  console.log('═══════════════════════════════════════\n');

  // 1. Категориялар
  const categoryMap = await syncCategories();

  // 2. Авторлор
  const authorMap = await syncAuthors();

  // 3. Посттор саны
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer = await new Promise(resolve => {
    readline.question('\nКанча пост? (20/100/all): ', ans => {
      readline.close();
      resolve(ans);
    });
  });

  const limit = answer === 'all' ? 999999 : parseInt(answer) || 20;

  console.log(`\n📥 Посттор жүктөлүүдө...\n`);

  let allPosts = [];
  let page = 1;

  while (allPosts.length < limit) {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed=1`
    );

    if (!res.ok) break;

    const posts = await res.json();
    if (posts.length === 0) break;

    allPosts = [...allPosts, ...posts];
    console.log(`   📦 ${allPosts.length} пост`);

    if (allPosts.length >= limit) {
      allPosts = allPosts.slice(0, limit);
      break;
    }

    page++;
    await sleep(300);
  }

  console.log(`\n📊 Көчүрүлөт: ${allPosts.length} пост\n`);

  // 4. Миграция
  let success = 0;
  let failed = 0;

  for (let i = 0; i < allPosts.length; i++) {
    const result = await migratePost(allPosts[i], categoryMap, authorMap, i, allPosts.length);

    if (result.success) {
      success++;
    } else {
      failed++;
    }

    await sleep(500);
  }

  // 5. Жыйынтык
  console.log('\n═══════════════════════════════════════');
  console.log('   📊 ЖЫЙЫНТЫК');
  console.log('═══════════════════════════════════════\n');
  console.log(`✅ Категориялар: ${Object.keys(categoryMap).length}`);
  console.log(`✅ Авторлор: ${Object.keys(authorMap).length}`);
  console.log(`✅ Посттор: ${success}`);
  console.log(`❌ Skip: ${failed}`);
  console.log('\n═══════════════════════════════════════\n');
  console.log('🎉 Бүттү!\n');
}

fullMigration().catch(error => {
  console.error('\n💥 КАТА:', error);
  process.exit(1);
});