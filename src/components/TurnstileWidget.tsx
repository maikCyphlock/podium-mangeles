"use client";
import { useEffect, useRef } from "react";
import { Turnstile } from "next-turnstile";
export default function TurnstileWidget({ sitekey }: { sitekey: string }) {
    const handleVerify = (token: string) => {
        // Handle the verification token
        console.log("Verification successful:", token);
      };


  return <Turnstile siteKey={sitekey} />;
}