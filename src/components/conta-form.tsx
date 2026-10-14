"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CadastroSelect, type CadastroOption } from "@/components/cadastro-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ContaFormValues = {
  id?: string;
  data: string;
  tutorId: string;
  nomePet: string;
  procedimentoId: string;
  valor: string;
  estabelecimentoId: string;
  formaPagamentoId: string;
  recebido: boolean;
  observacoes: string;
};

type Props = {
  initial: ContaFormValues;
  tutores: CadastroOption[];
  procedimentos: CadastroOption[];
  estabelecimentos: CadastroOption[];
  formas: CadastroOption[];
};

async function createCadastro(tipo: string, nome: string): Promise<CadastroOption> {
  const res = await fetch(`/api/cadastros/${tipo}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao cadastrar");
  return { id: data.id, nome: data.nome };
}

export function ContaForm({
  initial,
  tutores: t0,
  procedimentos: p0,
  estabelecimentos: e0,
  formas: f0,
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [tutores, setTutores] = useState(t0);
  const [procedimentos, setProcedimentos] = useState(p0);
  const [estabelecimentos, setEstabelecimentos] = useState(e0);
  const [formas, setFormas] = useState(f0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set<K extends keyof ContaFormValues>(key: K, value: ContaFormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const payload = {
      data: form.data,
      tutorId: form.tutorId || null,
      nomePet: form.nomePet,
      procedimentoId: form.procedimentoId,
      valor: Number(form.valor.replace(",", ".")),
      estabelecimentoId: form.estabelecimentoId,
      formaPagamentoId: form.formaPagamentoId || null,
      recebido: form.recebido,
      observacoes: form.observacoes || null,
    };

    const url = form.id ? `/api/contas/${form.id}` : "/api/contas";
    const method = form.id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Não foi possível salvar.");
      return;
    }
    router.push("/contas");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <Label htmlFor="data">Data *</Label>
        <Input
          id="data"
          type="date"
          required
          value={form.data}
          onChange={(e) => set("data", e.target.value)}
        />
      </div>

      <CadastroSelect
        label="Tutor"
        options={tutores}
        value={form.tutorId}
        allowEmpty
        emptyLabel="Sem tutor informado"
        onChange={(id) => set("tutorId", id)}
        onCreate={async (nome) => {
          const c = await createCadastro("tutores", nome);
          setTutores((list) => [...list, c].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")));
          return c;
        }}
      />

      <div>
        <Label htmlFor="pet">Nome do pet *</Label>
        <Input
          id="pet"
          required
          value={form.nomePet}
          onChange={(e) => set("nomePet", e.target.value)}
          placeholder="Ex.: Snoopy"
        />
      </div>

      <CadastroSelect
        label="Procedimento"
        required
        options={procedimentos}
        value={form.procedimentoId}
        onChange={(id) => set("procedimentoId", id)}
        onCreate={async (nome) => {
          const c = await createCadastro("procedimentos", nome);
          setProcedimentos((list) =>
            [...list, c].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
          );
          return c;
        }}
      />

      <div>
        <Label htmlFor="valor">Total (R$) *</Label>
        <Input
          id="valor"
          inputMode="decimal"
          required
          value={form.valor}
          onChange={(e) => set("valor", e.target.value)}
          placeholder="210,00"
        />
      </div>

      <CadastroSelect
        label="Estabelecimento"
        required
        options={estabelecimentos}
        value={form.estabelecimentoId}
        onChange={(id) => set("estabelecimentoId", id)}
        onCreate={async (nome) => {
          const c = await createCadastro("estabelecimentos", nome);
          setEstabelecimentos((list) =>
            [...list, c].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
          );
          return c;
        }}
      />

      <CadastroSelect
        label="Pagamento"
        options={formas}
        value={form.formaPagamentoId}
        allowEmpty
        emptyLabel="Não informado"
        onChange={(id) => set("formaPagamentoId", id)}
        onCreate={async (nome) => {
          const c = await createCadastro("formas-pagamento", nome);
          setFormas((list) => [...list, c].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")));
          return c;
        }}
      />

      <label className="flex min-h-12 items-center gap-3 rounded-xl border border-stone-200 bg-white px-4">
        <input
          type="checkbox"
          className="h-5 w-5 accent-teal-700"
          checked={form.recebido}
          onChange={(e) => set("recebido", e.target.checked)}
        />
        <span className="text-base font-semibold text-stone-800">Recebido / conferido</span>
      </label>

      <div>
        <Label htmlFor="obs">Observações</Label>
        <Input
          id="obs"
          value={form.observacoes}
          onChange={(e) => set("observacoes", e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={busy}>
        {busy ? "Salvando…" : form.id ? "Salvar alterações" : "Criar conta"}
      </Button>
    </form>
  );
}
