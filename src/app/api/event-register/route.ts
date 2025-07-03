import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.json();
  const { captchaToken, ...participantData } = body;

  // Validar el token de Turnstile
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secretKey}&response=${captchaToken}`,
  });
  const data = await verifyRes.json();

  if (!data.success) {
    return NextResponse.json({ ok: false, error: 'Captcha inválido' }, { status: 400 });
  }

  // Insertar participante en Supabase
  const supabase = await createClient(cookies());
  const { error } = await supabase.from('participant').insert([participantData]);
  if (error) {
    return NextResponse.json({ ok: false, error: 'Error al registrar participante' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
} 