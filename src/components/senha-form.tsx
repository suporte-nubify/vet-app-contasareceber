"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SenhaForm() {
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setOk(false);
    const res = await fetch("/api/senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ atual, nova, confirmacao }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error || "Não foi possível alterar a senha.");
      return;
    }
    setAtual("");
    setNova("");
    setConfirmacao("");
    setOk(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="atual">Senha atual</Label>
        <Input
          id="atual"
          type="password"
          autoComplete="current-password"
          value={atual}
          onChange={(e) => setAtual(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="nova">Nova senha</Label>
        <Input
          id="nova"
          type="password"
          autoComplete="new-password"
          value={nova}
          onChange={(e) => setNova(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <div>
        <Label htmlFor="confirmacao">Confirmar nova senha</Label>
        <Input
          id="confirmacao"
          type="password"
          autoComplete="new-password"
          value={confirmacao}
          onChange={(e) => setConfirmacao(e.target.value)}
          required
          minLength={6}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {ok && <p className="text-sm font-semibold text-teal-800">Senha alterada.</p>}
      <Button type="submit" className="w-full" size="lg" disabled={busy}>
        {busy ? "Salvando…" : "Salvar senha"}
      </Button>
    </form>
  );
}
