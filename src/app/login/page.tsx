"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VetMark } from "@/components/vet-mark";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Usuário ou senha inválidos.");
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5 py-10">
      <div className="mb-8">
        <VetMark className="h-16 w-16 rounded-3xl" iconClassName="h-8 w-8" />
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-coral-600">
          Clínica veterinária
        </p>
        <p className="mt-1 font-display text-4xl font-semibold tracking-tight text-teal-950">
          Contas a Receber
        </p>
        <p className="mt-2 text-base text-stone-600">
          Recebimentos da clínica, com tutores, pets e procedimentos.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-teal-100 bg-white/95 p-5 shadow-md shadow-teal-700/5">
        <div>
          <Label htmlFor="username">Usuário</Label>
          <Input
            id="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </Button>
      </form>
    </main>
  );
}
