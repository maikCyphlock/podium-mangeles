import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClientAdmin } from '@/lib/supabase/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_COOKIE = 'admin_token';
const ALLOWED_ORIGIN = 'https://mis-angeles.vercel.app/';
const isProd = process.env.NODE_ENV === 'production';

function isAllowedOrigin(request: Request) {
  if (!isProd) return true;
  const origin = request.headers.get('origin') || request.headers.get('referer') || '';
  return origin.startsWith(ALLOWED_ORIGIN);
}

// Solo permite método DELETE
export async function DELETE(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Dominio no permitido' }, { status: 403 });
  }
  // Obtener el id del participante a borrar
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Falta el id del participante' }, { status: 400 });
  }

  // Verificar sesión admin por JWT
  const cookieStore = cookies();
  const token =  (await cookieStore).get(JWT_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  // Soft delete: marcar deleted_at
  const supabase = await createClientAdmin(cookieStore);
  const { error } = await supabase
    .from('participant')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    return NextResponse.json({ error: 'Error al eliminar participante' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

// Permite método PATCH para actualizar un participante
export async function PATCH(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Dominio no permitido' }, { status: 403 });
  }
  // Verificar sesión admin por JWT
  const cookieStore = cookies();
  const token = (await cookieStore).get(JWT_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  // Obtener datos del body
  const body = await request.json();
  const { id, ...fields } = body;
  if (!id) {
    return NextResponse.json({ error: 'Falta el id del participante' }, { status: 400 });
  }

  // Actualizar participante
  const supabase = await createClientAdmin(cookieStore);
  const { error } = await supabase
    .from('participant')
    .update(fields)
    .eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
} 