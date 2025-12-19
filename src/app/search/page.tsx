// src/app/search/page.tsx
import { sanityFetch } from '@/sanity/lib/client';
import { searchPostsQuery } from '@/sanity/lib/queries';
import SearchResults from "@/components/search/SearchResults/SearchResults";
import Pagination from "@/components/search/Pagination/Pagination";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 12;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams; // ← await кошулду
  const query = params.q || '';
  const currentPage = parseInt(params.page || '1', 10);

  const allResults = query
    ? await sanityFetch<any[]>({
      query: searchPostsQuery,
      params: { searchQuery: `*${query}*` },
      tags: ['posts'],
      revalidate: 0,
    })
    : [];

  // Pagination логикасы
  const totalResults = allResults.length;
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedResults = allResults.slice(startIndex, endIndex);

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '60vh' }}>
      <h1 style={{ marginBottom: '10px' }}>
        Издөө: &quot;{decodeURIComponent(query)}&quot;
      </h1>

      {query && totalResults > 0 && (
        <p style={{ color: '#666', marginBottom: '30px' }}>
          {totalResults} натыйжа табылды
        </p>
      )}

      {query && totalResults === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '18px', color: '#999' }}>
            &quot;{decodeURIComponent(query)}&quot; боюнча эч нерсе табылган жок
          </p>
          <p style={{ color: '#bbb', marginTop: '10px' }}>
            Башка сөздөр менен аракет кылыңыз
          </p>
        </div>
      )}

      {!query && (
        <p style={{ color: '#999', textAlign: 'center', padding: '60px 20px' }}>
          Издөө сөзүн киргизиңиз
        </p>
      )}

      {paginatedResults.length > 0 && (
        <>
          <SearchResults items={paginatedResults} />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              searchQuery={query}
            />
          )}
        </>
      )}
    </div>
  );
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams; // ← await кошулду
  const query = params.q || '';
  const page = params.page || '1';

  return {
    title: query
      ? `Издөө: ${decodeURIComponent(query)} - Бет ${page} - Сокол.Медиа`
      : 'Издөө - Сокол.Медиа',
  };
}