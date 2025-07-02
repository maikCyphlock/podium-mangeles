"use client"
import { ReactNode, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

// Hook de auto-logout por inactividad
function useAutoLogout(logoutFn: () => void) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_LIMIT = 5 * 60 * 1000; // 1 minuto para pruebas

  useEffect(() => {
    const resetTimer = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        logoutFn();
      }, INACTIVITY_LIMIT);
    };
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [logoutFn]);
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sessionClosed, setSessionClosed] = useState(false);
  const router = useRouter();

  useAutoLogout(() => {
    fetch("/admin/api/logout", { method: "POST" });
    setSessionClosed(true);
    setTimeout(() => {
      setSessionClosed(false);
      router.push("/admin/login");
    }, 4000); // Muestra el mensaje 2 segundos antes de redirigir
  });

  return (
    <>
      <Dialog open={sessionClosed}>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Sesión cerrada por inactividad</DialogTitle>
          <DialogDescription>
            Por tu seguridad, la sesión se ha cerrado automáticamente tras un periodo de inactividad.
          </DialogDescription>
        </DialogContent>
      </Dialog>
      {children}
    </>
  );
} 