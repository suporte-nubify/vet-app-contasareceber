import { prisma } from "@/lib/prisma";
import { CadastrosManager } from "@/components/cadastros-manager";

export const dynamic = "force-dynamic";

export default async function CadastrosPage() {
  const [tutores, procedimentos, estabelecimentos, formas] = await Promise.all([
    prisma.tutor.findMany({ orderBy: { nome: "asc" } }),
    prisma.procedimento.findMany({ orderBy: { nome: "asc" } }),
    prisma.estabelecimento.findMany({ orderBy: { nome: "asc" } }),
    prisma.formaPagamento.findMany({ orderBy: { nome: "asc" } }),
  ]);

  return (
    <main className="px-4 pt-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral-600">Clínica veterinária</p>
      <h1 className="font-display text-3xl font-semibold text-teal-950">Cadastros</h1>
      <p className="mb-5 text-sm text-stone-600">
        Listas usadas nos lançamentos. Você também pode criar novos ao selecionar um campo.
      </p>
      <CadastrosManager
        initial={{
          tutores,
          procedimentos,
          estabelecimentos,
          "formas-pagamento": formas,
        }}
      />
    </main>
  );
}
