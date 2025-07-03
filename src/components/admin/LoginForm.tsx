'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/admin/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      router.push('/admin');
      window.location.href = "/admin";
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl rounded-xl p-8 flex flex-col gap-5 min-w-[320px] border border-emerald-100 animate-fade-in"
    >
      <h2 className="text-2xl font-bold text-emerald-700 text-center mb-2">Panel de administración</h2>
      <Input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        autoFocus
        className=""
      />
      <Input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className=""
      />
      <div className="cf-turnstile" data-sitekey="0x4AAAAAABjQeI7rlk0t6Vs0"></div>
      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">Entrar</Button>
      {error && <div className="text-red-600 text-center text-sm mt-2 animate-fade-in">{error}</div>}
    </form>
  );
} 