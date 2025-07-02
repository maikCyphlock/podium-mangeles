import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });

  // Registro de log de logout
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    // Intentar obtener el usuario de la cookie (si existiera)
    const user_id = null; // Puedes mejorar esto si guardas el usuario en la sesión
    await supabase.from('activity_logs').insert([
      {
        user_id,
        action: 'logout',
        details: { }
      }
    ]);
  } catch (e) {
    console.error(e)
  }

  return response;
} 