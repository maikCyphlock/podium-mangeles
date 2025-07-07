import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { createClientAdmin } from '@/lib/supabase/server';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_COOKIE = 'admin_token';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(JWT_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    jwt.verify(token, JWT_SECRET);
    // Eliminar la cookie
    const response = NextResponse.json({ ok: true });
    response.cookies.set(JWT_COOKIE, '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
    });

    // Registro de log de logout
    const supabase = await createClientAdmin(cookies());
    await supabase.from('activity_logs').insert([
      {
        user_id: 'admin',
        action: 'logout',
        details: { ip: request.headers.get('x-forwarded-for') || '' }
      }
    ]);
    return response;
  } catch (e) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
} 