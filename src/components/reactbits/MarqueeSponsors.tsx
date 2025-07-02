export default function Sponsor() {
  return (
    <div className="w-full flex flex-col  mt-12 items-center justify-center py-6 bg-white/80 border-t border-b border-gray-100">
      <span className="text-sm font-bold text-gray-500 ">Patrocinado por:</span>
      <img
        src="/patro-1.png"
        alt="Patrocinador"
        width={200}
        height={70}
        className="rounded-xl  bg-white"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
} 