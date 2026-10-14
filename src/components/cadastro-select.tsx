"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type CadastroOption = { id: string; nome: string };

type Props = {
  label: string;
  options: CadastroOption[];
  value: string;
  onChange: (id: string) => void;
  onCreate: (nome: string) => Promise<CadastroOption>;
  allowEmpty?: boolean;
  emptyLabel?: string;
  required?: boolean;
};

export function CadastroSelect({
  label,
  options,
  value,
  onChange,
  onCreate,
  allowEmpty,
  emptyLabel = "Não informado",
  required,
}: Props) {
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.nome.toLowerCase().includes(q));
  }, [options, query]);

  async function handleCreate() {
    const nome = newName.trim();
    if (!nome) {
      setError("Informe um nome.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const created = await onCreate(nome);
      onChange(created.id);
      setCreating(false);
      setNewName("");
      setQuery("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível cadastrar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required ? " *" : ""}
      </Label>
      {!creating ? (
        <>
          <Input
            placeholder="Buscar…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-2"
          />
          <div className="max-h-44 overflow-y-auto rounded-xl border border-stone-200 bg-stone-50">
            {allowEmpty && (
              <button
                type="button"
                onClick={() => onChange("")}
                className={`block w-full min-h-11 px-3 text-left text-base ${
                  value === "" ? "bg-teal-100 text-teal-900 font-semibold" : "text-stone-700"
                }`}
              >
                {emptyLabel}
              </button>
            )}
            {filtered.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange(opt.id)}
                className={`block w-full min-h-11 px-3 text-left text-base border-t border-stone-200 ${
                  value === opt.id ? "bg-teal-100 text-teal-900 font-semibold" : "text-stone-800"
                }`}
              >
                {opt.nome}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-3 text-sm text-stone-500">Nenhum resultado.</p>
            )}
          </div>
          <Button type="button" variant="secondary" className="w-full" onClick={() => setCreating(true)}>
            + Cadastrar novo…
          </Button>
        </>
      ) : (
        <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-3 space-y-3">
          <p className="text-sm font-semibold text-teal-900">Novo {label.toLowerCase()}</p>
          <Input
            autoFocus
            placeholder="Nome"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button type="button" className="flex-1" disabled={busy} onClick={handleCreate}>
              {busy ? "Salvando…" : "Salvar e usar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={busy}
              onClick={() => {
                setCreating(false);
                setError("");
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
