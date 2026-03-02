// src/middleware.ts
// SEO спам URL коргоо - ?s= параметрлерин блоктоо
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // ?s= параметри бар спам URLлерди блоктоо
  // Бул SEO атакадан коргоо учун
  if (url.searchParams.has('s')) {
    // 410 Gone - бул URL мындан ары жок экенин билдирет
    // Google бул URLлерди индекстен өчүрөт
    return new NextResponse(null, { status: 410 });
  }

  // Башка шектүү параметрлер
  const suspiciousParams = ['s', 'feed', 'attachment_id'];
  for (const param of suspiciousParams) {
    if (url.searchParams.has(param) && url.pathname === '/') {
      return new NextResponse(null, { status: 410 });
    }
  }

  return NextResponse.next();
}

// Middleware бардык барактарда иштейт, бирок статик файлдарды өткөрүп жиберет
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - sitemap.xml
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};