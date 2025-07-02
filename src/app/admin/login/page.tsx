"use client"
import { useEffect, useState } from "react";
import { LoginForm } from '@/components/admin/LoginForm';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

export default function AdminLoginPage() {
  const [showInactivityModal, setShowInactivityModal] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("sessionClosedByInactivity") === "true") {
      setShowInactivityModal(true);
      localStorage.removeItem("sessionClosedByInactivity");
    }
  }, []);

  return (
    <>
      <Dialog open={showInactivityModal}>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Sesión cerrada por inactividad</DialogTitle>
          <DialogDescription>
            Por tu seguridad, la sesión se ha cerrado automáticamente tras un periodo de inactividad.
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoginForm />
      </div>
    </>
  );
} 