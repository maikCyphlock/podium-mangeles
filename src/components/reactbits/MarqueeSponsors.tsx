export default function Sponsor() {
  return (
    <div className="w-full flex flex-col  mt-12 items-center justify-center py-6 bg-white/80 border-b border-gray-100">
      <span className="text-md font-title font-normal text-zinc-400 ">Patrocinado por</span>
      <div className="flex gap-8 w-full border-t border-b my-6 flex-wrap items-center justify-center">
     
      <a href="https://www.instagram.com/apssanrafael/" target="_blank">
      <img
        src="https://res.cloudinary.com/dsgixewc9/image/upload/v1751556982/mis-angeles/qxdyvpvozclf3l71muy2.png"
        alt="Patrocinador"
  

        className="rounded-xl aspect-video h-[200px]  bg-white"
        style={{ objectFit: "contain" }}
      />
      </a>
        <a href="https://www.instagram.com/agui_dom/" target="_blank">
        <img
        src="https://res.cloudinary.com/dsgixewc9/image/upload/v1751556903/mis-angeles/ha77luh73cctwkllhszz.png"
        alt="Patrocinador"
        
  
        className="rounded-xl aspect-video h-[130px]   bg-white"
        style={{ objectFit: "contain" }}
      />
        </a>
      </div>
    </div>
  );
} 