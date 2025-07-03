import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import jwt from 'jsonwebtoken';

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_COOKIE = 'admin_token';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    // Generar JWT
    const payload = { username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(JWT_COOKIE, token, {
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