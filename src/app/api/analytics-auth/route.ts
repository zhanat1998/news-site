// app/api/analytics-auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Серверде гана - коопсуз!
const ANALYTICS_PASSWORD = process.env.ANALYTICS_PASSWORD || '';

// Жөнөкөй токен генерациясы
function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Токенди текшерүү (жөнөкөй - cookie менен)
const VALID_TOKEN_PREFIX = 'sokol_analytics_';

export async function POST(request: NextRequest) {
  try {
    const { password, action } = await request.json();

    // Чыгуу
    if (action === 'logout') {
      const cookieStore = await cookies();
      cookieStore.delete('analytics_token');
      return NextResponse.json({ success: true });
    }

    // Кирүү
    if (!password) {
      return NextResponse.json({ error: 'Пароль керек' }, { status: 400 });
    }

    if (password !== ANALYTICS_PASSWORD) {
      // Brute force коргоо - жай жооп берүү
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ error: 'Туура эмес пароль' }, { status: 401 });
    }

    // Туура пароль - токен берүү
    const token = VALID_TOKEN_PREFIX + generateToken();

    const cookieStore = await cookies();
    cookieStore.set('analytics_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 күн
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Ката чыкты' }, { status: 500 });
  }
}

// Токен текшерүү
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('analytics_token')?.value;

    if (!token || !token.startsWith(VALID_TOKEN_PREFIX)) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}