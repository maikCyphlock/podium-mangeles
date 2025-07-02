export default function Sponsor() {
  return (
    <div className="w-full flex flex-col  mt-12 items-center justify-center py-6 bg-white/80 border-t border-b border-gray-100">
      <span className="text-sm font-bold text-gray-500 ">Patrocinado por:</span>
      <div className="flex gap-8 flex-wrap items-center justify-center">
     
      <a href="https://www.instagram.com/apssanrafael/" target="_blank">
      <img
        src="/patro-1.png"
        alt="Patrocinador"
  

        className="rounded-xl aspect-video h-[200px]  bg-white"
        style={{ objectFit: "contain" }}
      />
      </a>
        <a href="https://www.instagram.com/agui_dom/" target="_blank">
        <img
        src="/aguidom.png"
        alt="Patrocinador"
        
  
        className="rounded-xl aspect-video h-[130px]   bg-white"
        style={{ objectFit: "contain" }}
      />
        </a>
      </div>
    </div>
  );
} 