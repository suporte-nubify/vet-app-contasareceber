import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContaForm } from "@/components/conta-form";
import { DeleteContaButton } from "@/components/delete-conta-button";
import { formatDateBR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EditarContaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [conta, tutores, procedimentos, estabelecimentos, formas] = await Promise.all([
    prisma.contaReceber.findUnique({ where: { id } }),
    prisma.tutor.findMany({ orderBy: { nome: "asc" } }),
    prisma.procedimento.findMany({ orderBy: { nome: "asc" } }),
    prisma.estabelecimento.findMany({ orderBy: { nome: "asc" } }),
    prisma.formaPagamento.findMany({ orderBy: { nome: "asc" } }),
  ]);

  if (!conta) notFound();

  return (
    <main className="px-4 pt-6">
      <Link href="/contas" className="text-sm font-semibold text-teal-800">
        ← Voltar
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold text-teal-950">Editar conta</h1>
      {conta.recebidoEm && (
        <p className="mb-4 text-sm text-stone-500">
          Marcado como recebido em {formatDateBR(conta.recebidoEm)}
        </p>
      )}
      <ContaForm
        initial={{
          id: conta.id,
          data: conta.data.toISOString().slice(0, 10),
          tutorId: conta.tutorId || "",
          nomePet: conta.nomePet,
          procedimentoId: conta.procedimentoId,
          valor: String(conta.valor),
          estabelecimentoId: conta.estabelecimentoId,
          formaPagamentoId: conta.formaPagamentoId || "",
          recebido: conta.recebido,
          observacoes: conta.observacoes || "",
        }}
        tutores={tutores}
        procedimentos={procedimentos}
        estabelecimentos={estabelecimentos}
        formas={formas}
      />
      <div className="mt-6">
        <DeleteContaButton id={conta.id} />
      </div>
    </main>
  );
}
