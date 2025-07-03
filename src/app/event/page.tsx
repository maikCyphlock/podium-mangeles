"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle, AlertCircle, User, Droplet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TurnstileWidget from "@/components/TurnstileWidget";
const genderOptions = [
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
  { value: "otro", label: "Otro" },
];
const bloodTypes = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
];

const schema = z.object({
  firstName: z.string().min(2, "El nombre es obligatorio"),
  lastName: z.string().min(2, "El apellido es obligatorio"),
  email: z.string().email("Email inválido"),
  birthDate: z.string().min(1, "Fecha requerida"),
  gender: z.enum(["masculino", "femenino", "otro"]),
  country: z.string().min(2, "País requerido"),
  city: z.string().min(2, "Ciudad requerida"),
  phone: z.string().min(7, "Teléfono requerido"),
  emergencyContact: z.string().min(2, "Contacto de emergencia requerido"),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
});

type FormData = z.infer<typeof schema>;

export default function EventPage() {
  const [participantes, setParticipantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Fetch participantes
  const fetchParticipantes = async () => {
    setLoading(true);
    const { data } = await createClient()
      .from("participant")
      .select("*")
      .is('deleted_at', null)
      .order("createdAt", { ascending: false })
      .limit(20)
      ;
    setParticipantes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchParticipantes();
  }, []);

  // Enviar formulario
  const onSubmit = async (data: FormData) => {
    setSuccess(false);
    setErrorMsg("");
    setSubmitting(true);
    // Obtener el token de Turnstile
    const captchaInput = document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null;
    const captchaToken = captchaInput?.value;
    if (!captchaToken) {
      setErrorMsg("Por favor resuelve el captcha.");
      setSubmitting(false);
      return;
    }
    // Enviar datos y token al backend
    const res = await fetch("/api/event-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, captchaToken }),
    });
    const result = await res.json();
    setSubmitting(false);
    if (res.ok && result.ok) {
      setSuccess(true);
      reset();
      fetchParticipantes();
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setErrorMsg(result.error || "Error al registrar. Intenta de nuevo.");
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-zinc-50 flex flex-col items-center py-8 px-2">
      {/* Logo y título */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border border-gray-100 mb-6">
        <img
          src="https://res.cloudinary.com/dsgixewc9/image/upload/v1751556963/mis-angeles/y9bmp5ublnwte7v1ie7h.png"
          alt="Logo Farmacia Mis Ángeles"
          width={90}
          height={90}
          className="mb-4 "
        
        />
        <h1 className="text-3xl font-title font-extrabold text-zinc-600 mb-1 text-center drop-shadow-sm">
          Inscripción Evento Deportivo
        </h1>
        <p className="text-gray-500 text-center mb-2 text-sm">
          Completa el formulario para participar. Todos los campos son obligatorios.
        </p>
        {/* Mensajes de éxito/error */}
        {success && (
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 text-zinc-700 rounded px-3 py-2 mb-2 animate-fade-in">
            <CheckCircle className="w-4 h-4" /> ¡Registro exitoso!
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded px-3 py-2 mb-2 animate-fade-in">
            <AlertCircle className="w-4 h-4" /> {errorMsg}
          </div>
        )}
        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 mt-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="Ej: Juan"
                aria-invalid={!!errors.firstName}
                autoComplete="given-name"
              />
              {errors.firstName && <span className="error">{errors.firstName.message}</span>}
            </div>
            <div className="flex-1">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Ej: Pérez"
                aria-invalid={!!errors.lastName}
                autoComplete="family-name"
              />
              {errors.lastName && <span className="error">{errors.lastName.message}</span>}
            </div>
          </div>
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              {...register("email")}
              placeholder="Ej: juan.perez@email.com"
              type="email"
              aria-invalid={!!errors.email}
              autoComplete="email"
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>
          <div>
            <Label htmlFor="birthDate">Fecha de nacimiento</Label>
            <Input
              id="birthDate"
              {...register("birthDate")}
              type="date"
              aria-invalid={!!errors.birthDate}
              autoComplete="bday"
            />
            {errors.birthDate && <span className="error">{errors.birthDate.message}</span>}
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="gender">Género</Label>
              <select id="gender" {...register("gender")} className={`input ${errors.gender ? "border-red-300" : ""}`} aria-invalid={!!errors.gender}>
                <option value="">Selecciona</option>
                {genderOptions.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
              {errors.gender && <span className="error">{errors.gender.message}</span>}
            </div>
            <div className="flex-1">
              <Label htmlFor="bloodType">Tipo de sangre</Label>
              <select id="bloodType" {...register("bloodType")} className={`input ${errors.bloodType ? "border-red-300" : ""}`} aria-invalid={!!errors.bloodType}>
                <option value="">Selecciona</option>
                {bloodTypes.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {errors.bloodType && <span className="error">{errors.bloodType.message}</span>}
            </div>
          </div>
          <div>
            <Label hidden htmlFor="country">País</Label>
            <Input
              id="country"
              {...register("country")}
              placeholder="Ej: Venezuela"
              aria-invalid={!!errors.country}
              value={"Venezuela"}
              hidden
              autoComplete="country"
            />
            {errors.country && <span className="error">{errors.country.message}</span>}
          </div>
          <div>
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              {...register("city")}
              placeholder="Ej: Caracas"
              aria-invalid={!!errors.city}
              autoComplete="address-level2"
            />
            {errors.city && <span className="error">{errors.city.message}</span>}
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Ej: 0412-1234567"
              type="tel"
              aria-invalid={!!errors.phone}
              autoComplete="tel"
            />
            {errors.phone && <span className="error">{errors.phone.message}</span>}
          </div>
          <div>
            <Label htmlFor="emergencyContact">Contacto de emergencia</Label>
            <Input
              id="emergencyContact"
              {...register("emergencyContact")}
              placeholder="Ej: María Pérez (madre) 0412-7654321"
              aria-invalid={!!errors.emergencyContact}
            />
            <span className="text-xs text-gray-400">Nombre y teléfono de la persona a contactar en caso de emergencia.</span>
            {errors.emergencyContact && <span className="error">{errors.emergencyContact.message}</span>}
          </div>
          <TurnstileWidget sitekey="0x4AAAAAABjQeI7rlk0t6Vs0"></TurnstileWidget>
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded transition flex items-center justify-center gap-2"
          >
            {submitting && (
              <span className="loader border-white border-t-green-500"></span>
            )}
            {submitting ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </div>
      {/* Lista de participantes */}
      <div className="w-full max-w-md mt-8 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-title text-lg text-blue-700">Participantes registrados</h2>
          <span className="text-xs text-gray-400">{participantes.length} inscrito{participantes.length !== 1 && "s"}</span>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse h-10 bg-gray-100 rounded" />
            ))}
          </div>
        ) : participantes.length === 0 ? (
          <p className="text-gray-400">Aún no hay registros.</p>
        ) : (
          <ul className="text-sm divide-y divide-gray-100 max-h-72 overflow-y-auto">
            {participantes.map((p) => (
              <li key={p.id} className="py-2 flex items-center gap-3">
                <span className="bg-zinc-100 text-zinc-600 rounded-full p-2">
                  <User className="w-4 h-4" />
                </span>
                <div className="flex-1">
                  <span className="font-semibold">{p.firstName} {p.lastName}</span>
                  <div className="text-xs text-gray-500">{p.city}, {p.country}</div>
                </div>
                <span className="flex items-center gap-1 text-blue-700 font-mono">
                  <Droplet className="w-4 h-4 text-blue-400" /> {p.bloodType}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Estilos extra */}
      <style jsx global>{`
        /* Los estilos de input y label ahora los maneja shadcn-ui */
        .input:focus {
          border-color: #ec4899;
          box-shadow: 0 0 0 2px #fbcfe8;
        }
        .error {
          color: #dc2626;
          font-size: 0.85em;
          margin-top: 2px;
          display: block;
          animation: fade-in 0.2s;
        }
        .loader {
          border: 2px solid #f3f3f3;
          border-radius: 50%;
          border-top: 2px solid #ec4899;
          width: 1em;
          height: 1em;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        @keyframes fade-in {
          from { opacity: 0;}
          to { opacity: 1;}
        }
      `}</style>
    </div>
  );
}