import Image from "next/image";

export default function EventPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-pink-100 to-yellow-100 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-2xl bg-white/80 rounded-3xl shadow-xl p-6 flex flex-col items-center border-4 border-yellow-300 relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <Image
            src="/mis-angeles.png"
            alt="Logo Farmacia Mis Ángeles"
            width={120}
            height={120}
            className="rounded-full border-4 border-pink-300 bg-white shadow-lg"
            priority
          />
        </div>
        <div className="mt-16 text-center">
          <h1 className="text-4xl font-extrabold text-pink-600 drop-shadow mb-2">¡Gran Evento Deportivo!</h1>
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Celebración de la Farmacia Mis Ángeles</h2>
          <p className="text-lg text-gray-700 mb-6">
            Ven con tu familia y amigos a disfrutar de un día lleno de <span className="font-bold text-yellow-600">diversión</span>, <span className="font-bold text-green-600">deporte</span> y <span className="font-bold text-pink-500">alegría</span> para grandes y pequeños.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <div className="bg-blue-100 border-2 border-blue-300 rounded-xl p-4 flex-1 min-w-[180px] flex flex-col items-center">
              <span className="text-3xl">⚽</span>
              <h3 className="font-bold text-blue-700 mt-2 mb-1">Fútbol</h3>
              <p className="text-sm text-blue-800">Partidos y mini-torneos para todas las edades.</p>
            </div>
            <div className="bg-pink-100 border-2 border-pink-300 rounded-xl p-4 flex-1 min-w-[180px] flex flex-col items-center">
              <span className="text-3xl">🎯</span>
              <h3 className="font-bold text-pink-600 mt-2 mb-1">Yincanas</h3>
              <p className="text-sm text-pink-700">Juegos y retos en equipo, ¡diversión asegurada!</p>
            </div>
            <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-4 flex-1 min-w-[180px] flex flex-col items-center">
              <span className="text-3xl">🏃‍♂️</span>
              <h3 className="font-bold text-yellow-600 mt-2 mb-1">Atletismo</h3>
              <p className="text-sm text-yellow-700">Carreras y pruebas para niños y adultos.</p>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-lg font-semibold text-green-700">¡Premios, sorpresas y mucha alegría!</p>
            <p className="text-md text-gray-600">No olvides traer tu mejor sonrisa y ganas de participar.</p>
          </div>
          <div className="flex flex-col items-center gap-2 mt-4">
            <span className="text-sm text-gray-500">Patrocinado por:</span>
            <Image
              src="/patro-1.jpeg"
              alt="Patrocinador"
              width={120}
              height={60}
              className="rounded-xl border-2 border-yellow-400 shadow"
            />
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Farmacia Mis Ángeles. Todos los derechos reservados.
      </div>
    </div>
  );
} 