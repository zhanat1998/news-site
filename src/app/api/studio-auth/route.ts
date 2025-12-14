// app/api/studio-auth/route.ts
import { NextRequest, NextResponse } from 'next/server';

const STUDIO_USERNAME = process.env.STUDIO_USERNAME;
const STUDIO_PASSWORD = process.env.STUDIO_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (username === STUDIO_USERNAME && password === STUDIO_PASSWORD) {
      const response = NextResponse.json({ success: true });

      // Cookie орнот — 7 күн
      response.cookies.set('studio-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 күн
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
