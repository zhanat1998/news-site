require('dotenv').config();
const { createClient } = require('@sanity/client');
console.log('🚀 Скрипт башталды');

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

const CATEGORIES = [
  {
    _id: 'category-politics',
    _type: 'category',
    title: 'САЯСАТ',
    slug: { _type: 'slug', current: 'sayasat' },
    description: 'Кыргызстандын жана дүйнөнүн саясий жаңылыктары',
    color: '#d32f2f',
  },
  {
    _id: 'category-society',
    _type: 'category',
    title: 'КООМ',
    slug: { _type: 'slug', current: 'koom' },
    description: 'Коомдук жаңылыктар, социалдык маселелер',
    color: '#1976d2',
  },
  {
    _id: 'category-economy',
    _type: 'category',
    title: 'ЭКОНОМИКА',
    slug: { _type: 'slug', current: 'ekonomika' },
    description: 'Экономикалык жаңылыктар, бизнес, финансы',
    color: '#388e3c',
  },
  {
    _id: 'category-world',
    _type: 'category',
    title: 'ДҮЙНӨ',
    slug: { _type: 'slug', current: 'duino' },
    description: 'Эл аралык жаңылыктар, дүйнөлүк окуялар',
    color: '#7b1fa2',
  },
  {
    _id: 'category-culture',
    _type: 'category',
    title: 'МАДАНИЯТ',
    slug: { _type: 'slug', current: 'madaniyat' },
    description: 'Маданият, искусство, өнөр жаңылыктары',
    color: '#f57c00',
  },
  {
    _id: 'category-sport',
    _type: 'category',
    title: 'СПОРТ',
    slug: { _type: 'slug', current: 'sport' },
    description: 'Спорт жаңылыктары, мелдештер, жыйынтыктар',
    color: '#00796b',
  },
];

async function seedCategories() {
  console.log('📁 Категорияларды түзүү башталды...\n');

  for (const category of CATEGORIES) {
    try {
      await sanity.createOrReplace(category);
      console.log(`✅ ${category.title} түзүлдү`);
    } catch (error) {
      console.error(`❌ ${category.title} ката:`, error.message);
    }
  }

  console.log('\n🎉 Бүттү!');
}

seedCategories();