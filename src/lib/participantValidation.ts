export const GENDERS = ['masculino', 'femenino', 'otro'] as const;
export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export function validateParticipant(participant: any): string | null {
  if (!participant.firstName?.trim()) return 'El nombre es obligatorio.';
  if (!participant.lastName?.trim()) return 'El apellido es obligatorio.';
  if (!participant.email?.trim()) return 'El email es obligatorio.';
  if (!/^\S+@\S+\.\S+$/.test(participant.email)) return 'El email no es válido.';
  if (!participant.birthDate) return 'La fecha de nacimiento es obligatoria.';
  if (!participant.gender || !GENDERS.includes(participant.gender)) return 'El género es obligatorio y debe ser válido.';
  if (!participant.country?.trim()) return 'El país es obligatorio.';
  if (!participant.city?.trim()) return 'La ciudad es obligatoria.';
  if (!participant.phone?.trim()) return 'El teléfono es obligatorio.';
  if (!participant.emergencyContact?.trim()) return 'El contacto de emergencia es obligatorio.';
  if (!participant.bloodType || !BLOOD_TYPES.includes(participant.bloodType)) return 'El tipo de sangre es obligatorio y debe ser válido.';
  return null;
}