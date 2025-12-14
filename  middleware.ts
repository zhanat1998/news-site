import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Эгер /stuыdio жолу болсо
  if (request.nextUrl.pathname.startsWith('/studio')) {
    const authCookie = request.cookies.get('studio-auth');

    // Эгер auth cookie жок болсо — login'ге жөнөт
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/studio-login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/studio/:path*',
};