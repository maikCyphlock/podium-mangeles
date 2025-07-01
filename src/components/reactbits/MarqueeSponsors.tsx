

export default function MarqueeSponsors() {
  return (
    <div className="w-full flex justify-center overflow-hidden py-4 bg-white/80 border-t border-b border-gray-100">
      <div className="marquee w-full flex items-center gap-12 animate-marquee">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-shrink-0">
            <img
              src="/patro-1.jpeg"
              alt="Patrocinador"
              width={120}
              height={60}
              className="rounded-xl shadow border border-yellow-300 bg-white"
              style={{ objectFit: "contain" }}
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        .marquee {
          width: max-content;
          animation: marquee 18s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
} 