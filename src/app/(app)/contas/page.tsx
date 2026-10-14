import Link from "next/link";
import { PawPrint } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatBRL, formatDateBR } from "@/lib/utils";
import { ContasFilters } from "@/components/contas-filters";
import { ContaRecebidoToggle } from "@/components/conta-recebido-toggle";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type Search = {
  tutorId?: string;
  procedimentoId?: string;
  estabelecimentoId?: string;
  formaPagamentoId?: string;
  status?: string;
  q?: string;
  de?: string;
  ate?: string;
};

export default async function ContasPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const where: Prisma.ContaReceberWhereInput = {};

  if (sp.tutorId) where.tutorId = sp.tutorId;
  if (sp.procedimentoId) where.procedimentoId = sp.procedimentoId;
  if (sp.estabelecimentoId) where.estabelecimentoId = sp.estabelecimentoId;
  if (sp.formaPagamentoId) where.formaPagamentoId = sp.formaPagamentoId;
  if (sp.status === "recebido") where.recebido = true;
  if (sp.status === "aberto") where.recebido = false;
  if (sp.de || sp.ate) {
    where.data = {};
    if (sp.de) where.data.gte = new Date(sp.de);
    if (sp.ate) where.data.lte = new Date(`${sp.ate}T23:59:59`);
  }
  if (sp.q) {
    where.OR = [
      { nomePet: { contains: sp.q } },
      { observacoes: { contains: sp.q } },
      { tutor: { nome: { contains: sp.q } } },
      { procedimento: { nome: { contains: sp.q } } },
      { estabelecimento: { nome: { contains: sp.q } } },
    ];
  }

  const [contas, tutores, procedimentos, estabelecimentos, formas] = await Promise.all([
    prisma.contaReceber.findMany({
      where,
      include: {
        tutor: true,
        procedimento: true,
        estabelecimento: true,
        formaPagamento: true,
      },
      orderBy: [{ data: "desc" }, { createdAt: "desc" }],
    }),
    prisma.tutor.findMany({ orderBy: { nome: "asc" } }),
    prisma.procedimento.findMany({ orderBy: { nome: "asc" } }),
    prisma.estabelecimento.findMany({ orderBy: { nome: "asc" } }),
    prisma.formaPagamento.findMany({ orderBy: { nome: "asc" } }),
  ]);

  const soma = contas.reduce((acc, c) => acc + c.valor, 0);

  return (
    <main className="px-4 pt-6">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral-600">Clínica veterinária</p>
          <h1 className="font-display text-3xl font-semibold text-teal-950">Contas</h1>
          <p className="text-sm text-stone-600">
            {contas.length} item(ns) · {formatBRL(soma)}
          </p>
        </div>
        <Link
          href="/contas/nova"
          className="inline-flex min-h-11 items-center rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white shadow-md shadow-teal-700/25"
        >
          Nova
        </Link>
      </header>

      <ContasFilters
        filters={sp}
        tutores={tutores}
        procedimentos={procedimentos}
        estabelecimentos={estabelecimentos}
        formas={formas}
      />

      <ul className="mt-4 space-y-3">
        {contas.length === 0 && (
          <li className="rounded-2xl border border-dashed border-stone-300 bg-white/70 p-6 text-center text-stone-500">
            Nenhuma conta encontrada com esses filtros.
          </li>
        )}
        {contas.map((c) => (
          <li key={c.id} className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {formatDateBR(c.data)}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-lg font-semibold text-stone-900">
                  <PawPrint className="h-4 w-4 shrink-0 text-coral-500" />
                  {c.nomePet}
                  {c.tutor ? (
                    <span className="font-normal text-stone-500"> · {c.tutor.nome}</span>
                  ) : null}
                </p>
                <p className="text-sm text-stone-600">{c.procedimento.nome}</p>
                <p className="text-sm text-stone-500">{c.estabelecimento.nome}</p>
                {c.formaPagamento && (
                  <p className="text-sm text-stone-500">Pagamento: {c.formaPagamento.nome}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-display text-xl font-semibold text-teal-900">
                  {formatBRL(c.valor)}
                </p>
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    c.recebido ? "bg-teal-100 text-teal-800" : "bg-coral-100 text-coral-800"
                  }`}
                >
                  {c.recebido ? "Recebido" : "Em aberto"}
                </span>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <ContaRecebidoToggle id={c.id} recebido={c.recebido} />
              <Link
                href={`/contas/${c.id}`}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-800"
              >
                Editar
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
