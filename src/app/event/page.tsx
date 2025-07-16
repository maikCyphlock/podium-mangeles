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
          className="mb-4"
        />
        <h1 className="text-3xl font-title font-extrabold text-zinc-600 mb-1 text-center drop-shadow-sm">
          Inscripción Evento Deportivo
        </h1>
      
        
        <p className="text-gray-500 text-center mb-2 text-sm">
          El período de inscripción para este evento ha finalizado. Agradecemos tu interés.
        </p>
        
        {/* Mensaje de cierre de inscripciones */}
        <div className="w-full text-center p-6 bg-gray-50 rounded-lg border border-gray-200 mt-4">
          <div className="flex flex-col items-center">
            <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-yellow-600 mb-1">Inscripciones cerradas</h3>
            <p className="text-gray-500 text-sm">El período de registro para este evento ha finalizado.</p>
            <p className="text-gray-500 text-sm mt-2">¡Gracias por tu interés en nuestro evento deportivo!</p>
          </div>
        </div>
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