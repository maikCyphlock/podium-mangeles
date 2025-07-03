import { ParticipantsTable } from '@/components/admin/ParticipantsTable';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { LogoutButton } from '@/components/admin/LogoutButton';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

export default async function Page() {
  // Comprobar JWT en cookie
  const cookieStore = await cookies();
  const token = await cookieStore.get('admin_token')?.value;
 
  const JWT_SECRET = process.env.JWT_SECRET!;
  if (!token) {
    redirect('/admin/login');
  }
  try {
    jwt.verify(token, JWT_SECRET);
  } catch (e) {
    redirect('/admin/login');
  }
  // Obtener participantes desde Supabase (solo los que no están eliminados)
  const supabase = await createClient(cookies());
  const { data: participants, error } = await supabase
    .from('participant')
    .select('*')
    .is('deleted_at', null)
    .order('createdAt', { ascending: false });

  if (error) {
    return <div>Error al cargar los participantes: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Administración de Participantes</h1>
        <LogoutButton/>
      </div>
      <ParticipantsTable participants={participants || []} />
    </div>
  );
}
