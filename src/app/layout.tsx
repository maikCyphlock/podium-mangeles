import type { Metadata } from "next";
import "@fontsource/bebas-neue/400.css";
import "@fontsource/quicksand/400.css";
import "@fontsource/quicksand/500.css";
import "@fontsource/quicksand/700.css";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import Head from "next/head";

export const metadata: Metadata = {
  title: "Evento Deportivo Mis Ángeles",
  description: "Evento Deportivo Mis Ángeles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-quicksand antialiased"
      >
        <Head>
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback"
          async
          defer
        ></script>
        <Analytics/>
        </Head>
        
     
          {children}
  
      </body>
    </html>
  );
}
