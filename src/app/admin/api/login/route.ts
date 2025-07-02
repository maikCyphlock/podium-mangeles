import { NextResponse } from 'next/server';

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const SESSION_COOKIE = 'admin_session';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, 'valid', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 8, // 8 horas
      sameSite: 'lax',
    });
    return response;
  }
  return NextResponse.json({ ok: false }, { status: 401 });
} 