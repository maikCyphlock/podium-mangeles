"use client"
import { RainbowButton } from "@/components/magicui/rainbow-button";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import Aurora from "@/components/reactbits/aurora";
import Sponsor from "@/components/reactbits/MarqueeSponsors";

export default function Home() {
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const activitiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.getElementById("landing-root");
    if (root) root.style.opacity = "1";
    if (imageRef.current && titleRef.current && descRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        descRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.9, ease: "power3.out" }
      );
    }
    if (activitiesRef.current) {
      gsap.fromTo(
        activitiesRef.current.querySelectorAll('.activity-item'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 1.3,
          ease: "power3.out"
        }
      );
    }
  }, []);

  return (
    <div id="landing-root" className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-x-hidden opacity-0 transition-opacity duration-300">
      {/* Aurora decorativa arriba, sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-[120vw] h-[320px] pointer-events-none z-0 opacity-60" style={{ filter: 'blur(2px)' }}>
        <Aurora
          colorStops={["#338fff", "#64ff61", "#338fff"]}
          blend={0.4}
          amplitude={1.2}
          speed={0.5}
        />
      </div>
      <main className="relative mt-12 z-10 w-full flex flex-col items-center justify-center">
        <header className="flex flex-col items-center mb-8 w-full max-w-2xl">
          <div ref={imageRef}>
            <Image
              src="/mis-angeles.png"
              alt="Logo Farmacia Mis Ángeles"
              width={180}
              height={180}
              className="mb-6 mx-auto"
              priority
            />
          </div>
          <h1
            ref={titleRef}
            className="font-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-2 text-center drop-shadow-sm px-2"
          >
            EVENTO DEPORTIVO "ÁNGELES CAMPEONES"
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl text-gray-700 text-center max-w-md sm:max-w-xl mx-auto px-2 heading-text font-medium mb-4"
          >
            Únete a la celebración deportiva organizada por la <span className="font-semibold text-pink-600">Farmacia Mis Ángeles</span>.
          </p>
        </header>
        {/* Bloque de información clave */}
        <section className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-2">
          <div className="flex items-center gap-3 bg-zinc-50 rounded-xl p-4 shadow activity-item">
            <span className="text-2xl">
            <img src="calendar.png" className="w-14" alt="" />
            </span>
            <div>
              <div className="font-bold text-gray-800">Sábado 26 de julio</div>
              <div className="text-gray-600 text-sm">Desde las 8:30 am</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-zinc-50 rounded-xl p-4 shadow activity-item">
            <span className="text-2xl">
            <img src="map.png" className="w-14" alt="" />
            </span>
            <div>
              <div className="font-bold text-gray-800">Estadio José Antonio Páez</div>
              <div className="text-gray-600 text-sm">Pista de atletismo, Araure</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-zinc-50 rounded-xl p-4 shadow activity-item">
            <span className="text-2xl">
              <img src="toddler.png" className="w-14" alt="" />
            </span>
            <div>
              <div className="font-bold text-gray-800">Niños y niñas</div>
              <div className="text-gray-600 text-sm">De 3 a 12 años</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-zinc-50 rounded-xl p-4 shadow activity-item">
            <span className="text-2xl">
            <img src="cash.png" className="w-14" alt="" />
            </span>
            <div>
              <div className="font-bold text-green-700">TOTALMENTE GRATIS</div>
            </div>
          </div>
        </section>
        {/* Bloque de actividades */}
        <section className="w-full max-w-2xl flex flex-col items-center mb-8">
          <p className="text-base sm:text-lg text-gray-700 text-center mb-4 p-2">
          Vive Una jornada llena de deportes, diversion y alegría.
          Tendremos un montón de <strong>sorpresas</strong>, juegos y actividades para que cada niño se sienta un <strong>verdadero campeón</strong>:
          </p>
          <div ref={activitiesRef} className="w-full flex flex-col gap-5 sm:gap-6 md:flex-row md:gap-6 justify-center mb-2 px-2">
            <div className="flex-1 flex flex-row md:flex-col items-center justify-center gap-3 md:gap-0 activity-item bg-white/90 rounded-2xl py-5 md:py-8 shadow-lg border border-gray-200 transition-all relative overflow-hidden">
              <span className="mb-0 md:mb-2">
                <img src="/soccer.png" alt="Fútbol" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 z-10 relative" />
              </span>
              <span className="font-bold text-gray-800 text-lg sm:text-xl md:text-2xl z-10">Fútbol</span>
            </div>
            <div className="flex-1 flex flex-row md:flex-col items-center justify-center gap-3 md:gap-0 activity-item bg-white/90 rounded-2xl py-5 md:py-8 shadow-lg border border-gray-200 transition-all relative overflow-hidden">
              <span className="mb-0 md:mb-2">
                <img src="/yimcana.png" alt="Yincana" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 z-10 relative" />
              </span>
              <span className="font-bold text-gray-800 text-lg sm:text-xl md:text-2xl z-10">Yincanas</span>
            </div>
            <div className="flex-1 flex flex-row md:flex-col items-center justify-center gap-3 md:gap-0 activity-item bg-white/90 rounded-2xl py-5 md:py-8 shadow-lg border border-gray-200 transition-all relative overflow-hidden">
              <span className="mb-0 md:mb-2">
                <img src="/running.png" alt="Atletismo" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 z-10 relative" />
              </span>
              <span className="font-bold text-gray-800 text-lg sm:text-xl md:text-2xl z-10">Atletismo</span>
            </div>
          </div>
        </section>
        <Link href="/event" className="w-full flex justify-center max-w-xs">
          <RainbowButton className="text-lg font-bold hover:scale-110" >
            ¡INSCRIBETE YA!
          </RainbowButton>
        </Link>
        <Sponsor />
        <footer className="mt-12 sm:mt-16 w-full px-2 py-6 bg-white border-t border-gray-200 text-center text-xs sm:text-sm text-gray-500 shadow-none bg-zinc-900 text-zinc-100">
          <div>
            © {new Date().getFullYear()} Farmacia Mis Ángeles
          </div>
          <div className="mt-1 flex  items-center justify-center gap-1">
            <span>
              Hecho con mucho amor
            </span>
            <a href="https://www.instagram.com/maikol_aguilar__/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
              por @maikol aguilar
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
