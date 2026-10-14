"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Item = { id: string; nome: string };

type TipoKey = "tutores" | "procedimentos" | "estabelecimentos" | "formas-pagamento";

const labels: Record<TipoKey, string> = {
  tutores: "Tutores",
  procedimentos: "Procedimentos",
  estabelecimentos: "Estabelecimentos",
  "formas-pagamento": "Formas de pagamento",
};

export function CadastrosManager({
  initial,
}: {
  initial: Record<TipoKey, Item[]>;
}) {
  const [tab, setTab] = useState<TipoKey>("tutores");
  const [data, setData] = useState(initial);
  const [nome, setNome] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function selectTab(key: TipoKey) {
    setTab(key);
    setEditingId(null);
    setEditNome("");
    setError("");
  }

  async function add() {
    const n = nome.trim();
    if (!n) return;
    setBusy(true);
    setError("");
    const res = await fetch(`/api/cadastros/${tab}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: n }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error || "Erro ao cadastrar");
      return;
    }
    setData((d) => ({
      ...d,
      [tab]: [...d[tab].filter((x) => x.id !== json.id), json].sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt-BR")
      ),
    }));
    setNome("");
  }

  function startEdit(item: Item) {
    setEditingId(item.id);
    setEditNome(item.nome);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditNome("");
    setError("");
  }

  async function saveEdit(id: string) {
    const n = editNome.trim();
    if (!n) return;
    setBusy(true);
    setError("");
    const res = await fetch(`/api/cadastros/${tab}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: n }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error || "Não foi possível salvar");
      return;
    }
    setData((d) => ({
      ...d,
      [tab]: d[tab]
        .map((item) => (item.id === id ? { ...item, nome: json.nome as string } : item))
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    }));
    setEditingId(null);
    setEditNome("");
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(labels) as TipoKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => selectTab(key)}
            className={`min-h-11 rounded-xl px-3 text-sm font-semibold ${
              tab === key ? "bg-teal-700 text-white" : "bg-white border border-stone-300 text-stone-700"
            }`}
          >
            {labels[key]}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder={`Novo ${labels[tab].slice(0, -1).toLowerCase()}…`}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <Button type="button" disabled={busy} onClick={add}>
          Adicionar
        </Button>
      </div>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <ul className="space-y-2">
        {data[tab].map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2 rounded-xl border border-teal-100 bg-white px-3 py-2"
          >
            {editingId === item.id ? (
              <div className="flex w-full flex-col gap-2">
                <Input
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  aria-label={`Editar ${item.nome}`}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button type="button" className="flex-1" disabled={busy} onClick={() => saveEdit(item.id)}>
                    Salvar
                  </Button>
                  <Button type="button" className="flex-1" variant="ghost" disabled={busy} onClick={cancelEdit}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <span className="min-w-0 flex-1 truncate px-1 text-base font-medium text-stone-800">
                  {item.nome}
                </span>
                <button
                  type="button"
                  aria-label={`Editar ${item.nome}`}
                  onClick={() => startEdit(item)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-teal-800 hover:bg-teal-50"
                >
                  <Pencil className="h-5 w-5" />
                </button>
              </>
            )}
          </li>
        ))}
        {data[tab].length === 0 && (
          <li className="rounded-xl border border-dashed border-stone-300 p-4 text-center text-stone-500">
            Nenhum cadastro ainda.
          </li>
        )}
      </ul>
    </div>
  );
}
