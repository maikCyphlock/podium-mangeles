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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-[120vw] h-[320px] pointer-events-none z-0 opacity-60" style={{filter: 'blur(2px)'}}>
        <Aurora
          colorStops={["#338fff", "#64ff61", "#338fff"]}
          blend={0.5}
          amplitude={1.2}
          speed={0.5}
        />
      </div>
      <main className="relative mt-12 z-10 w-full flex flex-col items-center justify-center">
        <header className="flex flex-col items-center mb-8 sm:mb-10 w-full max-w-2xl">
          <div ref={imageRef}>
            <Image
              src="/mis-angeles.png"
              alt="Logo Farmacia Mis Ángeles"
              width={180}
              height={180}
              className="mb-8 sm:mb-12 mx-auto"
              priority
            />
          </div>
          <h1
            ref={titleRef}
            className="font-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-2 text-center drop-shadow-sm px-2"
          >
            Evento Deportivo
          </h1>
          <p
            ref={descRef}
            className="text-base sm:text-lg md:text-xl text-gray-600 text-center max-w-md sm:max-w-xl mx-auto px-2 heading-text "
          >
            Únete a la celebración deportiva del día del niño organizada por la <span className="font-semibold text-pink-600">Farmacia Mis Ángeles</span>. Vive una jornada llena de energía, amistad y diversión para los niños de la casa.
          </p>
        </header>
        <section
          ref={activitiesRef}
          className="w-full max-w-2xl flex flex-col gap-4 sm:gap-6 md:flex-row md:gap-6 justify-center mb-8 sm:mb-10 px-2"
        >
          <div className="flex-1 flex flex-row md:flex-col items-center justify-center gap-2 md:gap-0 activity-item bg-white/80 rounded-xl py-3 md:py-6 shadow-sm border border-gray-100">
            <span className="text-2xl sm:text-3xl mb-0 md:mb-1">
              <img src="/soccer.png" alt="Futbol" className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32" />
            </span>
            <span className="font-medium text-gray-700 text-sm sm:text-base">Fútbol</span>
          </div>
          <div className="flex-1 flex flex-row md:flex-col items-center justify-center gap-2 md:gap-0 activity-item bg-white/80 rounded-xl py-3 md:py-6 shadow-sm border border-gray-100">
            <span className="text-2xl sm:text-3xl mb-0 md:mb-1">
              <img src="/yimcana.png" alt="Yincana" className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32" />
            </span>
            <span className="font-medium text-gray-700 text-sm sm:text-base">Yincanas</span>
          </div>
          <div className="flex-1 flex flex-row md:flex-col items-center justify-center gap-2 md:gap-0 activity-item bg-white/80 rounded-xl py-3 md:py-6 shadow-sm border border-gray-100">
            <span className="text-2xl sm:text-3xl mb-0 md:mb-1">
              <img src="running.png" alt="Atletismo" className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32" />
            </span>
            <span className="font-medium text-gray-700 text-sm sm:text-base">Atletismo</span>
          </div>
        </section>
        <Link href="/event" className="w-full flex justify-center max-w-xs">
          <RainbowButton className="text-lg font-bold" >
            Inscribirse al evento
          </RainbowButton>
        </Link>
        <Sponsor />
        <footer className="mt-12 sm:mt-16 text-xs text-gray-400 text-center w-full px-2">
          © {new Date().getFullYear()} Farmacia Mis Ángeles. Todos los derechos reservados.
      </footer>
      </main>
    </div>
  );
}
