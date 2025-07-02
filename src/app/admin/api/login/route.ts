import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

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

    // Registro de log de login
    try {
      const cookieStore = cookies();
      const supabase = await createClient(cookieStore);
      await supabase.from('activity_logs').insert([
        {
          user_id: username, // No hay user real, usamos username
          action: 'login',
          details: { ip: request.headers.get('x-forwarded-for') || '' }
        }
      ]);
    } catch (e) {
      console.error(e)
    }

    return response;
  }
  return NextResponse.json({ ok: false }, { status: 401 });
} 