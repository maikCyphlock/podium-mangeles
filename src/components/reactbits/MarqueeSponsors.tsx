export default function Sponsor() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-6 bg-white/80 border-t border-b border-gray-100">
      <span className="text-sm text-gray-500 mb-2">Patrocinado por:</span>
      <img
        src="/patro-1.jpeg"
        alt="Patrocinador"
        width={140}
        height={70}
        className="rounded-xl shadow border border-yellow-300 bg-white"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
} 