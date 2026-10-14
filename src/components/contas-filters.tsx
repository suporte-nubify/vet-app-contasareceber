"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Opt = { id: string; nome: string };

type Filters = {
  tutorId?: string;
  procedimentoId?: string;
  estabelecimentoId?: string;
  formaPagamentoId?: string;
  status?: string;
  q?: string;
  de?: string;
  ate?: string;
};

export function ContasFilters({
  filters,
  tutores,
  procedimentos,
  estabelecimentos,
  formas,
}: {
  filters: Filters;
  tutores: Opt[];
  procedimentos: Opt[];
  estabelecimentos: Opt[];
  formas: Opt[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState<Filters>(filters);

  function apply(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/contas?${params.toString()}`);
    setOpen(false);
  }

  function clear() {
    setF({});
    router.push("/contas");
    setOpen(false);
  }

  return (
    <div>
      <Button type="button" variant="secondary" className="w-full" onClick={() => setOpen((o) => !o)}>
        {open ? "Ocultar filtros" : "Filtros"}
      </Button>
      {open && (
        <form onSubmit={apply} className="mt-3 space-y-3 rounded-2xl border border-stone-200 bg-white p-4">
          <div>
            <Label>Busca</Label>
            <Input
              value={f.q || ""}
              onChange={(e) => setF({ ...f, q: e.target.value })}
              placeholder="Pet, tutor, procedimento…"
            />
          </div>
          <div>
            <Label>Status</Label>
            <select
              className="h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-base"
              value={f.status || ""}
              onChange={(e) => setF({ ...f, status: e.target.value })}
            >
              <option value="">Todos</option>
              <option value="aberto">Em aberto</option>
              <option value="recebido">Recebido</option>
            </select>
          </div>
          <div>
            <Label>Tutor</Label>
            <select
              className="h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-base"
              value={f.tutorId || ""}
              onChange={(e) => setF({ ...f, tutorId: e.target.value })}
            >
              <option value="">Todos</option>
              {tutores.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Procedimento</Label>
            <select
              className="h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-base"
              value={f.procedimentoId || ""}
              onChange={(e) => setF({ ...f, procedimentoId: e.target.value })}
            >
              <option value="">Todos</option>
              {procedimentos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Estabelecimento</Label>
            <select
              className="h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-base"
              value={f.estabelecimentoId || ""}
              onChange={(e) => setF({ ...f, estabelecimentoId: e.target.value })}
            >
              <option value="">Todos</option>
              {estabelecimentos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Pagamento</Label>
            <select
              className="h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-base"
              value={f.formaPagamentoId || ""}
              onChange={(e) => setF({ ...f, formaPagamentoId: e.target.value })}
            >
              <option value="">Todos</option>
              {formas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>De</Label>
              <Input
                type="date"
                value={f.de || ""}
                onChange={(e) => setF({ ...f, de: e.target.value })}
              />
            </div>
            <div>
              <Label>Até</Label>
              <Input
                type="date"
                value={f.ate || ""}
                onChange={(e) => setF({ ...f, ate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Aplicar
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={clear}>
              Limpar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
