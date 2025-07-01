import { ParticipantsTable } from '@/components/admin/ParticipantsTable';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { LogoutButton } from '@/components/admin/LogoutButton';
export default async function AdminPage() {
  // Obtener participantes desde Supabase
  const supabase = await createClient(cookies());
  const { data: participants, error } = await supabase
    .from('participant')
    .select('*')
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
