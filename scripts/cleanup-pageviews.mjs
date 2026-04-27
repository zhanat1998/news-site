// scripts/cleanup-pageviews.mjs
// Бардык pageView документтерин Sanity'ден жок кылат
// Иштетүү: node scripts/cleanup-pageviews.mjs

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

async function cleanup() {
  console.log('pageView документтерин санап жатам...');

  const total = await client.fetch(`count(*[_type == "pageView"])`);
  console.log(`Жалпы: ${total} pageView документи`);

  if (total === 0) {
    console.log('Жок кылуучу документ жок.');
    return;
  }

  let deleted = 0;
  const batchSize = 100;

  while (true) {
    const docs = await client.fetch(
      `*[_type == "pageView"][0...${batchSize}]{ _id }`
    );

    if (docs.length === 0) break;

    const transaction = client.transaction();
    for (const doc of docs) {
      transaction.delete(doc._id);
    }
    await transaction.commit();

    deleted += docs.length;
    console.log(`Жок кылынды: ${deleted} / ${total}`);
  }

  console.log(`\nБүттү! Жалпы ${deleted} pageView документи жок кылынды.`);
  console.log('Азыр Sanity Usage бетин текшериңиз — документ саны азайышы керек.');
}

cleanup().catch((err) => {
  console.error('Ката:', err.message);
  process.exit(1);
});
