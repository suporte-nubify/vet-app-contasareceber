import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ContaForm } from "@/components/conta-form";

export const dynamic = "force-dynamic";

export default async function NovaContaPage() {
  const [tutores, procedimentos, estabelecimentos, formas] = await Promise.all([
    prisma.tutor.findMany({ orderBy: { nome: "asc" } }),
    prisma.procedimento.findMany({ orderBy: { nome: "asc" } }),
    prisma.estabelecimento.findMany({ orderBy: { nome: "asc" } }),
    prisma.formaPagamento.findMany({ orderBy: { nome: "asc" } }),
  ]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="px-4 pt-6">
      <Link href="/contas" className="text-sm font-semibold text-teal-800">
        ← Voltar
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold text-teal-950">Nova conta</h1>
      <p className="mb-5 text-sm text-stone-600">Preencha os dados do lançamento</p>
      <ContaForm
        initial={{
          data: today,
          tutorId: "",
          nomePet: "",
          procedimentoId: "",
          valor: "",
          estabelecimentoId: "",
          formaPagamentoId: "",
          recebido: false,
          observacoes: "",
        }}
        tutores={tutores}
        procedimentos={procedimentos}
        estabelecimentos={estabelecimentos}
        formas={formas}
      />
    </main>
  );
}
