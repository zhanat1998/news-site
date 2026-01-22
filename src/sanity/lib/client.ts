// sanity/lib/client.ts
import { createClient, type QueryParams } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = '2024-01-01';

// Read client (окуу үчүн)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // CDN күйүк - API сурамдарды 80% азайтат
});

// Write client (жазуу үчүн, token менен)
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

// Fetch with caching and tags
interface SanityFetchOptions {
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
}

export async function sanityFetch<T>({
 query,
 params = {},
 tags = [],
 revalidate = 3600, // default 1 саат кэш - API сурамдарды азайтат
}: SanityFetchOptions): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate, // Кэш убактысы + webhook тазалоо бирге иштейт
      tags,
    },
  });
}